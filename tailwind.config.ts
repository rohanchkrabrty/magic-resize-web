import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
    },
    screens: {
      xs: { max: "550px" },
      sm: { max: "650px" },
      md: { max: "900px" },
    },
  },
  plugins: [],
};
export default config;
