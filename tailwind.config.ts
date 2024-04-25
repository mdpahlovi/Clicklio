import type { Config } from "tailwindcss";

const config = {
    prefix: "",
    darkMode: ["class"],
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: { "2xl": "1400px" },
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    content: "hsl(var(--primary-content))",
                    dark: "hsl(var(--primary-dark))",
                    light: "hsl(var(--primary-light))",
                },

                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    content: "hsl(var(--secondary-content))",
                    dark: "hsl(var(--secondary-dark))",
                    light: "hsl(var(--secondary-light))",
                },

                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                border: "hsl(var(--border))",

                content: {
                    DEFAULT: "hsl(var(--content))",
                    light: "hsl(var(--content-light))",
                    lighter: "hsl(var(--content-lighter))",
                },

                success: {
                    DEFAULT: "hsl(var(--success))",
                    content: "hsl(var(--success-content))",
                },

                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    content: "hsl(var(--warning-content))",
                },

                error: {
                    DEFAULT: "hsl(var(--error))",
                    content: "hsl(var(--error-content))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
