document.addEventListener("DOMContentLoaded", () => {
    const stateUsersTableBody = document.querySelector("#stateUsersTable tbody");
    const stateUserModal = document.getElementById("stateUserModal");
    const stateUserForm = document.getElementById("stateUserForm");
    const stateUserNameInput = document.getElementById("stateUserName");
    const stateUserIdInput = document.getElementById("stateUserId");

    // Cargar todos los estados de usuario
    async function loadStateUsers() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/StateUser");
            if (!response.ok) throw new Error("Error al obtener estados de usuario");
            const stateUsers = await response.json();
            stateUsersTableBody.innerHTML = "";
            stateUsers.forEach(stateUser => {
                const row = `
                    <tr>
                        <td>${stateUser.State_user_id}</td>
                        <td>${stateUser.State_user_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${stateUser.State_user_id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-edit" data-id="${stateUser.State_user_id}" data-bs-toggle="modal" data-bs-target="#stateUserModal">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-delete" data-id="${stateUser.State_user_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                stateUsersTableBody.insertAdjacentHTML("beforeend", row);
            });

            document.querySelectorAll(".btn-show").forEach(button => button.addEventListener("click", handleShowStateUser));
            document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handleEditStateUser));
            document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handleDeleteStateUser));
        } catch (error) {
            alert("Error al cargar estados de usuario: " + error.message);
        }
    }

    // Limpiar formulario al abrir el modal
    document.querySelector('[data-bs-target="#stateUserModal"]').addEventListener("click", () => {
        document.getElementById("stateUserModalLabel").textContent = "Agregar Nuevo Estado de Usuario";
        stateUserNameInput.value = "";
        stateUserIdInput.value = "";
    });

    // Guardar o actualizar estado de usuario
    stateUserForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const stateUserName = stateUserNameInput.value.trim();
        const stateUserId = stateUserIdInput.value;
        const method = stateUserId ? "PUT" : "POST";
        const url = stateUserId
            ? `http://localhost:3000/api_v1/StateUser/${stateUserId}`
            : "http://localhost:3000/api_v1/StateUser";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ State_users_name: stateUserName }) // ¡corregido!
            });
            if (!response.ok) throw new Error("Error al guardar el estado de usuario");
            bootstrap.Modal.getInstance(stateUserModal).hide();
            loadStateUsers();
        } catch (error) {
            alert("Error al guardar el estado de usuario: " + error.message);
        }
    });

    // Ver detalles del estado de usuario
    async function handleShowStateUser(e) {
        const stateUserId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/StateUser/${stateUserId}`);
            if (!response.ok) throw new Error("Error al obtener el estado de usuario");
            const stateUser = await response.json();
            alert(`Detalles:\nID: ${stateUser.State_user_id}\nNombre: ${stateUser.State_user_name}`);
        } catch (error) {
            alert("Error al cargar el estado de usuario: " + error.message);
        }
    }

    // Cargar datos para edición
    async function handleEditStateUser(e) {
        const stateUserId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/StateUser/${stateUserId}`);
            if (!response.ok) throw new Error("Error al obtener el estado de usuario");
            const stateUser = await response.json();
            document.getElementById("stateUserModalLabel").textContent = "Editar Estado de Usuario";
            stateUserNameInput.value = stateUser.State_user_name;
            stateUserIdInput.value = stateUser.State_user_id;
        } catch (error) {
            alert("Error al cargar el estado de usuario: " + error.message);
        }
    }

    // Eliminar estado de usuario
    async function handleDeleteStateUser(e) {
        const stateUserId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este estado de usuario?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/StateUser/${stateUserId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el estado de usuario");
            loadStateUsers();
        } catch (error) {
            alert("Error al eliminar el estado de usuario: " + error.message);
        }
    }

    // Carga inicial
    loadStateUsers();
});
