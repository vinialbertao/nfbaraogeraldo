CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_adult_birth_date()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.data_nascimento > (current_date - interval '18 years')::date THEN
    RAISE EXCEPTION 'É necessário ter 18 anos ou mais';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  nome text NOT NULL CHECK (char_length(trim(nome)) >= 2),
  whatsapp text NOT NULL CHECK (whatsapp ~ '^[0-9]{10,13}$'),
  data_nascimento date NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clientes veem o proprio perfil" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Clientes criam o proprio perfil" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Clientes atualizam o proprio perfil" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Clientes removem o proprio perfil" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER profiles_validate_adult BEFORE INSERT OR UPDATE OF data_nascimento ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.validate_adult_birth_date();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.enderecos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  apelido text NOT NULL,
  rua text NOT NULL,
  numero text NOT NULL,
  complemento text,
  bairro text NOT NULL,
  cidade text NOT NULL,
  estado text NOT NULL CHECK (char_length(estado) = 2),
  cep text NOT NULL CHECK (cep ~ '^[0-9]{8}$'),
  principal boolean NOT NULL DEFAULT false,
  criado_em timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enderecos TO authenticated;
GRANT ALL ON public.enderecos TO service_role;
ALTER TABLE public.enderecos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clientes veem os proprios enderecos" ON public.enderecos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Clientes criam os proprios enderecos" ON public.enderecos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Clientes atualizam os proprios enderecos" ON public.enderecos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Clientes removem os proprios enderecos" ON public.enderecos FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE UNIQUE INDEX enderecos_um_principal_por_cliente ON public.enderecos(user_id) WHERE principal;
CREATE INDEX enderecos_user_id_idx ON public.enderecos(user_id);
CREATE TRIGGER enderecos_updated_at BEFORE UPDATE ON public.enderecos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.favoritos (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  produto_id integer NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, produto_id)
);
GRANT SELECT, INSERT, DELETE ON public.favoritos TO authenticated;
GRANT ALL ON public.favoritos TO service_role;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clientes veem os proprios favoritos" ON public.favoritos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Clientes criam os proprios favoritos" ON public.favoritos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Clientes removem os proprios favoritos" ON public.favoritos FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  criado_em timestamptz NOT NULL DEFAULT now(),
  total numeric(12,2) NOT NULL CHECK (total >= 0),
  forma text NOT NULL CHECK (forma IN ('retirada', 'entrega')),
  endereco_texto text,
  status text NOT NULL DEFAULT 'enviado',
  CHECK (forma = 'retirada' OR nullif(trim(endereco_texto), '') IS NOT NULL)
);
GRANT SELECT, INSERT ON public.pedidos TO authenticated;
GRANT ALL ON public.pedidos TO service_role;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clientes veem os proprios pedidos" ON public.pedidos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Clientes criam os proprios pedidos" ON public.pedidos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX pedidos_user_data_idx ON public.pedidos(user_id, criado_em DESC);

CREATE TABLE public.pedido_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  produto_id integer NOT NULL,
  nome text NOT NULL,
  preco_unitario numeric(12,2) NOT NULL CHECK (preco_unitario >= 0),
  quantidade integer NOT NULL CHECK (quantidade > 0)
);
GRANT SELECT, INSERT ON public.pedido_itens TO authenticated;
GRANT ALL ON public.pedido_itens TO service_role;
ALTER TABLE public.pedido_itens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clientes veem itens dos proprios pedidos" ON public.pedido_itens FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.pedidos p WHERE p.id = pedido_id AND p.user_id = auth.uid()));
CREATE POLICY "Clientes criam itens nos proprios pedidos" ON public.pedido_itens FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.pedidos p WHERE p.id = pedido_id AND p.user_id = auth.uid()));
CREATE INDEX pedido_itens_pedido_id_idx ON public.pedido_itens(pedido_id);