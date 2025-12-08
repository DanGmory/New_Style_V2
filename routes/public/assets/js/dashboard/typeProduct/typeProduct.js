// ✅ typeProduct.js
document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const typeProductTableBody = document.querySelector("#typeProductTable tbody");
    const typeProductModal = document.getElementById("typeProductModal");
    const typeProductForm = document.getElementById("typeProductForm");
    const typeIdInput = document.getElementById("typeId");
    const typeNameInput = document.getElementById("typeName");
    const typeCategoryInput = document.getElementById("typeCategory");

    // Cargar todos los tipos de producto
    async function loadTypeProducts() {
        try {
            const response = await fetch(`${HOST}${URL_TYPE_PRODUCT}`);
            if (!response.ok) throw new Error("Error al obtener tipos de producto");
            const typeProducts = await response.json();

            typeProductTableBody.innerHTML = "";
            typeProducts.forEach(type => {
                const row = `
                    <tr>
                        <td>${type.Type_product_id}</td>
                        <td>${type.Type_product_name}</td>
                        <td>${type.Type_product_category || "Sin categoría"}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${type.Type_product_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${type.Type_product_id}"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${type.Type_product_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                typeProductTableBody.insertAdjacentHTML("beforeend", row);
            });
        } catch (error) {
            console.error("Error al cargar tipos de producto:", error);
            alert("No se pudieron cargar los tipos de producto.");
        }
    }

    // Preparar modal para nuevo tipo
    document.querySelector('[data-bs-target="#typeProductModal"]')?.addEventListener("click", () => {
        document.getElementById("typeProductModalLabel").textContent = "Agregar Nuevo Tipo de Producto";
        typeProductForm.reset();
        typeIdInput.value = "";
    });

    // Guardar o actualizar tipo de producto
    typeProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const typeName = typeNameInput.value.trim();
        const typeCategory = typeCategoryInput.value.trim();
        const typeId = typeIdInput.value;

        if (!typeName || !typeCategory) {
            alert("El nombre y la categoría son obligatorios.");
            return;
        }

        const method = typeId ? "PUT" : "POST";
        const url = typeId
            ? `${HOST}${URL_TYPE_PRODUCT}/${typeId}`
            : `${HOST}${URL_TYPE_PRODUCT}`;

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Type_product_name: typeName,
                    Type_product_category: typeCategory
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al guardar el tipo de producto.");
            }

            const modalInstance = bootstrap.Modal.getInstance(typeProductModal);
            if (modalInstance) modalInstance.hide();

            loadTypeProducts();
        } catch (error) {
            console.error("Error al guardar tipo de producto:", error);
            alert("Error al guardar: " + error.message);
        }
    });

    // Mostrar tipo de producto
    async function handleShow(id) {
        try {
            const response = await fetch(`${HOST}${URL_TYPE_PRODUCT}/${id}`);
            if (!response.ok) throw new Error("Tipo de producto no encontrado");
            const type = await response.json();

            alert(`ID: ${type.Type_product_id}\nNombre: ${type.Type_product_name}\nCategoría: ${type.Type_product_category}`);
        } catch (error) {
            console.error("Error al mostrar tipo de producto:", error);
            alert("No se pudo mostrar: " + error.message);
        }
    }

    // Editar tipo de producto
    async function handleEdit(id) {
        try {
            const response = await fetch(`${HOST}${URL_TYPE_PRODUCT}/${id}`);
            if (!response.ok) throw new Error("Tipo de producto no encontrado");
            const type = await response.json();

            document.getElementById("typeProductModalLabel").textContent = "Editar Tipo de Producto";
            typeNameInput.value = type.Type_product_name || "";
            typeCategoryInput.value = type.Type_product_category || "";
            typeIdInput.value = type.Type_product_id || "";

            const modalInstance = new bootstrap.Modal(typeProductModal);
            modalInstance.show();
        } catch (error) {
            console.error("Error al cargar tipo:", error);
            alert("No se pudo cargar: " + error.message);
        }
    }

    // Eliminar tipo de producto
    async function handleDelete(id) {
        if (!confirm("¿Estás seguro de eliminar este tipo de producto?")) return;

        try {
            const response = await fetch(`${HOST}${URL_TYPE_PRODUCT}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el tipo.");

            loadTypeProducts();
        } catch (error) {
            console.error("Error al eliminar tipo:", error);
            alert("No se pudo eliminar: " + error.message);
        }
    }

    // Delegación de eventos en la tabla
    typeProductTableBody.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button) return;

        const id = button.getAttribute("data-id");

        if (button.classList.contains("btn-show")) {
            handleShow(id);
        } else if (button.classList.contains("btn-edit")) {
            handleEdit(id);
        } else if (button.classList.contains("btn-delete")) {
            handleDelete(id);
        }
    });

    // Inicializar
    loadTypeProducts();
});
