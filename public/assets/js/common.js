window.addEventListener("load", function (e) {
  if (!document.cookie.startsWith("viewport=") && typeof viewPort !== 0) {
    document.cookie = `viewport=${screen.width}; SameSite=Strict; path=/;`;
  }
});
