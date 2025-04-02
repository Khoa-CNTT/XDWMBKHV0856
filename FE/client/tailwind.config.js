/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E11D48",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F0F1F3",
          foreground: "#020817",
        },
        accent: {
          DEFAULT: "#6D7074",
          foreground: "#020817",
        },
        background: "#FAFAFB",
        foreground: "#020817",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#020817",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#020817",
        },
        muted: {
          DEFAULT: "#F0F1F3",
          foreground: "#6D7074",
        },
        destructive: {
          DEFAULT: "#FF4C4C",
          foreground: "#FFFFFF",
        },
        border: "#E0E0E0",
        input: "#E0E0E0",
        ring: "#E11D48",
        chart: {
          1: "#FF6F61",
          2: "#4CAF50",
          3: "#03A9F4",
          4: "#FFC107",
          5: "#8E44AD",
        },
        // Thêm màu cho form đăng ký
        form: {
          input: {
            DEFAULT: "#FFFFFF",
            border: "#E0E0E0",
            focus: "#E11D48",
            error: "#FF4C4C",
          },
          button: {
            social: {
              facebook: "#1877F2",
              google: "#DB4437",
              apple: "#000000",
            },
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        heading: "28px",
        body: "16px",
        // Thêm kích thước font cho form
        form: {
          title: "2.25rem", // 36px
          subtitle: "1.125rem", // 18px
          input: "0.875rem", // 14px
          error: "0.75rem", // 12px
        },
      },
      fontWeight: {
        heading: "600",
        body: "400",
      },
      borderRadius: {
        sm: "0.125rem",
        // Thêm border radius cho form
        form: "0.5rem", // 8px
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        // Thêm shadow cho form
        form: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        input: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      spacing: {
        // Thêm spacing cho form
        form: {
          input: "0.75rem", // 12px
          gap: "1.5rem", // 24px
          padding: "2rem", // 32px
        },
      },
      animation: {
        // Thêm animation cho form
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
