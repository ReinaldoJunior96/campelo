/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        tinta: {
          DEFAULT: "#112E4B",
          funda: "#0C2340",
        },
        mare: "#6386AC",
        espuma: "#BBD8EC",
        areia: {
          DEFAULT: "#FDF6E5",
          funda: "#F2E6CC",
        },
        barro: {
          DEFAULT: "#A9502F",
          escuro: "#7E3A21",
        },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        sans: ["Karla", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      fontSize: {
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.16em" }],
      },
      // Degraus fora da escala padrão do Tailwind (que pula de 10 para 20,
      // de 30 para 40 e assim por diante). Sem declarar aqui, classes como
      // `border-tinta/15` são simplesmente ignoradas na geração do CSS.
      opacity: {
        15: "0.15",
        35: "0.35",
        55: "0.55",
        72: "0.72",
        85: "0.85",
      },
      borderRadius: {
        bloco: "24px",
        cartao: "20px",
      },
      maxWidth: {
        leitura: "68ch",
      },
      transitionTimingFunction: {
        mare: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
