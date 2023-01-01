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
      animation: {
        stagger: "stagger var(--animation-time) ease-in-out forwards 1",
        fadein:
          "fadein var(--animation-time-fade-in) ease-in-out var(--xs-animation-delay) forwards 1",
        fromRight:
          "fromRight var(--sm-animation-delay) ease-in-out var(--sm-animation-delay) forwards 1",
        fromLeft: "fromLeft var(--animation-time) ease-in-out var(--sm-animation-delay) forwards 1",
        fromBottom:
          "fromBottom var(--animation-time) ease-in-out var(--md-animation-delay) forwards 1",
        fromTop: "fromTop var(--animation-time) ease-in-out var(--md-animation-delay) forwards 1",
      },
      keyframes: {
        stagger: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "60%": { transform: "translateY(-10px)", opacity: 0.8 },
          "100%": { transform: "translateY(0px)", opacity: 1 },
        },
        fadein: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        fromRight: {
          "0%": { transform: "translateX(20px)", opacity: 0.2 },
          "80%": { transform: "translateX(-3px)", opacity: 0.9 },
          "100%": { transform: "translateX(0px)", opacity: 1 },
        },
        fromLeft: {
          "0%": { transform: "translateX(-20px)", opacity: 0.2 },
          "80%": { transform: "translateX(3px)", opacity: 0.9 },
          "100%": { transform: "translateX(0px)", opacity: 1 },
        },
        fromBottom: {
          "0%": { transform: "translateY(20px)", opacity: 0.2 },
          "80%": { transform: "translateY(-3px)", opacity: 0.9 },
          "100%": { transform: "translateY(0px)", opacity: 1 },
        },
        fromTop: {
          "0%": { transform: "translateY(-20px)", opacity: 0.2 },
          "80%": { transform: "translateY(3px)", opacity: 0.9 },
          "100%": { transform: "translateY(0px)", opacity: 1 },
        },
      },
      spacing: {
        "1-vh": "1vw",
        "2-vh": "2vh",
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
        "90-vh": "90vh",
        "1-vw": "1vw",
        "2-vw": "2vw",
        "4-vw": "4vw",
        "6-vw": "6vw",
        "8-vw": "8vw",
        "10-vw": "10vw",
        "12-vw": "12vw",
        "14-vw": "14vw",
        "18-vw": "18vw",
        "20-vw": "20vw",
      },
    },
  },
  plugins: [],
};
