document.addEventListener("DOMContentLoaded", () => {
    // Inputs y elementos
    const productTableBody = document.querySelector("#productTable tbody");
    const productModal = document.getElementById("productModal");
    const productForm = document.getElementById("productForm");
    const productNameInput = document.getElementById("productName");
    const productAmountInput = document.getElementById("productAmount");
    const productCategoryInput = document.getElementById("productCategory");
    const productDescriptionInput = document.getElementById("productDescription");
    const productPriceInput = document.getElementById("productPrice"); // NUEVO
    const productImageInput = document.getElementById("productImage");
    const productBrandInput = document.getElementById("productBrand");
    const productColorInput = document.getElementById("productColor");
    const productSizeInput = document.getElementById("productSize");
    const productTypeProductInput = document.getElementById("productTypeProduct");
    const productIdInput = document.getElementById("productId");
    let brands = [];
    let colors = [];
    let sizes = [];
    let images = [];
    let typeProducts = [];

    // Cargar productos
    async function loadProducts() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/products");
            if (!response.ok) throw new Error("Error al obtener productos");
            const products = await response.json();
            productTableBody.innerHTML = "";
            products.forEach(product => {
                const imageTag = product.Image_url
                    ? `<img src="${product.Image_url}" alt="${product.Image_name}" style="max-height:60px;">`
                    : "Sin imagen";
                const row = `
                    <tr>
                        <td>${product.Product_id}</td>
                        <td>${product.Product_name}</td>
                        <td>${product.Product_amount}</td>
                        <td>${product.Product_category}</td>
                        <td>$${product.price?.toFixed(2) || "0.00"}</td>
                        <td>${product.Brand_name || "Desconocida"}</td>
                        <td>${product.Color_name || "Desconocido"}</td>
                        <td>${product.Size_name || "Sin tamaño"}</td>
                        <td>${product.Type_product_name || "Sin tipo"}</td>
                        <td>${imageTag}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${product.Product_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${product.Product_id}"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${product.Product_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                productTableBody.insertAdjacentHTML("beforeend", row);
            });
        } catch (error) {
            console.error("Error al cargar productos:", error);
            alert("Error al cargar productos: " + error.message);
        }
    }

    // Preparar modal al abrir
    document.querySelector('[data-bs-target="#productModal"]').addEventListener("click", () => {
        document.getElementById("productModalLabel").textContent = "Agregar Nuevo Producto";
        productNameInput.value = "";
        productAmountInput.value = "";
        productCategoryInput.value = "";
        productDescriptionInput.value = "";
        productPriceInput.value = "";
        productImageInput.value = "";
        productBrandInput.value = "";
        productColorInput.value = "";
        productSizeInput.value = "";
        productTypeProductInput.value = "";
        productIdInput.value = "";
    });

    // Guardar producto
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const productName = productNameInput.value.trim();
        const productAmount = parseInt(productAmountInput.value);
        const productCategory = productCategoryInput.value.trim();
        const productDescription = productDescriptionInput.value.trim();
        const productPrice = parseFloat(productPriceInput.value);
        const productImage = parseInt(productImageInput.value);
        const productBrand = parseInt(productBrandInput.value);
        const productColor = parseInt(productColorInput.value);
        const productSize = parseInt(productSizeInput.value);
        const productTypeProduct = parseInt(productTypeProductInput.value);
        const productId = productIdInput.value;

        // Validaciones
        if (!productName || !productCategory || !productDescription) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }
        if (isNaN(productAmount) || productAmount <= 0) {
            alert("La cantidad debe ser un número positivo.");
            return;
        }
        if (isNaN(productPrice) || productPrice <= 0) {
            alert("El precio debe ser un número positivo.");
            return;
        }
        if (isNaN(productImage) || productImage <= 0) {
            alert("Selecciona una imagen válida.");
            return;
        }
        if (isNaN(productBrand) || productBrand <= 0) {
            alert("Selecciona una marca válida.");
            return;
        }
        if (isNaN(productColor) || productColor <= 0) {
            alert("Selecciona un color válido.");
            return;
        }
        if (isNaN(productSize) || productSize <= 0) {
            alert("Selecciona una talla válida.");
            return;
        }
        if (isNaN(productTypeProduct) || productTypeProduct <= 0) {
            alert("Selecciona un tipo de producto válido.");
            return;
        }

        // Determinar método HTTP (POST para crear, PUT para editar)
        const method = productId ? "PUT" : "POST";
        const url = productId
            ? `http://localhost:3000/api_v1/products/${productId}`
            : "http://localhost:3000/api_v1/products";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Name: productName,
                    Amount: productAmount,
                    category: productCategory,
                    description: productDescription,
                    price: productPrice,
                    Image_fk: productImage,
                    Brand_fk: productBrand,
                    Color_fk: productColor,
                    Size_fk: productSize,
                    Type_product_fk: productTypeProduct
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || "Error al guardar el producto");
            }

            // Ocultar modal y recargar productos
            const modalInstance = bootstrap.Modal.getInstance(productModal);
            if (modalInstance) modalInstance.hide();
            loadProducts();
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert("Error al guardar el producto: " + error.message);
        }
    });

    async function handleEditProduct(e) {
        const button = e.target.closest("button.btn-edit");
        if (!button) return;
        const productId = button.getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/products/${productId}`);
            if (!response.ok) throw new Error("Error al obtener el producto");
            const product = await response.json();
            document.getElementById("productModalLabel").textContent = "Editar Producto";
            productNameInput.value = product.Product_name || "";
            productAmountInput.value = product.Product_amount || "";
            productCategoryInput.value = product.Product_category || "";
            productDescriptionInput.value = product.Product_description || "";
            productPriceInput.value = product.price || "";
            productImageInput.value = product.Image_fk || "";
            productBrandInput.value = product.Brand_fk || "";
            productColorInput.value = product.Color_fk || "";
            productSizeInput.value = product.Size_fk || "";
            productTypeProductInput.value = product.Type_product_fk || "";
            productIdInput.value = product.Product_id || "";
            const modalInstance = new bootstrap.Modal(productModal);
            modalInstance.show();
        } catch (error) {
            console.error("Error al cargar el producto:", error);
            alert("Error al cargar el producto: " + error.message);
        }
    }
    async function handleShowProduct(e) {
        const productId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/products/${productId}`);
            if (!response.ok) throw new Error("Error al obtener el producto");
            const product = await response.json();
            alert(`
                Detalles del producto:
                ID: ${product.Product_id}
                Nombre: ${product.Product_name}
                Cantidad: ${product.Product_amount}
                Categoría: ${product.Product_category}
                Descripción: ${product.Product_description}
                Precio: $${product.price || "N/A"}
                Imagen: ${product.Image_name || "N/A"}
                Marca: ${product.Brand_name || "Desconocida"}
                Color: ${product.Color_name || "Desconocido"}
                Tamaño: ${product.Size_name || "Sin tamaño"}
                Tipo de Producto: ${product.Type_product_name || "Sin tipo"}
            `);
        } catch (error) {
            console.error("Error al cargar el producto:", error);
            alert("Error al cargar el producto: " + error.message);
        }
    }

    async function handleDeleteProduct(e) {
        const productId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
            const response = await fetch(`http://localhost:3000/api_v1/products/${productId}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Error al eliminar el producto");
            loadProducts();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert("Error al eliminar el producto: " + error.message);
        }
    }

    // Delegación de eventos de tabla
    productTableBody.addEventListener("click", async (e) => {
        const target = e.target.closest("button");
        if (!target) return;
        if (target.classList.contains("btn-show")) {
            await handleShowProduct(e);
        } else if (target.classList.contains("btn-edit")) {
            await handleEditProduct(e);
        } else if (target.classList.contains("btn-delete")) {
            await handleDeleteProduct(e);
        }
    });

    // Cargar opciones de selects
    async function loadOptions(apiUrl, selectId, idField, nameField, array) {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const select = document.getElementById(selectId);
        array.length = 0;
        select.innerHTML = '<option value="">Seleccionar...</option>';
        data.forEach(item => {
            array.push(item);
            const option = document.createElement("option");
            option.value = item[idField];
            option.textContent = item[nameField];
            select.appendChild(option);
        });
    }

    (async () => {
        await loadOptions("http://localhost:3000/api_v1/brand", "productBrand", "Brand_id", "Brand_name", brands);
        await loadOptions("http://localhost:3000/api_v1/colors", "productColor", "Color_id", "Color_name", colors);
        await loadOptions("http://localhost:3000/api_v1/size", "productSize", "Size_id", "Size_name", sizes);
        await loadOptions("http://localhost:3000/api_v1/typeProduct", "productTypeProduct", "Type_product_id", "Type_product_name", typeProducts);
        await loadOptions("http://localhost:3000/api_v1/Img", "productImage", "Image_id", "Image_name", images);
        loadProducts();
    })();
});
document.getElementById('productForm').addEventListener('submit', function (e) {
e.preventDefault();

const data = {
    Name: document.getElementById('productName').value,
    Amount: document.getElementById('productAmount').value,
    category: document.getElementById('productCategory').value,
    description: document.getElementById('productDescription').value,
    price: document.getElementById('productPrice').value,
    image: document.getElementById('productImage').value,
    Brand: document.getElementById('productBrand').value,
    ColorId: document.getElementById('productColor').value,
    sizeId: document.getElementById('productSize').value
};

fetch('http://localhost:3000/public/views/dashboard/product/product.html#', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
.then(res => res.json())
.then(response => {
    alert("Producto creado correctamente");
    document.getElementById('productForm').reset();
    // Puedes cerrar el modal aquí si quieres
})
.catch(error => console.error('Error:', error));
});

