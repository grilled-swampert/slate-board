import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        maven: ['"Maven Pro"', ...fontFamily.sans],
        poppins: ["Poppins", ...fontFamily.sans],
        trirong: ["Trirong", ...fontFamily.serif],
      },
    },
  },
  plugins: [],
};
