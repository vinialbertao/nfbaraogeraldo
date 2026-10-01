# Plano — Catálogo NF Barão

## Resultado
Criar uma página única, mobile-first, com identidade urbana escura, catálogo pesquisável, lista de pedido persistente e finalização pelo WhatsApp.

## Etapas
1. Definir a identidade visual em tokens: fundo carvão, superfícies escuras, verde NF, vermelho de selo, detalhes de madeira, Anton nos títulos e Inter nos textos.
2. Criar os arquivos separados de produtos e informações da loja, mantendo preços e dados fáceis de atualizar.
3. Montar cabeçalho fixo, imagem de fachada, diferenciais, catálogo com busca e filtros, seção da loja, avaliações, localização, mapa e rodapé legal.
4. Implementar confirmação de maioridade, menu móvel, lista de pedido com quantidades, total, retirada/entrega, persistência local e mensagem formatada para o WhatsApp.
5. Adicionar imagens próprias da fachada e do interior, placeholders visuais por categoria, animações discretas e acessibilidade.
6. Configurar título, descrição e compartilhamento social; validar o resultado em celular e desktop.

## Detalhes técnicos
- A aplicação continuará em TanStack Start/React, TypeScript e Tailwind v4.
- Sem banco de dados, login ou pagamento online.
- Produtos em `src/data/produtos.json`; dados da loja em `src/data/loja.ts`.
- Toda a experiência ficará em `/`, com navegação por âncoras conforme solicitado.
- Carrinho e confirmação de idade usarão armazenamento do navegador.
