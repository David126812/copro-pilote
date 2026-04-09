import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Send, FolderOpen, FileText, ChevronRight, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";

interface AgentTurn {
  role: "user" | "agent";
  text: string;
  isVoice?: boolean;
  actions?: { type: string; label: string; target: string }[];
  dossiers?: { id: string; name: string; status: string }[];
}

const SUGGESTIONS = [
  "Où en est l'ascenseur ?",
  "Quels dossiers sont bloqués ?",
  "Résume la situation",
];

const AssistantIA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const chatRef = useRef<HTMLDivElement>(null);
  const [turns, setTurns] = useState<AgentTurn[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [coproId, setCoproId] = useState<string | null>(null);

  // Load copro_id
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("copro_id").eq("id", user.id).single()
      .then(({ data }) => setCoproId(data?.copro_id || null));
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [turns, isAgentTyping]);

  const sendQuestion = async (question: string, isVoice = false) => {
    if (!coproId) return;

    // Add user turn
    const userTurn: AgentTurn = { role: "user", text: question, isVoice };
    setTurns(prev => [...prev, userTurn]);
    setIsAgentTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke("assistant-query", {
        body: { question, copro_id: coproId },
      });

      // Simulate typing delay proportional to response length
      const responseText = data?.data?.response || "Je n'ai pas pu traiter votre question.";
      const delay = Math.min(1800, Math.max(700, responseText.length * 6));

      setTimeout(() => {
        setIsAgentTyping(false);

        const agentTurn: AgentTurn = {
          role: "agent",
          text: responseText,
          dossiers: data?.data?.matched_dossiers || [],
          actions: data?.data?.suggested_actions || [],
        };

        setTurns(prev => [...prev, agentTurn]);
      }, delay);

    } catch {
      setIsAgentTyping(false);
      setTurns(prev => [...prev, { role: "agent", text: "Erreur de connexion. Réessayez." }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    sendQuestion(textInput.trim());
    setTextInput("");
  };

  const handleMicPress = async () => {
    if (isRecording) return;
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(chunks, { type: "audio/webm" });

        // Send to Whisper API via Edge Function or direct
        // For MVP: use Web Speech API as fallback
        try {
          const recognition = new (window as any).webkitSpeechRecognition || new (window as any).SpeechRecognition();
          recognition.lang = "fr-FR";
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) sendQuestion(transcript, true);
          };
          recognition.onerror = () => {
            setTurns(prev => [...prev, { role: "agent", text: "Impossible de transcrire l'audio. Tapez votre question." }]);
          };
          // For now, fallback to typed input
        } catch {
          // Speech recognition not available
        }

        setIsRecording(false);
      };

      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorder.state === "recording") mediaRecorder.stop();
      }, 5000); // Max 5 seconds recording

    } catch {
      setIsRecording(false);
      // Fallback: use Web Speech API
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = "fr-FR";
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) sendQuestion(transcript, true);
          setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognition.start();
      } else {
        setIsRecording(false);
      }
    }
  };

  const handleAction = (action: { type: string; label: string; target: string }) => {
    if (action.type === "view_dossier") {
      navigate(`/dossiers/${action.target}`);
    } else if (action.type === "create_signalement") {
      navigate("/signaler-incident");
    }
  };

  const idle = turns.length === 0;

  return (
    <div className="bg-card flex flex-col" style={{ height: "calc(812px - 54px)" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center">
            <span className="text-primary-foreground text-[13px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>S</span>
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-foreground">Assistant Septrion</h1>
            <p className="text-[11px] text-muted-foreground">Posez une question sur vos dossiers</p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-5 pb-3 [&::-webkit-scrollbar]:hidden">
        {idle ? (
          /* Idle state — mic + suggestions */
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <button
              onClick={handleMicPress}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-primary scale-110 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
                  : "bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 active:scale-95"
              }`}
            >
              <Mic className={`h-10 w-10 ${isRecording ? "text-primary-foreground animate-pulse" : "text-primary"}`} />
            </button>
            <p className="text-[14px] font-semibold text-foreground">
              {isRecording ? "Je vous écoute…" : "Appuyez pour parler"}
            </p>
            <p className="text-[12px] text-muted-foreground text-center max-w-[260px]">
              Ou posez votre question par écrit ci-dessous
            </p>

            {/* Suggestion chips */}
            <div className="space-y-1.5 w-full max-w-sm mt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendQuestion(s)}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[12px] bg-card border border-border hover:border-primary/30 transition active:scale-[0.98] text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <p className="flex-1 text-[13px] font-semibold text-foreground">{s}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Conversation */
          <div className="space-y-3 pt-3">
            {turns.map((turn, i) => {
              if (turn.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%]">
                      <div className="flex items-center gap-2">
                        {turn.isVoice && <Mic className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />}
                        <p className="text-[13px]">{turn.text}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              const isLast = i === turns.length - 1;
              return (
                <div key={i} className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full btn-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-[9px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>S</span>
                    </div>
                    <div className="bg-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                      <p className="text-[13px] text-foreground leading-relaxed whitespace-pre-line">{turn.text}</p>
                    </div>
                  </div>

                  {/* Actions — only on last message */}
                  {isLast && turn.actions && turn.actions.length > 0 && (
                    <div className="space-y-1.5 mt-2 ml-9">
                      {turn.actions.map((action, ai) => {
                        const Icon = action.type === "view_dossier" ? FolderOpen : FileText;
                        return (
                          <button
                            key={ai}
                            onClick={() => handleAction(action)}
                            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[12px] bg-card border border-border hover:border-primary/30 transition active:scale-[0.98] text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <p className="flex-1 text-[13px] font-semibold text-foreground">{action.label}</p>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {isAgentTyping && (
              <div className="flex items-start gap-2 animate-in fade-in duration-200">
                <div className="w-7 h-7 rounded-full btn-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-[9px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>S</span>
                </div>
                <div className="bg-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 pb-2 pt-2 border-t border-border bg-card">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Posez votre question..."
            className="flex-1 py-2.5 px-3.5 rounded-full border border-border bg-secondary text-[13px] text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          {textInput.trim() ? (
            <button type="submit" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition">
              <Send className="h-4 w-4 text-primary-foreground" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMicPress}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                isRecording ? "bg-primary" : "bg-primary/10 hover:bg-primary/20"
              }`}
            >
              <Mic className={`h-4 w-4 ${isRecording ? "text-primary-foreground animate-pulse" : "text-primary"}`} />
            </button>
          )}
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default AssistantIA;
