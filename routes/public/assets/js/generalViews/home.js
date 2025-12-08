document.addEventListener("DOMContentLoaded", function () {
  // Obtener el rol del usuario desde localStorage
  const userRole = getUserRole(); // Cambia esto por la lógica real para obtener el rol

  // Elementos a controlar
  const cartElement = document.querySelector('[data-role="cart"]');
  const profileDropdown = document.querySelector('[data-role="profile-dropdown"]');
  const profileOption = document.querySelector('[data-role="profile"]');
  const registerOption = document.querySelector('[data-role="register"]');
  const loginOption = document.querySelector('[data-role="login"]');
  const createAccountButton = document.querySelector('[data-role="create-account"]');

  // Ocultar todos los elementos inicialmente
  hideElement(cartElement);
  hideElement(registerOption);
  hideElement(loginOption);
  hideElement(createAccountButton);

  // Lógica según el rol
  if (userRole === "Cliente") {
      // Rol Cliente
      showElement(cartElement);
      showElement(profileDropdown);
      hideElement(registerOption); // Ocultar Registro
      hideElement(loginOption);    // Ocultar Login
      hideElement(createAccountButton);
  } else if (userRole === "Admin") {
      // Rol Admin

  } else {
      // Usuario no autenticado
      hideElement(cartElement);
      hideElement(profileDropdown);
      showElement(createAccountButton);
  }
});

// Función para obtener el rol del usuario (simulado)
function getUserRole() {
  // Esto debería ser reemplazado por la lógica real para obtener el rol del usuario
  // Por ejemplo, desde localStorage, cookies o una API
  return "Cliente"; // Cambia este valor para probar diferentes roles
}

// Funciones auxiliares para mostrar/ocultar elementos
function showElement(element) {
  if (element) element.style.display = "block";
}

function hideElement(element) {
  if (element) element.style.display = "none";
}