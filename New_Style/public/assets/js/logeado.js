document.addEventListener("DOMContentLoaded", () => {
  // Limpiar tokens residuales al cargar (opcional, para pruebas)
  // localStorage.removeItem("authToken");

  const rawToken = localStorage.getItem("authToken");
  const isLoggedIn = rawToken && rawToken.trim() !== "" && rawToken !== "undefined";

  console.log("Token almacenado:", rawToken);
  console.log("Usuario autenticado:", isLoggedIn);

  // Elementos del DOM
  const registerLink = document.querySelector('[data-role="register"]');
  const loginLink = document.querySelector('[data-role="login"]');
  const profileLink = document.querySelector('[data-role="profile"]');
  const createAccountButton = document.querySelector('[data-role="create-account"]');
  const profileDropdownMenu = document.querySelector('[data-role="profile-dropdown"] ul');
  const cartLink = document.querySelector('[data-role="cart"] a');

  if (isLoggedIn) {
    // Mostrar estado de usuario logueado
    if (registerLink) registerLink.style.display = "none";
    if (loginLink) loginLink.style.display = "none";
    if (profileLink) profileLink.style.display = "block";
    if (createAccountButton) createAccountButton.style.display = "none";

    // Agregar botón de cerrar sesión si no existe
    if (!document.getElementById("logoutBtn") && profileDropdownMenu) {
      const logoutLi = document.createElement("li");
      logoutLi.innerHTML = `<a class="dropdown-item" href="#" id="logoutBtn">CERRAR SESIÓN</a>`;
      profileDropdownMenu.appendChild(logoutLi);

      document.getElementById("logoutBtn").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("authToken");
        window.location.reload();
      });
    }

  } else {
    // Mostrar estado de usuario NO logueado
    if (registerLink) registerLink.style.display = "block";
    if (loginLink) loginLink.style.display = "block";
    if (profileLink) profileLink.style.display = "none";
    if (createAccountButton) createAccountButton.style.display = "inline-block";

    // Eliminar botón de cerrar sesión si existe
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      const parentLi = logoutBtn.closest("li");
      if (parentLi) parentLi.remove();
    }
  }

  // Proteger acceso al carrito
  if (cartLink) {
    cartLink.addEventListener("click", (e) => {
      if (!isLoggedIn) {
        e.preventDefault();
        alert("Debes iniciar sesión para acceder al carrito de compras.");
      }
    });
  }
});