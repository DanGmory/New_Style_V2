document.addEventListener("DOMContentLoaded", () => {
  // Parte 1: Mostrar/actualizar el menú de sesión si existe
  const menu = document.getElementById("sessionMenu");
  const rawToken = localStorage.getItem("authToken");
  const isLoggedIn = rawToken && rawToken.trim() !== "" && rawToken !== "undefined";
  const roleName = String(localStorage.getItem("currentUserRole") || "").toLowerCase();
  const goDashItem = document.getElementById("navGoDashboardItem");

  if (menu) {
    if (isLoggedIn) {
      menu.innerHTML = `
        <li><a class="dropdown-item" href="/generalViews/profile">PERFIL</a></li>
        <hr />
        <li><a id="logoutBtn" class="dropdown-item" href="#">CERRAR SESIÓN</a></li>
      `;
    } else {
      menu.innerHTML = `
        <li><a class="dropdown-item" href="/generalViews/login">INICIAR SESIÓN</a></li>
        <hr />
        <li><a class="dropdown-item" href="/generalViews/register">REGISTRARSE</a></li>
      `;
    }
  }

  // Parte 2: Cerrar sesión desde cualquier vista (document-level)
  document.addEventListener("click", (e) => {
    const logoutLink = e.target.closest("#logoutBtn");
    if (logoutLink) {
      e.preventDefault();
      // Avisar al backend para limpiar la cookie httpOnly
      fetch('/api_v1/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {}).finally(() => {
        localStorage.clear();
        window.location.href = "/generalViews/home";
      });
    }
  });

  // Parte 2.1: Controlar visibilidad del botón "Ir al Dashboard"
  if (goDashItem) {
    if (isLoggedIn && (roleName === 'admin' || roleName === 'administrador' || roleName === 'empresa')) {
      goDashItem.classList.remove('d-none');
    } else {
      goDashItem.classList.add('d-none');
    }
  }

  // Parte 3: Proteger acceso al carrito cuando no hay sesión
  const carritoLinks = document.querySelectorAll('a[href*="carritoCompras"]');
  carritoLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const raw = localStorage.getItem("authToken");
      const logged = raw && raw.trim() !== "" && raw !== "undefined";
      if (!logged) {
        e.preventDefault();
        alert("Debes iniciar sesión para ver tu carrito de compras.");
      }
    });
  });
});
