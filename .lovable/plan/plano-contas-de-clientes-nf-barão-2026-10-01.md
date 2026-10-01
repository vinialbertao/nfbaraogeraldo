# Plano — Contas de clientes NF Barão

## Resultado
Adicionar cadastro e login opcionais ao catálogo, com perfil, endereços, favoritos, histórico de pedidos e exclusão de conta, sem alterar a origem local dos produtos.

## Etapas
1. Configurar o Lovable Cloud com as tabelas de clientes, endereços, favoritos, pedidos e itens, todas protegidas para cada cliente acessar somente os próprios dados.
2. Criar as páginas de entrar/cadastrar, recuperação de senha, redefinição de senha e Política de Privacidade.
3. Atualizar o cabeçalho para mostrar “Entrar” ou o menu da conta conforme a sessão.
4. Adicionar favoritos aos produtos e a página “Minha conta” com pedidos, favoritos, dados, endereços via CEP e privacidade.
5. Integrar clientes e endereços salvos à lista de pedido; registrar o pedido antes de enviar a mensagem, sem impedir a abertura do WhatsApp em caso de falha.
6. Validar cadastro de maiores de 18 anos, recuperação de senha, navegação, favoritos, pedidos e visual em celular e computador.

## Detalhes técnicos
- O catálogo permanece em `src/data/produtos.json` e os dados da loja em `src/data/loja.ts`.
- O login é opcional; visitantes continuam usando o catálogo e o pedido pelo WhatsApp.
- O banco já foi preparado com regras de acesso por usuário e validação de idade.
- A exclusão de conta será feita com validação segura no servidor.
