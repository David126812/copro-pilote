import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 8;

  const handleSignUp = async () => {
    if (!canSubmit) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("already")) {
          toast.error("Cet email est déjà utilisé");
        } else if (error.message.includes("password")) {
          toast.error("Le mot de passe doit contenir au moins 8 caractères");
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Create minimal profile
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
        });

        navigate("/onboarding");
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    }

    setLoading(false);
  };

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error("Email ou mot de passe incorrect");
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch {
      toast.error("Erreur de connexion au serveur");
    }

    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      handleSignUp();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 bg-card" style={{ minHeight: "calc(812px - 54px)" }}>
      {/* Logo */}
      <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center mb-5">
        <span className="text-primary-foreground text-[22px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
          S
        </span>
      </div>

      <h1 className="text-[22px] font-bold text-foreground text-center mb-2 leading-tight">
        {mode === "signup" ? "Créer votre compte Septrion" : "Se connecter à Septrion"}
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-10">
        {mode === "signup"
          ? "Centralisez les dossiers de votre copropriété"
          : "Retrouvez vos dossiers en quelques secondes"}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email</label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-3.5 rounded-[10px] border border-border bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe (8 caractères min)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-3.5 pr-12 rounded-[10px] border border-border bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password.length > 0 && password.length < 8 && (
            <p className="text-[11px] text-destructive mt-1">8 caractères minimum</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full py-3.5 rounded-[10px] btn-gradient text-primary-foreground text-[15px] font-semibold border-none cursor-pointer transition disabled:opacity-40"
        >
          {loading
            ? "Chargement..."
            : mode === "signup"
              ? "Créer mon compte"
              : "Se connecter"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "signup" ? "login" : "signup")}
        className="mt-6 text-sm text-primary font-medium hover:underline"
      >
        {mode === "signup" ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? S'inscrire"}
      </button>
    </div>
  );
};

export default Auth;
