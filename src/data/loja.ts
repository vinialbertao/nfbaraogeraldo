export const loja = {
  nome: "NF Barão",
  nomeCompleto: "Nostro Fumo Barão",
  whatsapp: "5519996179369",
  telefoneExibicao: "(19) 99617-9369",
  instagram: "https://instagram.com/nf.barao",
  endereco: "Av. Santa Isabel, 71 – Barão Geraldo, Campinas – SP, 13084-012",
  avaliacao: { nota: 4.9, total: 140 },
  horarios: [
    { dia: "Segunda", abre: "11:00", fecha: "19:30" },
    { dia: "Terça", abre: "11:00", fecha: "19:30" },
    { dia: "Quarta", abre: "11:00", fecha: "19:30" },
    { dia: "Quinta", abre: "11:00", fecha: "19:30" },
    { dia: "Sexta", abre: "11:00", fecha: "19:30" },
    { dia: "Sábado", abre: "11:00", fecha: "19:30" },
    { dia: "Domingo", abre: null, fecha: null },
  ],
} as const;
