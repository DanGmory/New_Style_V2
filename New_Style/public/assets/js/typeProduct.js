// typeProduct.js
document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const typeProductTableBody = document.querySelector("#typeProductTable tbody");
    const typeProductModal = document.getElementById("typeProductModal");
    const typeProductForm = document.getElementById("typeProductForm");
    const typeNameInput = document.getElementById("typeName");
    const typeCategoryInput = document.getElementById("typeCategory"); // Corrección: typeCategoryIdInput → typeCategoryInput
    const typeIdInput = document.getElementById("typeId");

    // Cargar todos los tipos de producto desde la API
    async function loadTypeProducts() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/typeProduct");
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
        const typeCategory = typeCategoryInput.value.trim(); // Corrección: typeCategoryIdInput → typeCategoryInput

        const typeId = typeIdInput.value;
        const method = typeId ? "PUT" : "POST";
        const url = typeId
            ? `http://localhost:3000/api_v1/typeProduct/${typeId}`
            : "http://localhost:3000/api_v1/typeProduct";

        // Validaciones
        if (!typeName || !typeCategory) {
            alert("El nombre y la categoría son obligatorios.");
            return;
        }

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

    // Editar tipo de producto
    async function handleEdit(e) {
        const button = e.target.closest("button.btn-edit");
        if (!button) return;

        const id = button.getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/typeProduct/${id}`);
            if (!response.ok) throw new Error("Tipo de producto no encontrado");
            const type = await response.json();

            document.getElementById("typeProductModalLabel").textContent = "Editar Tipo de Producto";
            typeNameInput.value = type.Type_product_name || "";
            typeCategoryInput.value = type.Type_product_category || ""; // Corrección: typeCategoryIdInput → typeCategoryInput
            typeIdInput.value = type.Type_product_id || "";

            const modalInstance = new bootstrap.Modal(typeProductModal);
            modalInstance.show();
        } catch (error) {
            console.error("Error al cargar tipo:", error);
            alert("No se pudo cargar el tipo: " + error.message);
        }
    }

    // Eliminar tipo de producto
    async function handleDelete(e) {
        const button = e.target.closest("button.btn-delete");
        if (!button) return;

        const id = button.getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este tipo de producto?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/typeProduct/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Error al eliminar el tipo.");

            loadTypeProducts();
        } catch (error) {
            console.error("Error al eliminar tipo:", error);
            alert("No se pudo eliminar: " + error.message);
        }
    }

    // Ver atributos del tipo de producto
    async function handleView(e) {
        const button = e.target.closest("button.btn-view");
        if (!button) return;

        const id = button.getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/typeProduct/${id}`);
            if (!response.ok) throw new Error("Tipo de producto no encontrado");
            const type = await response.json();

            // Muestra los atributos en un alerta (ajustable)
            alert(`ID: ${type.Type_product_id}\nNombre: ${type.Type_product_name}\nCategoría: ${type.Type_product_category}`);
        } catch (error) {
            console.error("Error al cargar atributos:", error);
            alert("No se pudieron mostrar los atributos: " + error.message);
        }
    }

    // Delegación de eventos en tabla
    typeProductTableBody.addEventListener("click", async (e) => {
        const target = e.target.closest("button");
        if (!target) return;

        if (target.classList.contains("btn-edit")) {
            await handleEdit(e);
        } else if (target.classList.contains("btn-delete")) {
            await handleDelete(e);
        } else if (target.classList.contains("btn-view")) { // Nuevo evento
            await handleView(e);
        }
    });

    // Inicialización
    (async () => {
        await loadTypeProducts();
    })();
});