import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-card px-5 pb-6 pt-5 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition"
      >
        <ArrowLeft className="h-5 w-5" />
        Retour
      </button>

      <h1 className="text-xl font-bold text-foreground mb-5">Politique de confidentialité</h1>

      <div className="prose prose-sm prose-invert max-w-none space-y-4 text-[13px] text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-[15px] font-semibold text-foreground">1. Données collectées</h2>
          <p>Septrion collecte les données suivantes dans le cadre de son fonctionnement :</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Email et mot de passe (inscription)</li>
            <li>Prénom et nom de la copropriété (profil)</li>
            <li>Numéro de téléphone WhatsApp (liaison compte)</li>
            <li>Documents envoyés (PDF, images, texte) pour analyse</li>
            <li>Données de navigation et d'usage (analytics)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[15px] font-semibold text-foreground">2. Finalités du traitement</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Gérer votre compte et votre authentification</li>
            <li>Analyser les documents de votre copropriété via l'intelligence artificielle</li>
            <li>Structurer et organiser les dossiers de votre copropriété</li>
            <li>Vous envoyer des notifications (WhatsApp, email) si vous y avez consenti</li>
            <li>Améliorer le service via des statistiques anonymisées</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[15px] font-semibold text-foreground">3. Intelligence artificielle</h2>
          <p>
            Les résumés, classifications et analyses de documents sont générés par intelligence artificielle (IA).
            Les documents envoyés sont traités par l'API du fournisseur IA de manière stateless — aucun document
            n'est conservé après analyse ni utilisé pour l'entraînement de modèles.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-semibold text-foreground">4. Base légale</h2>
          <p>
            Le traitement de vos données repose sur votre consentement (inscription, opt-in notifications)
            et l'intérêt légitime du conseil syndical dans l'exercice de son mandat (article 6.1.f du RGPD).
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-semibold text-foreground">5. Sous-traitants</h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>Supabase — hébergement des données et authentification</li>
            <li>Anthropic (Claude) — analyse IA des documents</li>
            <li>Resend — envoi d'emails de notification</li>
            <li>Meta (WhatsApp Business API) — réception et envoi de messages</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[15px] font-semibold text-foreground">6. Durée de conservation</h2>
          <p>
            Vos données sont conservées tant que votre compte est actif. Vous pouvez demander
            la suppression de votre compte et de vos données à tout moment.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-semibold text-foreground">7. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression,
            de portabilité et d'opposition au traitement de vos données personnelles.
            Pour exercer ces droits, contactez-nous à l'adresse indiquée dans l'application.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
