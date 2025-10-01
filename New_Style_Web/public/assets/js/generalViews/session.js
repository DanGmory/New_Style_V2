document.addEventListener("DOMContentLoaded", () => {
  // Parte 1: Mostrar el menú de sesión
  const menu = document.getElementById("sessionMenu");
  if (!menu) return;

  const rawToken = localStorage.getItem("authToken");
  const isLoggedIn = rawToken && rawToken.trim() !== "" && rawToken !== "undefined";

  if (isLoggedIn) {
    menu.innerHTML = `
      <li><a class="dropdown-item" href="../../views/profile/profile.html">PERFIL</a></li>
      <hr />
      <li><a id="logoutBtn" class="dropdown-item" href="#">CERRAR SESIÓN</a></li>
    `;
  } else {
    menu.innerHTML = `
      <li><a class="dropdown-item" href="../../views/login/login.html">INICIAR SESIÓN</a></li>
      <hr />
      <li><a class="dropdown-item" href="../../views/register/register.html">REGISTRARSE</a></li>
    `;
  }

  // Parte 2: Cerrar sesión solo si se hace clic en CERRAR SESIÓN
  document.addEventListener("click", (e) => {
    const logoutLink = e.target.closest("#logoutBtn");
    if (logoutLink) {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "../../views/home/home.html";
    }
  });
  // Buscamos el enlace cuyo href contiene "carritoCompras"
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
