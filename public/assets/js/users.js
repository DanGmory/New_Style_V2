document.addEventListener("DOMContentLoaded", () => {
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

    // Cargar usuarios
    async function loadUsers() {
    try {
        const response = await fetch("http://localhost:3000/api_v1/users");
        if (!response.ok) throw new Error("Error al obtener usuarios");
        const users = await response.json();
        userTableBody.innerHTML = "";
        users.forEach(user => {
            const roleName = user.Role || "Sin Rol";
            const stateName = user.State || "Sin Estado";
            const row = `
                <tr>
                    <td>${user.User_id ?? 'N/A'}</td>
                    <td>${user.User_name ?? 'N/A'}</td>
                    <td>${user.User_mail ?? 'N/A'}</td>
                    <td>${roleName}</td>
                    <td>${stateName}</td>
                    <td>
                        <button class="action-btn btn-show" data-id="${user.User_id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn btn-edit" data-id="${user.User_id}" data-bs-toggle="modal" data-bs-target="#userModal"><i class="fas fa-edit"></i></button>
                        <button class="action-btn btn-delete" data-id="${user.User_id}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            userTableBody.insertAdjacentHTML("beforeend", row);
        });

        // Asignar eventos dinámicos
        document.querySelectorAll(".btn-show").forEach(btn =>
            btn.addEventListener("click", e => handleShowUser(e.currentTarget.dataset.id))
        );
        document.querySelectorAll(".btn-edit").forEach(btn =>
            btn.addEventListener("click", e => handleEditUser(e.currentTarget.dataset.id))
        );
        document.querySelectorAll(".btn-delete").forEach(btn =>
            btn.addEventListener("click", e => handleDeleteUser(e.currentTarget.dataset.id))
        );

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        alert("Error al cargar usuarios: " + error.message);
    }
}
    // Cargar roles
    async function loadRoles() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/role");
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

    // Cargar estados
    async function loadStateUsers() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/StateUser");
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

    // Guardar usuario
userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userData = {
        User_name: userNameInput.value.trim(),
        User_mail: userEmailInput.value.trim(),
        User_password: userPasswordInput.value.trim(),
        Role_fk: parseInt(roleIdInput.value),
        State_user_fk: stateUserIdInput.value ? parseInt(stateUserIdInput.value) : null
    };

    // Si Company_fk tiene valor, agregarlo
    if (companyIdInput.value) {
        userData.Company_fk = parseInt(companyIdInput.value);
    }

    console.log("Datos enviados al backend:", JSON.stringify(userData, null, 2));

    const userId = userIdInput.value;
    const method = userId ? "PUT" : "POST";
    const url = userId
        ? `http://localhost:3000/api_v1/users/${userId}`
        : "http://localhost:3000/api_v1/users";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error("Error al guardar el usuario");

        bootstrap.Modal.getInstance(userModal).hide();
        userForm.reset();
        userIdInput.value = "";
        loadUsers();

    } catch (error) {
        alert(`Error al guardar el usuario: ${error.message}`);
    }
});

    // Ver detalles
    async function handleShowUser(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api_v1/users/${userId}`);
            if (!response.ok) throw new Error("Error al obtener el usuario");
            const user = await response.json();
            alert(`Detalles:
            ID: ${user.User_id}
            Nombre: ${user.User_name}
            Email: ${user.User_mail}
            Rol: ${user.Role ?? 'N/A'}
            Estado: ${user.State ?? 'N/A'}`);
        } catch (error) {
            alert("Error al cargar usuario: " + error.message);
        }
    }

    // Cargar datos en el modal
    async function handleEditUser(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api_v1/users/${userId}`);
            if (!response.ok) throw new Error("Error al obtener el usuario");
            const user = await response.json();

            document.getElementById("userModalLabel").textContent = "Editar Usuario";
            userIdInput.value = user.User_id;
            userNameInput.value = user.User_name || "";
            userEmailInput.value = user.User_mail || "";
            userPasswordInput.value = "";
            roleIdInput.value = user.Role_fk ?? "";
            stateUserIdInput.value = user.State_user_fk ?? "";
            companyIdInput.value = user.Company_fk ?? "";

        } catch (error) {
            alert("Error al cargar usuario: " + error.message);
        }
    }

    // Eliminar usuario
    async function handleDeleteUser(userId) {
        if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
        try {
            const response = await fetch(`http://localhost:3000/api_v1/users/${userId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el usuario");
            loadUsers();
        } catch (error) {
            alert("Error al eliminar usuario: " + error.message);
        }
    }

    // Carga inicial
    loadRoles();
    loadStateUsers();
    loadUsers();
});
