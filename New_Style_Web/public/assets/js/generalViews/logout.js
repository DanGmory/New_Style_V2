document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      // Cambia esta ruta según tu estructura
      window.location.href = "../../views/home/home.html";
    });
  }
});
