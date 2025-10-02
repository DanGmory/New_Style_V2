// session.js - Manejo del menú de sesión (login/register vs perfil/logout)
document.addEventListener("DOMContentLoaded", () => {
  // Parte 1: Mostrar el menú de sesión
  const menu = document.getElementById("sessionMenu");
  if (!menu) return;

  const rawToken = localStorage.getItem("authToken");
  const isLoggedIn = rawToken && rawToken.trim() !== "" && rawToken !== "undefined";

  if (isLoggedIn) {
    // Usuario logeado: mostrar PERFIL y CERRAR SESIÓN
    menu.innerHTML = `
      <li><a class="dropdown-item" href="/generalViews/profile">PERFIL</a></li>
      <hr />
      <li><a id="logoutBtn" class="dropdown-item" href="#">CERRAR SESIÓN</a></li>
    `;
  } else {
    // Usuario no logeado: mostrar LOGIN y REGISTRO
    menu.innerHTML = `
      <li><a class="dropdown-item" href="/generalViews/login">INICIAR SESIÓN</a></li>
      <hr />
      <li><a class="dropdown-item" href="/generalViews/register">REGISTRARSE</a></li>
    `;
  }

  // Parte 2: Manejar el cierre de sesión
  document.addEventListener("click", (e) => {
    const logoutLink = e.target.closest("#logoutBtn");
    if (logoutLink) {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "/generalViews/home";
    }
  });

  // Parte 3: Proteger el carrito de compras
  const carritoLinks = document.querySelectorAll('a[href*="carritoCompras"]');
  carritoLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const rawToken = localStorage.getItem("authToken");
      const isLoggedIn = rawToken && rawToken.trim() !== "" && rawToken !== "undefined";

      if (!isLoggedIn) {
        e.preventDefault();
        alert("Debes iniciar sesión para ver tu carrito de compras.");
      }
    });
  });
});