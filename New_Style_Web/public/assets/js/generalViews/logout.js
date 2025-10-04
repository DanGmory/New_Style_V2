document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
  localStorage.clear();
  // Redirigir a la nueva ruta pública
  window.location.href = "/generalViews/home";
    });
  }
});
