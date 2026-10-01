<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep all catalogue inventory in `src/data/produtos.json` and store information in `src/data/loja.ts` so non-UI updates never require component edits.
- Keep the catalogue as a single anchor-navigated public route because the requested experience is one continuous mobile-first storefront.
