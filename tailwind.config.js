module.exports = {
  content: ["./views/**/*.{hbs,js}", "./views/*.{hbs,js}", "./public/assets/js/*.js"],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        "black-900": "#242625",
        "green-300": "var(--green-clear)",
        "green-500": "var(--green)",
        "green-700": "var(--green-dark)",
      },
      spacing: {
        "4-vh": "4vh",
        "6-vh": "6vh",
        "8-vh": "8vh",
        "10-vh": "10vh",
        "12-vh": "12vh",
        "14-vh": "14vh",
        "18-vh": "18vh",
        "20-vh": "20vh",
        "54-vh": "54vh",
        "56-vh": "56vh",
        "58-vh": "58vh",
        "60-vh": "60vh",
        "70-vh": "70vh",
        "74-vh": "74vh",
        "80-vh": "80vh",
      },
    },
  },
  plugins: [],
};
