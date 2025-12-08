  // Obtener elementos del DOM
    const cartButton = document.querySelector('li[data-role="cart"] a');
    const registerAlert = document.getElementById('registerAlert');
    const closeAlertButton = document.getElementById('closeAlert');

    // Mostrar el anuncio cuando se hace clic en el carrito
    cartButton.addEventListener('click', function (event) {
        event.preventDefault(); // Evitar que el enlace redirija al carrito
        registerAlert.classList.remove('hidden'); // Mostrar el anuncio
    });

    // Ocultar el anuncio cuando se hace clic en "Cerrar"
    closeAlertButton.addEventListener('click', function () {
        registerAlert.classList.add('hidden'); // Ocultar el anuncio
    });