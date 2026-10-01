import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({ head: () => ({ meta: [
  { title: "Redefinir senha | NF Barão" }, { name: "description", content: "Crie uma nova senha para sua conta NF Barão." },
  { property: "og:title", content: "Redefinir senha | NF Barão" }, { property: "og:description", content: "Recupere o acesso à sua conta NF Barão." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
] }), component: ResetPassword });
function ResetPassword() {
  const [ready, setReady] = useState(false); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => { const hash = new URLSearchParams(window.location.hash.slice(1)); setReady(hash.get("type") === "recovery" || Boolean(hash.get("access_token"))); }, []);
  const submit = async (e: FormEvent) => { e.preventDefault(); setError(""); if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres."); const { error: authError } = await supabase.auth.updateUser({ password }); if (authError) setError(authError.message); else setMessage("Senha atualizada com sucesso."); };
  return <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground"><div className="w-full max-w-md border border-border bg-card p-7"><h1 className="font-display text-4xl uppercase">Nova senha</h1>{message ? <div className="mt-6"><CheckCircle2 className="mb-3 size-10 text-primary" /><p>{message}</p><Button asChild className="mt-5"><Link to="/auth">Entrar</Link></Button></div> : ready ? <form onSubmit={submit} className="mt-6"><label className="text-sm font-bold">Nova senha<input type="password" minLength={8} required className="field mt-2" value={password} onChange={e => setPassword(e.target.value)} /></label>{error && <p className="mt-3 text-sm text-destructive">{error}</p>}<Button size="xl" className="mt-5 w-full">Salvar nova senha</Button></form> : <p className="mt-5 text-muted-foreground">Este link é inválido ou expirou. Solicite uma nova recuperação.</p>}<Link to="/auth" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="size-4" /> Voltar</Link></div></main>;
}
