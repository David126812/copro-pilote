import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WHATSAPP_VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN")!;
const WHATSAPP_ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN")!;
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

// ============================================
// WhatsApp webhook verification
// ============================================
function handleVerification(url: URL): Response {
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// ============================================
// Download media from WhatsApp
// ============================================
async function downloadMedia(mediaId: string): Promise<{ buffer: ArrayBuffer; mimeType: string }> {
  const metaRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
    headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
  });
  const metaData = await metaRes.json();
  if (metaData.error) throw new Error(`Meta API: ${metaData.error.message}`);

  const fileRes = await fetch(metaData.url, {
    headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
  });
  if (!fileRes.ok) throw new Error(`Download failed: ${fileRes.status}`);

  return { buffer: await fileRes.arrayBuffer(), mimeType: metaData.mime_type || "application/octet-stream" };
}

// ============================================
// Upload to Supabase Storage
// ============================================
async function uploadToStorage(buffer: ArrayBuffer, mimeType: string, filename: string): Promise<string> {
  const ext = mimeType.includes("pdf") ? "pdf" : mimeType.includes("image") ? "jpg" : "bin";
  const path = `documents/${Date.now()}_${filename}.${ext}`;
  const { error } = await supabase.storage.from("Copro bucket").upload(path, buffer, { contentType: mimeType });
  if (error) throw new Error(`Storage: ${error.message}`);
  return supabase.storage.from("Copro bucket").getPublicUrl(path).data.publicUrl;
}

// ============================================
// Analyze with Claude
// ============================================
const ANALYZE_PROMPT = `Tu es un assistant pour un conseil syndical de copropriété. Analyse le contenu envoyé via WhatsApp.

Réponds UNIQUEMENT en JSON valide (pas de markdown) :
{
  "name": "Titre court et clair du dossier (ex: Réfection toiture Bât A, Panne portail parking B)",
  "urgency": "normal" ou "urgent" ou "critique",
  "nextStep": "Prochaine action concrète recommandée",
  "summary": "Résumé factuel en 2-3 phrases des points clés"
}`;

async function analyzeMessage(text: string, mediaBuffer?: ArrayBuffer, mediaMimeType?: string): Promise<{
  name: string; urgency: string; nextStep: string; summary: string;
}> {
  if (ANTHROPIC_API_KEY) {
    try {
      const content: any[] = [];
      if (mediaBuffer && mediaMimeType) {
        const b64 = arrayBufferToBase64(mediaBuffer);
        if (mediaMimeType.includes("pdf")) {
          content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } });
        } else if (mediaMimeType.includes("image")) {
          content.push({ type: "image", source: { type: "base64", media_type: mediaMimeType, data: b64 } });
        }
      }
      if (text) content.push({ type: "text", text: `Message : "${text}"` });
      content.push({ type: "text", text: ANALYZE_PROMPT });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 800, messages: [{ role: "user", content }] }),
      });
      const data = await res.json();
      if (data.content?.[0]?.text) {
        const parsed = JSON.parse(data.content[0].text.replace(/```json\n?|\n?```/g, "").trim());
        if (parsed.name) return parsed;
      }
    } catch (e) { console.error("Claude analyze failed:", e); }
  }

  // Fallback
  let urgency = "normal";
  const lower = text.toLowerCase();
  for (const [kw, lvl] of Object.entries({ panne: "urgent", fuite: "urgent", bloqué: "urgent", inondation: "critique", incendie: "critique", urgent: "urgent", cassé: "urgent" })) {
    if (lower.includes(kw)) { urgency = lvl; break; }
  }
  return { name: text.slice(0, 60) || "Signalement WhatsApp", urgency, nextStep: "À qualifier par le conseil syndical", summary: text };
}

// ============================================
// Find similar existing dossier with Claude
// ============================================
async function findSimilarDossier(analysis: { name: string; summary: string }): Promise<{ id: string; name: string } | null> {
  const { data: dossiers } = await supabase.from("dossiers").select("id, name, last_action").order("updated_at", { ascending: false }).limit(20);
  if (!dossiers || dossiers.length === 0) return null;

  try {
    const dossierList = dossiers.map((d: any) => `- ID: ${d.id} | Nom: "${d.name}"`).join("\n");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [{
          role: "user",
          content: `Dossiers existants :\n${dossierList}\n\nNouveau signalement : "${analysis.name}" — ${analysis.summary}\n\nCe nouveau signalement correspond-il à un dossier existant (même sujet/problème) ?\nRéponds UNIQUEMENT en JSON : {"match": true, "id": "...", "name": "..."} ou {"match": false}`,
        }],
      }),
    });
    const data = await res.json();
    if (data.content?.[0]?.text) {
      const parsed = JSON.parse(data.content[0].text.replace(/```json\n?|\n?```/g, "").trim());
      if (parsed.match && parsed.id) return { id: parsed.id, name: parsed.name };
    }
  } catch (e) { console.error("Similarity check failed:", e); }

  return null;
}

// ============================================
// Create signalement (inbox, before qualification)
// ============================================
async function createSignalement(
  analysis: { name: string; urgency: string; nextStep: string; summary: string },
  documentUrl?: string, senderName?: string, senderPhone?: string,
): Promise<string> {
  const { data, error } = await supabase.from("signalements").insert({
    name: analysis.name,
    urgency: analysis.urgency,
    summary: analysis.summary,
    next_step: analysis.nextStep,
    sender_name: senderName || null,
    sender_phone: senderPhone || null,
    document_url: documentUrl || null,
    status: "nouveau",
    raw_analysis: analysis,
  }).select("id").single();
  if (error) throw new Error(`Insert signalement failed: ${error.message}`);
  return data.id;
}

// ============================================
// Create dossier (used when qualifying a signalement)
// ============================================
async function createDossier(
  analysis: { name: string; urgency: string; nextStep: string; summary: string },
  documentUrl?: string, senderName?: string,
): Promise<string> {
  const dateLabel = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const documents = documentUrl ? [{ name: documentUrl.split("/").pop() || "Document", type: "WhatsApp" }] : [];
  const { data, error } = await supabase.from("dossiers").insert({
    name: analysis.name, status: "en_cours", urgency: analysis.urgency, responsible: "",
    next_step: analysis.nextStep, last_action: analysis.summary, created_via_agent: true,
    timeline: [{ date: dateLabel, label: `Signalement WhatsApp${senderName ? ` (${senderName})` : ""}`, done: true }],
    documents, prestataires: [], syndic_history: [],
  }).select("id").single();
  if (error) throw new Error(`Insert failed: ${error.message}`);
  return data.id;
}

// ============================================
// Send WhatsApp messages
// ============================================
async function sendTextReply(to: string, text: string) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: text } }),
  });
  const data = await res.json();
  console.log("WhatsApp send result:", JSON.stringify(data));
  return data;
}

async function sendDuplicateQuestion(to: string, newName: string, existingName: string, existingId: string) {
  const appUrl = `https://david126812.github.io/copro-pilote/dossiers/${existingId}`;
  await sendTextReply(to,
    `Un dossier similaire existe deja :\n\n"${existingName}"\n${appUrl}\n\nVotre signalement : "${newName}"\n\nEst-ce le meme sujet ?\nRepondez OUI ou NON`
  );
}

// ============================================
// Main handler
// ============================================
Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (req.method === "GET") return handleVerification(url);

  if (req.method === "POST") {
    try {
      const body = await req.json();

      // === Direct PDF test mode ===
      if (body.test_direct_pdf && body.pdf_base64) {
        const binaryStr = atob(body.pdf_base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
        const analysis = await analyzeMessage(body.caption || "", bytes.buffer, "application/pdf");
        const similar = await findSimilarDossier(analysis);
        if (similar) {
          return new Response(JSON.stringify({ similar, analysis, action: "would_ask_confirmation" }), {
            status: 200, headers: { "Content-Type": "application/json" },
          });
        }
        const dossierId = await createDossier(analysis, undefined, body.sender_name || "Test");
        return new Response(JSON.stringify({ success: true, dossierId, analysis }), {
          status: 200, headers: { "Content-Type": "application/json" },
        });
      }

      // === WhatsApp webhook ===
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const message = change?.value?.messages?.[0];
      if (!message) return new Response("OK", { status: 200 });

      const senderPhone = message.from;
      const senderName = change?.value?.contacts?.[0]?.profile?.name || "";

      // --- Handle replies to duplicate question (OUI/NON or button) ---
      const isButtonReply = message.type === "interactive" && message.interactive?.type === "button_reply";
      const textBody = message.text?.body?.trim().toUpperCase() || "";
      const isOuiNon = message.type === "text" && (textBody === "OUI" || textBody === "NON");

      if (isButtonReply || isOuiNon) {
        const buttonId = isButtonReply
          ? message.interactive.button_reply.id
          : (textBody === "OUI" ? "same_yes" : "same_no");
        console.log(`Reply: ${buttonId} from ${senderPhone}`);

        // Fetch pending dossier for this user
        const { data: pending } = await supabase
          .from("pending_dossiers")
          .select("*")
          .eq("sender_phone", senderPhone)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!pending) {
          await sendTextReply(senderPhone, "Aucun signalement en attente.");
          return new Response("OK", { status: 200 });
        }

        if (buttonId === "same_yes") {
          // User confirmed it's the same dossier — don't create
          const appUrl = `https://david126812.github.io/copro-pilote/dossiers/${pending.matched_dossier_id}`;
          await sendTextReply(senderPhone, `Compris, pas de nouveau dossier créé.\n\nLe dossier existant :\n"${pending.matched_dossier_name}"\n${appUrl}`);
          await supabase.from("pending_dossiers").delete().eq("id", pending.id);
        } else if (buttonId === "same_no") {
          // User said it's a new topic — create the dossier
          const analysis = pending.analysis as any;
          const dossierId = await createDossier(analysis, pending.document_url || undefined, pending.sender_name || senderName);
          const appUrl = `https://david126812.github.io/copro-pilote/dossiers/${dossierId}`;
          await sendTextReply(senderPhone, `Nouveau dossier créé : "${analysis.name}"\n\n${appUrl}`);
          await supabase.from("pending_dossiers").delete().eq("id", pending.id);
        }

        return new Response("OK", { status: 200 });
      }

      // --- Handle text / document / image messages ---
      let text = "";
      if (message.type === "text") {
        text = message.text?.body || "";
      } else if (message.type === "document" || message.type === "image") {
        text = message[message.type]?.caption || "";
      }

      // Download media if present
      let documentUrl: string | undefined;
      let mediaBuffer: ArrayBuffer | undefined;
      let mediaMimeType: string | undefined;
      const mediaId = message.document?.id || message.image?.id;

      if (mediaId) {
        try {
          const media = await downloadMedia(mediaId);
          mediaBuffer = media.buffer;
          mediaMimeType = media.mimeType;
          documentUrl = await uploadToStorage(media.buffer, media.mimeType, mediaId);
        } catch (e) {
          console.error("Media failed:", e);
        }
      }

      // Analyze with Claude
      const analysis = await analyzeMessage(text, mediaBuffer, mediaMimeType);
      console.log("Analysis:", JSON.stringify(analysis));

      // Create signalement (goes to inbox for CS qualification)
      const signalementId = await createSignalement(analysis, documentUrl, senderName, senderPhone);
      console.log(`Signalement created: ${signalementId} — "${analysis.name}"`);

      const appUrl = `https://david126812.github.io/copro-pilote/signalements`;
      await sendTextReply(senderPhone,
        `Signalement recu : "${analysis.name}"\nUrgence : ${analysis.urgency}\n\nLe conseil syndical va qualifier ce signalement.\n${appUrl}`
      );

      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response(JSON.stringify({ error: String(error) }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
