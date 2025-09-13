document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#stateOrderTable tbody");
    const modal = document.getElementById("stateOrderModal");
    const form = document.getElementById("stateOrderForm");

    const idInput = document.getElementById("stateOrderId");
    const nameInput = document.getElementById("stateOrderName");

    const API_URL = "http://localhost:3000/api_v1/stateOrder";

    // Cargar todos los estados de orden
    async function loadStateOrders() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Error al obtener estados de orden.");
            const stateOrders = await response.json();
            tableBody.innerHTML = "";
            stateOrders.forEach(state => {
                const row = `
                    <tr>
                        <td>${state.State_order_id}</td>
                        <td>${state.State_order_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${state.State_order_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${state.State_order_id}"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${state.State_order_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML("beforeend", row);
            });
        } catch (error) {
            console.error("Error al cargar estados de orden:", error);
            alert("No se pudieron cargar los estados de orden.");
        }
    }

    // Abrir modal para nuevo registro
    document.querySelector('[data-bs-target="#stateOrderModal"]')?.addEventListener("click", () => {
        document.getElementById("stateOrderModalLabel").textContent = "Agregar Estado de Orden";
        form.reset();
        idInput.value = "";
    });

    // Guardar (crear o actualizar)
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const id = idInput.value;
        if (!name) {
            alert("El nombre del estado es obligatorio.");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id ? `${API_URL}/${id}` : API_URL;

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ State_order_name: name })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al guardar estado.");
            }

            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) modalInstance.hide();
            loadStateOrders();
        } catch (error) {
            console.error("Error al guardar estado:", error);
            alert("Error al guardar: " + error.message);
        }
    });

    // Editar
    async function handleEdit(e) {
        const button = e.target.closest("button.btn-edit");
        if (!button) return;
        const id = button.getAttribute("data-id");

        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error("Estado de orden no encontrado.");
            const data = await response.json();

            document.getElementById("stateOrderModalLabel").textContent = "Editar Estado de Orden";
            nameInput.value = data.State_order_name;
            idInput.value = data.State_order_id;

            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        } catch (error) {
            console.error("Error al cargar estado:", error);
            alert("No se pudo cargar el estado: " + error.message);
        }
    }

    // Eliminar
    async function handleDelete(e) {
        const button = e.target.closest("button.btn-delete");
        if (!button) return;

        const id = button.getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este estado de orden?")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Error al eliminar el estado.");
            loadStateOrders();
        } catch (error) {
            console.error("Error al eliminar estado:", error);
            alert("No se pudo eliminar: " + error.message);
        }
    }

    // Ver
    async function handleView(e) {
        const button = e.target.closest("button.btn-show");
        if (!button) return;

        const id = button.getAttribute("data-id");

        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error("Estado no encontrado.");
            const data = await response.json();

            alert(`ID: ${data.State_order_id}\nNombre: ${data.State_order_name}`);
        } catch (error) {
            console.error("Error al mostrar estado:", error);
            alert("No se pudo mostrar el estado: " + error.message);
        }
    }

    // Delegación de eventos en la tabla
    tableBody.addEventListener("click", async (e) => {
        const target = e.target.closest("button");
        if (!target) return;

        if (target.classList.contains("btn-edit")) {
            await handleEdit(e);
        } else if (target.classList.contains("btn-delete")) {
            await handleDelete(e);
        } else if (target.classList.contains("btn-show")) {
            await handleView(e);
        }
    });

    // Inicializar
    (async () => {
        await loadStateOrders();
    })();
});
