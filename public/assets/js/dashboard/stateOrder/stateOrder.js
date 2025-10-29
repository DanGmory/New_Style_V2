document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#stateOrderTable tbody");
    const modal = document.getElementById("stateOrderModal");
    const form = document.getElementById("stateOrderForm");

    const idInput = document.getElementById("stateOrderId");
    const nameInput = document.getElementById("stateOrderName");
    const modalLabel = document.getElementById("stateOrderModalLabel");


    // 🚨 Validación: si no existen los elementos, no ejecutar nada
    if (!tableBody || !form || !idInput || !nameInput) return;

    // ==============================
    // Cargar registros
    // ==============================
    async function loadStateOrders() {
        try {
            const response = await fetch(HOST + URL_STATE_ORDER);
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
        }
    }

    // ==============================
    // Abrir modal nuevo
    // ==============================
    document.querySelector('[data-bs-target="#stateOrderModal"]')?.addEventListener("click", () => {
        if (modalLabel) modalLabel.textContent = "Agregar Estado de Orden";
        form.reset();
        idInput.value = "";
    });

    // ==============================
    // Guardar registro
    // ==============================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const id = idInput.value;

        if (!name) {
            alert("El nombre del estado es obligatorio.");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id ? `${HOST + URL_STATE_ORDER}/${id}` : HOST + URL_STATE_ORDER;

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ State_order_name: name })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || "Error al guardar estado.");
            }

            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) modalInstance.hide();

            await loadStateOrders();
        } catch (error) {
            console.error("Error al guardar estado:", error);
            alert("Error al guardar: " + error.message);
        }
    });

    // ==============================
    // Editar
    // ==============================
    async function handleEdit(id) {
        try {
            const response = await fetch(`${HOST + URL_STATE_ORDER}/${id}`);
            if (!response.ok) throw new Error("Estado de orden no encontrado.");
            const data = await response.json();

            if (modalLabel) modalLabel.textContent = "Editar Estado de Orden";
            nameInput.value = data.State_order_name;
            idInput.value = data.State_order_id;

            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        } catch (error) {
            console.error("Error al cargar estado:", error);
            alert("No se pudo cargar el estado: " + error.message);
        }
    }

    // ==============================
    // Eliminar
    // ==============================
    async function handleDelete(id) {
        if (!confirm("¿Estás seguro de eliminar este estado de orden?")) return;

        try {
            const response = await fetch(`${HOST + URL_STATE_ORDER}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el estado.");
            await loadStateOrders();
        } catch (error) {
            console.error("Error al eliminar estado:", error);
            alert("No se pudo eliminar: " + error.message);
        }
    }

    // ==============================
    // Ver
    // ==============================
    async function handleView(id) {
        try {
            const response = await fetch(`${HOST + URL_STATE_ORDER}/${id}`);
            if (!response.ok) throw new Error("Estado no encontrado.");
            const data = await response.json();

            alert(`ID: ${data.State_order_id}\nNombre: ${data.State_order_name}`);
        } catch (error) {
            console.error("Error al mostrar estado:", error);
            alert("No se pudo mostrar el estado: " + error.message);
        }
    }

    // ==============================
    // Delegación de eventos
    // ==============================
    tableBody.addEventListener("click", async (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const id = btn.getAttribute("data-id");

        if (btn.classList.contains("btn-edit")) {
            await handleEdit(id);
        } else if (btn.classList.contains("btn-delete")) {
            await handleDelete(id);
        } else if (btn.classList.contains("btn-show")) {
            await handleView(id);
        }
    });

    // ==============================
    // Inicializar
    // ==============================
    (async () => {
        await loadStateOrders();
    })();
});
