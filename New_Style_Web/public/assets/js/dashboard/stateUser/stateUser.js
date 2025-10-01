document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#stateUsersTable tbody");
    const modal = document.getElementById("stateUserModal");
    const form = document.getElementById("stateUserForm");

    const idInput = document.getElementById("stateUserId");
    const nameInput = document.getElementById("stateUserName");
    const modalLabel = document.getElementById("stateUserModalLabel");

    // 🚨 Validación: si no existen los elementos, no hacer nada
    if (!tableBody || !form || !idInput || !nameInput) return;

    // ==============================
    // Cargar registros
    // ==============================
    async function loadStateUsers() {
        try {
            const response = await fetch(HOST + URL_STATE_USER);
            if (!response.ok) throw new Error("Error al obtener estados de usuario");
            const stateUsers = await response.json();

            tableBody.innerHTML = "";
            stateUsers.forEach(state => {
                const row = `
                    <tr>
                        <td>${state.State_user_id}</td>
                        <td>${state.State_user_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${state.State_user_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${state.State_user_id}"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${state.State_user_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML("beforeend", row);
            });
        } catch (error) {
            console.error("Error al cargar estados de usuario:", error);
        }
    }

    // ==============================
    // Abrir modal (nuevo registro)
    // ==============================
    document.querySelector('[data-bs-target="#stateUserModal"]')?.addEventListener("click", () => {
        if (modalLabel) modalLabel.textContent = "Agregar Nuevo Estado de Usuario";
        form.reset();
        idInput.value = "";
    });

    // ==============================
    // Guardar (crear o actualizar)
    // ==============================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const id = idInput.value;

        if (!name) {
            alert("El nombre es obligatorio.");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id ? `${HOST + URL_STATE_USER}/${id}` : HOST + URL_STATE_USER;

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ State_user_name: name }) // 👈 corregido
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || "Error al guardar estado de usuario");
            }

            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) modalInstance.hide();

            await loadStateUsers();
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
            const response = await fetch(`${HOST + URL_STATE_USER}/${id}`);
            if (!response.ok) throw new Error("Estado de usuario no encontrado");
            const data = await response.json();

            if (modalLabel) modalLabel.textContent = "Editar Estado de Usuario";
            nameInput.value = data.State_user_name;
            idInput.value = data.State_user_id;

            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        } catch (error) {
            console.error("Error al cargar estado de usuario:", error);
            alert("No se pudo cargar: " + error.message);
        }
    }

    // ==============================
    // Eliminar
    // ==============================
    async function handleDelete(id) {
        if (!confirm("¿Seguro que quieres eliminar este estado de usuario?")) return;

        try {
            const response = await fetch(`${HOST + URL_STATE_USER}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar estado de usuario");
            await loadStateUsers();
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
            const response = await fetch(`${HOST + URL_STATE_USER}/${id}`);
            if (!response.ok) throw new Error("Estado no encontrado");
            const data = await response.json();

            alert(`ID: ${data.State_user_id}\nNombre: ${data.State_user_name}`);
        } catch (error) {
            console.error("Error al mostrar estado:", error);
            alert("No se pudo mostrar: " + error.message);
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
        await loadStateUsers();
    })();
});
