    // Verifica si el usuario está logueado
    function isLoggedIn() {
    const token = localStorage.getItem("authToken");
    return token && token.trim() !== "" && token !== "undefined";
    }

    // Muestra mensaje si no está logueado
    function mostrarModalLogin() {
    alert("Debes iniciar sesión para agregar productos.");
    }

    // Crea tarjeta de producto
    function createCard(product) {
    const card = document.createElement("div");
    card.className = "card";

    // Atributos de datos
    card.dataset.id = product.Product_id || "";
    card.dataset.nombre = product.Product_name || "Sin nombre";
    card.dataset.categoria = product.Product_category || "Sin categoría";
    card.dataset.precio = product.price || product.Product_amount || 0;

    const name = product.Product_name
        ? product.Product_name.trim().toUpperCase()
        : "SIN NOMBRE";
    const category = product.Product_category
        ? product.Product_category.trim().toUpperCase()
        : "SIN CATEGORIA";
    const type = product.Type_product_name
        ? product.Type_product_name.trim().toUpperCase()
        : "SIN TIPO";
    const amount = product.Product_amount || 0;
    const rawPrice = parseFloat(product.price || product.Product_amount || 0);
    const price = isNaN(rawPrice) ? 0 : rawPrice.toFixed(2);

    // URL por defecto
    let href = "#";
    if (category.toLowerCase() === "pantalon" && type.toLowerCase() === "lino") {
        href = "../../views/pantalones/PantalonLino.html";
    }

    const imageContent = product.Image_url
        ? `<a href="${href}">
            <img src="${product.Image_url}" class="card-img-top vertical-rectangular" alt="${name}">
        </a>`
        : `<div class="card-img-top bg-light text-muted d-flex align-items-center justify-content-center">Sin imagen</div>`;

    // Tooltip solo si no está logueado
    const tooltip = isLoggedIn()
        ? ""
        : 'title="Inicia sesión para agregar productos"';

    card.innerHTML = `
        ${imageContent}
        <div class="card-body">
        <p class="card-text fw-bold">${name}</p>
        <p class="card-text">
            <small>Cat: ${category}</small><br>
            <small>Tipo: ${type}</small><br>
            <small>Cant: ${amount}</small><br>
            <small><strong>Precio: $${price}</strong></small>
        </p>
        <button class="btn btn-outline-success btn-sm w-100 agregar-carrito" ${tooltip}>
            <i class="fas fa-cart-plus"></i> Agregar al carrito
        </button>
        </div>
    `;

    return card;
    }

    // Usa HOST y URL_PRODUCTS expuestos globalmente por system.js

// Función para cargar productos
    async function loadProductCards() {
    try {
        const response = await fetch(HOST + URL_PRODUCTS);
        if (!response.ok) throw new Error("Error al cargar productos");

        const products = await response.json();
        const container = document.getElementById("productCards");
        container.innerHTML = "";

        const productosFiltrados = products.filter((product) => {
        const category = (product.Product_category || "").trim().toLowerCase();
        const type = (product.Type_product_name || "").trim().toLowerCase();
        return category === "pantalon" && type === "lino";
        });

        if (productosFiltrados.length === 0) {
        container.innerHTML = `<p class="text-warning">No hay productos en categoría PANTALON y tipo LINO.</p>`;
        return;
        }

        productosFiltrados.forEach((product) => {
        const card = createCard(product);
        container.appendChild(card);
        });
    } catch (error) {
        console.error("Error:", error);
        document.getElementById(
        "productCards"
        ).innerHTML = `<p class="text-danger">No se pudieron cargar los productos.</p>`;
    }
    }

    // Manejador de evento "Agregar al carrito"
    document.addEventListener("click", (e) => {
    const btnAgregar = e.target.closest(".agregar-carrito");
    if (!btnAgregar) return;

    if (!isLoggedIn()) {
        e.preventDefault();
        e.stopPropagation();
        mostrarModalLogin();
        return;
    }

    const userEmail = localStorage.getItem("currentUserEmail");
    if (!userEmail) {
        alert("No se pudo identificar al usuario. Vuelve a iniciar sesión.");
        return;
    }

    const carritoKey = `carrito_${userEmail}`;
    let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

    const card = btnAgregar.closest(".card");
    const id = card.dataset.id;
    const nombre = card.dataset.nombre;
    const categoria = card.dataset.categoria;
    const imgElement = card.querySelector("img");
    const imagen = imgElement ? imgElement.src : "";
    const rawPrecio = parseFloat(card.dataset.precio || 0);

    const indexExistente = carrito.findIndex((item) => item.id === id);

    if (indexExistente >= 0) {
        carrito[indexExistente].cantidad += 1;
    } else {
        carrito.push({
        id,
        nombre,
        categoria,
        cantidad: 1,
        imagen,
        precio: rawPrecio,
        });
    }

    localStorage.setItem(carritoKey, JSON.stringify(carrito));
    alert(`✅ "${nombre}" agregado al carrito.`);
    });

    // Ejecutar carga de productos al cargar página
    window.onload = loadProductCards;
