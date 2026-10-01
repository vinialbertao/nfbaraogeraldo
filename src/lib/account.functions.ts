import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error: profileError } = await context.supabase.from("profiles").delete().eq("id", context.userId);
    if (profileError) throw new Error("Não foi possível excluir os dados da conta.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(context.userId);
    if (error) throw new Error("Não foi possível excluir a conta.");
    return { ok: true };
  });
