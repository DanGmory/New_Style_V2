document.addEventListener("DOMContentLoaded", () => {
    const colorTableBody = document.querySelector("#colorTable tbody");
    const colorModal = document.getElementById("colorModal");
    const colorForm = document.getElementById("colorForm");
    const colorNameInput = document.getElementById("colorName");
    const colorIdInput = document.getElementById("colorId");

    // Cargar colores
    async function loadColors() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/colors");
            if (!response.ok) throw new Error("Error al obtener colores");
            const colors = await response.json();
            colorTableBody.innerHTML = "";
            colors.forEach(color => {
                const row = `
                    <tr >
                        <td>${color.Color_id}</td>
                        <td>${color.Color_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${color.Color_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${color.Color_id}" data-bs-toggle="modal" data-bs-target="#colorModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${color.Color_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                colorTableBody.insertAdjacentHTML("beforeend", row);
            });

            // Delegación de eventos
            colorTableBody.addEventListener("click", async (e) => {
                const target = e.target.closest("button");
                if (!target) return;

                const colorId = target.getAttribute("data-id");

                if (target.classList.contains("btn-show")) {
                    await handleShowColor({ target });
                } else if (target.classList.contains("btn-edit")) {
                    await handleEditColor({ target });
                } else if (target.classList.contains("btn-delete")) {
                    await handleDeleteColor({ target });
                }
            });
        } catch (error) {
            alert("Error al cargar colores: " + error.message);
        }
    }

    // Abrir modal para agregar un nuevo color
    document.querySelector('[data-bs-target="#colorModal"]').addEventListener("click", () => {
        document.getElementById("colorModalLabel").textContent = "Agregar Nuevo Color";
        colorNameInput.value = "";
        colorIdInput.value = "";
    });

    // Guardar color (agregar o editar)
    colorForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const colorName = colorNameInput.value.trim();
        const colorId = colorIdInput.value;
        const method = colorId ? "PUT" : "POST";
        const url = colorId ? `http://localhost:3000/api_v1/colors/${colorId}` : "http://localhost:3000/api_v1/colors";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Color_name: colorName })

            });
            if (!response.ok) throw new Error("Error al guardar el color");
            bootstrap.Modal.getInstance(colorModal).hide();
            loadColors(); // Recargar la tabla después de guardar
        } catch (error) {
            alert("Error al guardar el color: " + error.message);
        }
    });

    // Ver detalles de un color
    async function handleShowColor(e) {
        const colorId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/colors/${colorId}`);
            if (!response.ok) throw new Error("Error al obtener el color");
            const color = await response.json();
            alert(`Detalles del color:\nID: ${color.Color_id}\nNombre: ${color.Color_name}`);
        } catch (error) {
            alert("Error al cargar el color: " + error.message);
        }
    }

    // Editar un color
    async function handleEditColor(e) {
        const colorId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/colors/${colorId}`);
            if (!response.ok) throw new Error("Error al obtener el color");
            const color = await response.json();
            document.getElementById("colorModalLabel").textContent = "Editar Color";
            colorNameInput.value = color.Color_name;
            colorIdInput.value = color.Color_id; // Asignar el ID al campo oculto
        } catch (error) {
            alert("Error al cargar el color: " + error.message);
        }
    }

    // Eliminar un color
    async function handleDeleteColor(e) {
        const colorId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este color?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/colors/${colorId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el color");
            loadColors(); // Recargar la tabla después de eliminar
        } catch (error) {
            alert("Error al eliminar el color: " + error.message);
        }
    }

    loadColors(); // Cargar colores al cargar la página
});