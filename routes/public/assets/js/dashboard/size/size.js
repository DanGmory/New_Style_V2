document.addEventListener("DOMContentLoaded", () => {
    const sizesTableBody = document.querySelector("#sizesTable tbody");
    const sizeModal = document.getElementById("sizeModal");
    const sizeForm = document.getElementById("sizeForm");
    const sizeNameInput = document.getElementById("sizeName");
    const sizeIdInput = document.getElementById("sizeId");
    const sizeModalLabel = document.getElementById("sizeModalLabel");

    // 🔹 Cargar lista de tamaños
    async function loadSizes() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/size");
            if (!response.ok) throw new Error("Error al obtener tamaños");
            const sizes = await response.json();

            sizesTableBody.innerHTML = "";
            sizes.forEach(size => {
                const row = `
                    <tr>
                        <td>${size.Size_id}</td>
                        <td>${size.Size_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${size.Size_id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-edit" data-id="${size.Size_id}" data-bs-toggle="modal" data-bs-target="#sizeModal">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-delete" data-id="${size.Size_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                sizesTableBody.insertAdjacentHTML("beforeend", row);
            });

            // Reasignar eventos
            document.querySelectorAll(".btn-show").forEach(btn => btn.addEventListener("click", handleShowSize));
            document.querySelectorAll(".btn-edit").forEach(btn => btn.addEventListener("click", handleEditSize));
            document.querySelectorAll(".btn-delete").forEach(btn => btn.addEventListener("click", handleDeleteSize));
        } catch (error) {
            alert("Error al cargar tamaños: " + error.message);
        }
    }

    // 🔹 Abrir modal en modo "Agregar"
    const addBtn = document.querySelector('[data-bs-target="#sizeModal"]');
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            if (sizeModalLabel) sizeModalLabel.textContent = "Agregar Nuevo Tamaño";
            sizeForm.reset();
            sizeIdInput.value = "";
        });
    }

    // 🔹 Guardar (crear/editar)
    sizeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const sizeName = sizeNameInput.value.trim();
        const sizeId = sizeIdInput.value;
        const method = sizeId ? "PUT" : "POST";
        const url = sizeId
            ? `http://localhost:3000/api_v1/size/${sizeId}`
            : "http://localhost:3000/api_v1/size";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Size_name: sizeName })
            });

            if (!response.ok) throw new Error("Error al guardar el tamaño");

            bootstrap.Modal.getOrCreateInstance(sizeModal).hide();
            loadSizes();
        } catch (error) {
            alert("Error al guardar el tamaño: " + error.message);
        }
    });

    // 🔹 Mostrar tamaño
    async function handleShowSize(e) {
        const sizeId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/size/${sizeId}`);
            if (!response.ok) throw new Error("Error al obtener el tamaño");
            const size = await response.json();
            alert(`Detalles del tamaño:\nID: ${size.Size_id}\nNombre: ${size.Size_name}`);
        } catch (error) {
            alert("Error al cargar el tamaño: " + error.message);
        }
    }

    // 🔹 Editar tamaño
    async function handleEditSize(e) {
        const sizeId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/size/${sizeId}`);
            if (!response.ok) throw new Error("Error al obtener el tamaño");
            const size = await response.json();

            if (sizeModalLabel) sizeModalLabel.textContent = "Editar Tamaño";
            sizeNameInput.value = size.Size_name;
            sizeIdInput.value = size.Size_id;
        } catch (error) {
            alert("Error al cargar el tamaño: " + error.message);
        }
    }

    // 🔹 Eliminar tamaño
    async function handleDeleteSize(e) {
        const sizeId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este tamaño?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/size/${sizeId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el tamaño");
            loadSizes();
        } catch (error) {
            alert("Error al eliminar el tamaño: " + error.message);
        }
    }

    // 🔹 Inicializar
    loadSizes();
});
