import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(0 0% 90%)",
        input: "hsl(0 0% 96%)",
        ring: "hsl(0 0% 4%)",
        background: "#ffffff",
        foreground: "#0a0a0a",
        primary: {
          DEFAULT: "#111827",
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#f3f4f6",
          foreground: "#111827"
        },
        muted: {
          DEFAULT: "#f6f7f9",
          foreground: "#6b7280"
        },
        accent: {
          DEFAULT: "#0ea5e9",
          foreground: "#ffffff"
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff"
        },
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        '2xl': "1.25rem",
      },
    },
  },
  plugins: [],
}
export default config
