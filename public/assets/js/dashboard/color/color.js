document.addEventListener("DOMContentLoaded", () => {
    const colorTableBody = document.querySelector("#colorTable tbody");
    const colorModal = document.getElementById("colorModal");
    const colorForm = document.getElementById("colorForm");
    const colorIdInput = document.getElementById("colorId");
    const colorNameInput = document.getElementById("colorName");

    // ✅ Delegar eventos de botones (solo una vez)
    colorTableBody.addEventListener("click", async (e) => {
        const target = e.target.closest("button");
        if (!target) return;
        if (target.classList.contains("btn-show")) await handleShowColor(target);
        if (target.classList.contains("btn-edit")) await handleEditColor(target);
        if (target.classList.contains("btn-delete")) await handleDeleteColor(target);
    });

    // 🔹 Cargar colores
    async function loadColors() {
        try {
            const response = await fetch(HOST + URL_COLORS);
            if (!response.ok) throw new Error("Error al obtener colores");
            const colors = await response.json();
            colorTableBody.innerHTML = "";
            colors.forEach(color => {
                colorTableBody.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td>${color.Color_id}</td>
                        <td>${color.Color_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${color.Color_id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-edit" data-id="${color.Color_id}" data-bs-toggle="modal" data-bs-target="#colorModal">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-delete" data-id="${color.Color_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        } catch (error) {
            alert("Error al cargar colores: " + error.message);
        }
    }

    // 🔹 Reset modal (cuando haces clic en "Agregar")
    document.querySelector('[data-bs-target="#colorModal"]').addEventListener("click", () => {
        document.getElementById("colorModalLabel").textContent = "Agregar Nuevo Color";
        colorIdInput.value = "";
        colorNameInput.value = "";
    });

    // 🔹 Guardar (crear o actualizar)
    colorForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const colorId = colorIdInput.value;
        const method = colorId ? "PUT" : "POST";
        const url = colorId ? `${HOST + URL_COLORS}/${colorId}` : HOST + URL_COLORS;

        const data = {
            Color_name: colorNameInput.value.trim()
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Error al guardar el color");
            bootstrap.Modal.getInstance(colorModal).hide();
            loadColors();
        } catch (error) {
            alert("Error al guardar el color: " + error.message);
        }
    });

    // 🔹 Mostrar detalles
    async function handleShowColor(target) {
        const colorId = target.getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_COLORS}/${colorId}`);
            if (!response.ok) throw new Error("Error al obtener el color");
            const color = await response.json();
            alert(`Detalles del color:
ID: ${color.Color_id}
Nombre: ${color.Color_name}`);
        } catch (error) {
            alert("Error al cargar el color: " + error.message);
        }
    }

    // 🔹 Editar
    async function handleEditColor(target) {
        const colorId = target.getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_COLORS}/${colorId}`);
            if (!response.ok) throw new Error("Error al obtener el color");
            const color = await response.json();
            document.getElementById("colorModalLabel").textContent = "Editar Color";
            colorIdInput.value = color.Color_id;
            colorNameInput.value = color.Color_name;
        } catch (error) {
            alert("Error al cargar el color: " + error.message);
        }
    }

    // 🔹 Eliminar
    async function handleDeleteColor(target) {
        const colorId = target.getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este color?")) return;
        try {
            const response = await fetch(`${HOST + URL_COLORS}/${colorId}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Error al eliminar el color");
            alert("Color eliminado correctamente.");
            loadColors();
        } catch (error) {
            alert("Error al eliminar el color: " + error.message);
        }
    }

    // 🔹 Cargar al iniciar
    loadColors();
});
