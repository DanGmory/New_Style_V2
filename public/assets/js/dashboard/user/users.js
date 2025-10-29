// ✅ user.js
document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const userTableBody = document.querySelector("#userTable tbody");
    const userModal = document.getElementById("userModal");
    const userForm = document.getElementById("userForm");
    const userIdInput = document.getElementById("userId");
    const userNameInput = document.getElementById("userName");
    const userEmailInput = document.getElementById("userEmail");
    const userPasswordInput = document.getElementById("userPassword");
    const roleIdInput = document.getElementById("roleId");
    const stateUserIdInput = document.getElementById("stateUserId");
    const companyIdInput = document.getElementById("companyId");

    // ✅ Cargar usuarios
    async function loadUsers() {
        try {
            const response = await fetch(`${HOST}${URL_USERS}`);
            if (!response.ok) throw new Error("Error al obtener usuarios");
            const users = await response.json();

            userTableBody.innerHTML = "";
            users.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.User_id ?? "N/A"}</td>
                        <td>${user.User_name ?? "N/A"}</td>
                        <td>${user.User_mail ?? "N/A"}</td>
                        <td>${user.Role || "Sin Rol"}</td>
                        <td>${user.State || "Sin Estado"}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${user.User_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${user.User_id}"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${user.User_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                userTableBody.insertAdjacentHTML("beforeend", row);
            });
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            alert("Error al cargar usuarios: " + error.message);
        }
    }


    // ✅ Guardar usuario
    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userData = {
            User_name: userNameInput.value.trim(),
            User_mail: userEmailInput.value.trim(),
            User_password: userPasswordInput.value.trim(),
            Role_fk: parseInt(roleIdInput.value),
            State_user_fk: stateUserIdInput.value ? parseInt(stateUserIdInput.value) : null
        };

        if (companyIdInput.value) {
            userData.Company_fk = parseInt(companyIdInput.value);
        }

        const userId = userIdInput.value;
        const method = userId ? "PUT" : "POST";
        const url = userId
            ? `${HOST}${URL_USERS}/${userId}`
            : `${HOST}${URL_USERS}`;

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al guardar usuario");
            }

            bootstrap.Modal.getInstance(userModal).hide();
            userForm.reset();
            userIdInput.value = "";
            loadUsers();
        } catch (error) {
            alert(`Error al guardar usuario: ${error.message}`);
        }
    });

    // ✅ Mostrar usuario
    async function handleShow(id) {
        try {
            const response = await fetch(`${HOST}${URL_USERS}/${id}`);
            if (!response.ok) throw new Error("Error al obtener usuario");
            const user = await response.json();

            alert(`Detalles:
                ID: ${user.User_id}
                Nombre: ${user.User_name}
                Email: ${user.User_mail}
                Rol: ${user.Role ?? "N/A"}
                Estado: ${user.State ?? "N/A"}`);
        } catch (error) {
            alert("Error al cargar usuario: " + error.message);
        }
    }

    // ✅ Editar usuario
    async function handleEdit(id) {
        try {
            const response = await fetch(`${HOST}${URL_USERS}/${id}`);
            if (!response.ok) throw new Error("Usuario no encontrado");
            const user = await response.json();

            document.getElementById("userModalLabel").textContent = "Editar Usuario";
            userIdInput.value = user.User_id;
            userNameInput.value = user.User_name || "";
            userEmailInput.value = user.User_mail || "";
            userPasswordInput.value = "";
            roleIdInput.value = user.Role_fk ?? "";
            stateUserIdInput.value = user.State_user_fk ?? "";
            companyIdInput.value = user.Company_fk ?? "";

            const modalInstance = new bootstrap.Modal(userModal);
            modalInstance.show();
        } catch (error) {
            alert("Error al cargar usuario: " + error.message);
        }
    }

    // ✅ Eliminar usuario
    async function handleDelete(id) {
        if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

        try {
            const response = await fetch(`${HOST}${URL_USERS}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar usuario");

            loadUsers();
        } catch (error) {
            alert("Error al eliminar usuario: " + error.message);
        }
    }

    // ✅ Delegación de eventos
    userTableBody.addEventListener("click", (e) => {
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

     // ✅ Cargar roles
    async function loadRoles() {
        try {
            const response = await fetch(`${HOST}${URL_ROLE}`);
            if (!response.ok) throw new Error("Error al cargar roles");
            const roles = await response.json();

            roleIdInput.innerHTML = '<option value="">Selecciona un rol</option>';
            roles.forEach(role => {
                const option = document.createElement("option");
                option.value = role.Role_id;
                option.textContent = role.Role_name;
                roleIdInput.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar roles:", error);
        }
    }

    // ✅ Cargar estados
    async function loadStateUsers() {
        try {
            const response = await fetch(`${HOST}${URL_STATE_USER}`);
            if (!response.ok) throw new Error("Error al cargar estados");
            const states = await response.json();

            stateUserIdInput.innerHTML = '<option value="">Selecciona un estado</option>';
            states.forEach(state => {
                const option = document.createElement("option");
                option.value = state.State_user_id;
                option.textContent = state.State_user_name;
                stateUserIdInput.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar estados:", error);
        }
    }

    // ✅ Inicialización
    loadRoles();
    loadStateUsers();
    loadUsers();
});
