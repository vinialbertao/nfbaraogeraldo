import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({ next: typeof search.next === "string" && search.next.startsWith("/") ? search.next : "/conta" }),
  head: () => ({ meta: [
    { title: "Entrar ou criar conta | NF Barão" },
    { name: "description", content: "Acesse sua conta NF Barão para salvar favoritos, endereços e acompanhar pedidos." },
    { property: "og:title", content: "Conta NF Barão" },
    { property: "og:description", content: "Entre ou crie sua conta NF Barão." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}),
  component: AuthPage,
});

function ageFrom(date: string) {
  const birth = new Date(`${date}T12:00:00`); const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}

function AuthPage() {
  const { next } = Route.useSearch(); const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const [form, setForm] = useState({ nome: "", email: "", senha: "", whatsapp: "", nascimento: "", privacy: false });
  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(v => ({ ...v, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try {
      if (mode === "forgot") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo: `${window.location.origin}/reset-password` });
        if (authError) throw authError; setMessage("Enviamos as instruções de recuperação para seu e-mail.");
      } else if (mode === "signup") {
        if (form.senha.length < 8) throw new Error("A senha precisa ter pelo menos 8 caracteres.");
        if (!form.privacy) throw new Error("Aceite a Política de Privacidade para continuar.");
        if (!form.nascimento || ageFrom(form.nascimento) < 18) throw new Error("O cadastro é permitido somente para maiores de 18 anos.");
        const whatsapp = form.whatsapp.replace(/\D/g, "");
        if (whatsapp.length < 10) throw new Error("Informe um WhatsApp válido.");
        const { data, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.senha, options: { emailRedirectTo: window.location.origin, data: { nome: form.nome.trim(), whatsapp, data_nascimento: form.nascimento } } });
        if (authError) throw authError;
        if (data.session && data.user) await supabase.from("profiles").upsert({ id: data.user.id, nome: form.nome.trim(), whatsapp, data_nascimento: form.nascimento });
        setMessage("Cadastro criado. Confira seu e-mail para confirmar a conta.");
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.senha });
        if (authError) throw authError;
        const metadata = data.user.user_metadata;
        await supabase.from("profiles").upsert({ id: data.user.id, nome: String(metadata.nome ?? data.user.email?.split("@")[0] ?? "Cliente"), whatsapp: String(metadata.whatsapp ?? "11999999999"), data_nascimento: String(metadata.data_nascimento ?? "2000-01-01") }, { onConflict: "id", ignoreDuplicates: true });
        await navigate({ to: next });
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível continuar."); } finally { setBusy(false); }
  };
  return <main className="min-h-screen bg-background px-4 py-8 text-foreground"><div className="mx-auto max-w-md"><Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Voltar ao catálogo</Link><div className="border border-border bg-card p-6 sm:p-8"><div className="mb-7 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary"><Leaf /></span><div><p className="text-xs font-bold uppercase text-primary">NF Barão</p><h1 className="font-display text-3xl uppercase">{mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar senha"}</h1></div></div><form onSubmit={submit} className="space-y-4">{mode === "signup" && <><label className="block text-sm font-bold">Nome completo<input required className="field mt-1.5" value={form.nome} onChange={field("nome")} /></label><label className="block text-sm font-bold">WhatsApp<input required inputMode="tel" className="field mt-1.5" placeholder="(19) 99999-9999" value={form.whatsapp} onChange={field("whatsapp")} /></label><label className="block text-sm font-bold">Data de nascimento<input required type="date" className="field mt-1.5" value={form.nascimento} onChange={field("nascimento")} /></label></>}<label className="block text-sm font-bold">E-mail<input required type="email" autoComplete="email" className="field mt-1.5" value={form.email} onChange={field("email")} /></label>{mode !== "forgot" && <label className="block text-sm font-bold">Senha<div className="relative mt-1.5"><input required minLength={8} type={show ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} className="field pr-12" value={form.senha} onChange={field("senha")} /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1" onClick={() => setShow(v => !v)} aria-label={show ? "Ocultar senha" : "Mostrar senha"}>{show ? <EyeOff /> : <Eye />}</Button></div></label>}{mode === "signup" && <label className="flex gap-3 text-sm text-muted-foreground"><input required type="checkbox" className="mt-1 accent-primary" checked={form.privacy} onChange={field("privacy")} /><span>Li e aceito a <Link to="/privacidade" className="font-bold text-primary underline">Política de Privacidade</Link>.</span></label>}{error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}{message && <p className="rounded-md bg-primary/10 p-3 text-sm text-primary">{message}</p>}<Button size="xl" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}{mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar instruções"}</Button></form><div className="mt-6 space-y-2 text-center text-sm">{mode === "login" && <button className="font-semibold text-primary hover:underline" onClick={() => setMode("forgot")}>Esqueci minha senha</button>}<div><button className="font-semibold text-muted-foreground hover:text-primary" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); setMessage(""); }}>{mode === "signup" ? "Já tenho conta" : "Ainda não tenho conta"}</button></div></div></div></div></main>;
}
