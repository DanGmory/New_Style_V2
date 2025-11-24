// Usa HOST y URL_USERS expuestos globalmente por system.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = {
      User_name: document.getElementById('userName').value,
      User_mail: document.getElementById('userEmail').value,
      User_password: document.getElementById('userPassword').value
    };

    try {
      const response = await fetch(HOST + URL_USERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      // 🔹 Manejo especial del 409 para mostrar mensaje limpio
      if (response.status === 409) {
        const error = await response.json();
        showMiniModal(error.error);   // <-- Sin "Error 409"
        return;
      }

      // 🔹 Cualquier otro error
      if (!response.ok) {
        showMiniModal("Ocurrió un error inesperado");
        return;
      }

      // 🔹 Si todo OK
     const result = await response.json();
      showMiniModal('✔ Registro exitoso');


    } catch (error) {
      showMiniModal("Error de conexión con el servidor");
    }

  });

  function showMiniModal(message) {
  const miniModal = document.getElementById("miniModal");
  const messageEl = document.getElementById("miniModalMessage");

  messageEl.textContent = message;
  miniModal.style.display = "block";

  // Ocultar a los 3 segundos
  setTimeout(() => {
    miniModal.style.display = "none";
  }, 3000);
}


});
