document.addEventListener("DOMContentLoaded", () => {
    const rolesTableBody = document.querySelector("#rolesTable tbody");
    const roleModal = document.getElementById("roleModal");
    const roleForm = document.getElementById("roleForm");
    const roleNameInput = document.getElementById("roleName");
    const roleIdInput = document.getElementById("roleId");

    // Cargar todos los roles
    async function loadRoles() {
        try {
            const response = await fetch(HOST + URL_ROLE);
            if (!response.ok) throw new Error("Error al obtener roles");
            const roles = await response.json();

            if (!rolesTableBody) return; // ✅ evita error si no existe la tabla
            rolesTableBody.innerHTML = "";

            roles.forEach(role => {
                const row = `
                    <tr>
                        <td>${role.Role_id}</td>
                        <td>${role.Role_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${role.Role_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${role.Role_id}" data-bs-toggle="modal" data-bs-target="#roleModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${role.Role_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                rolesTableBody.insertAdjacentHTML("beforeend", row);
            });

            // Reasignar eventos
            document.querySelectorAll(".btn-show").forEach(button => button.addEventListener("click", handleShowRole));
            document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handleEditRole));
            document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handleDeleteRole));
        } catch (error) {
            console.error("Error al cargar roles:", error);
            alert("Error al cargar roles: " + error.message);
        }
    }

    // Limpiar formulario al abrir modal
    const openModalBtn = document.querySelector('[data-bs-target="#roleModal"]');
    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            document.getElementById("roleModalLabel").textContent = "Agregar Nuevo Rol";
            if (roleNameInput) roleNameInput.value = "";
            if (roleIdInput) roleIdInput.value = "";
        });
    }

    // Guardar o actualizar rol
    if (roleForm) {
        roleForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const roleName = roleNameInput.value.trim();
            const roleId = roleIdInput.value;
            const method = roleId ? "PUT" : "POST";
            const url = roleId 
                ? `${HOST + URL_ROLE}/${roleId}` 
                : HOST + URL_ROLE;

            try {
                const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ Role_name: roleName })
                });
                if (!response.ok) throw new Error("Error al guardar el rol");

                bootstrap.Modal.getInstance(roleModal).hide();
                loadRoles();
            } catch (error) {
                console.error("Error al guardar rol:", error);
                alert("Error al guardar el rol: " + error.message);
            }
        });
    }

    // Ver rol
    async function handleShowRole(e) {
        const roleId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_ROLE}/${roleId}`);
            if (!response.ok) throw new Error("Error al obtener el rol");
            const role = await response.json();
            alert(`Detalles del rol:\nID: ${role.Role_id}\nNombre: ${role.Role_name}`);
        } catch (error) {
            console.error("Error al mostrar rol:", error);
            alert("Error al cargar el rol: " + error.message);
        }
    }

    // Editar rol
    async function handleEditRole(e) {
        const roleId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_ROLE}/${roleId}`);
            if (!response.ok) throw new Error("Error al obtener el rol");
            const role = await response.json();
            document.getElementById("roleModalLabel").textContent = "Editar Rol";
            if (roleNameInput) roleNameInput.value = role.Role_name;
            if (roleIdInput) roleIdInput.value = role.Role_id;
        } catch (error) {
            console.error("Error al editar rol:", error);
            alert("Error al cargar el rol: " + error.message);
        }
    }

    // Eliminar rol
    async function handleDeleteRole(e) {
        const roleId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este rol?")) return;

        try {
            const response = await fetch(`${HOST + URL_ROLE}/${roleId}`, { method: "DELETE" });
            if (!response.ok) {
                let msg = "Error al eliminar el rol";
                try {
                    const data = await response.json();
                    if (response.status === 409 && data?.error) {
                        msg = data.error;
                    } else if (data?.error) {
                        msg = data.error;
                    }
                } catch {}
                throw new Error(msg);
            }
            loadRoles();
        } catch (error) {
            console.error("Error al eliminar rol:", error);
            alert(error.message);
        }
    }

    // Carga inicial
    loadRoles();
});
