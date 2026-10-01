import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NF Barão | Tabacaria e Head Shop em Barão Geraldo, Campinas" },
      { name: "description", content: "Catálogo da NF Barão: head shop, narguilé, charutos, tereré, incensos e presentes em Barão Geraldo, Campinas." },
      { property: "og:title", content: "NF Barão | Tabacaria e Head Shop em Barão Geraldo, Campinas" },
      { property: "og:description", content: "Explore o catálogo da NF Barão e envie sua lista de produtos pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <CatalogPage />;
}
