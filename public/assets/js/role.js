document.addEventListener("DOMContentLoaded", () => {
    const rolesTableBody = document.querySelector("#rolesTable tbody");
    const roleModal = document.getElementById("roleModal");
    const roleForm = document.getElementById("roleForm");
    const roleNameInput = document.getElementById("roleName");
    const roleIdInput = document.getElementById("roleId");

    // Cargar todos los roles
    async function loadRoles() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/role");
            if (!response.ok) throw new Error("Error al obtener roles");
            const roles = await response.json();
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

            document.querySelectorAll(".btn-show").forEach(button => button.addEventListener("click", handleShowRole));
            document.querySelectorAll(".btn-edit").forEach(button => button.addEventListener("click", handleEditRole));
            document.querySelectorAll(".btn-delete").forEach(button => button.addEventListener("click", handleDeleteRole));
        } catch (error) {
            alert("Error al cargar roles: " + error.message);
        }
    }

    // Limpiar formulario al abrir modal
    document.querySelector('[data-bs-target="#roleModal"]').addEventListener("click", () => {
        document.getElementById("roleModalLabel").textContent = "Agregar Nuevo Rol";
        roleNameInput.value = "";
        roleIdInput.value = "";
    });

    // Guardar o actualizar rol
    roleForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const roleName = roleNameInput.value.trim();
        const roleId = roleIdInput.value;
        const method = roleId ? "PUT" : "POST";
        const url = roleId 
            ? `http://localhost:3000/api_v1/role/${roleId}` 
            : "http://localhost:3000/api_v1/role";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Role_name: roleName }) // ✅ corregido
            });
            if (!response.ok) throw new Error("Error al guardar el rol");
            bootstrap.Modal.getInstance(roleModal).hide();
            loadRoles();
        } catch (error) {
            alert("Error al guardar el rol: " + error.message);
        }
    });

    // Ver rol
    async function handleShowRole(e) {
        const roleId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/role/${roleId}`);
            if (!response.ok) throw new Error("Error al obtener el rol");
            const role = await response.json();
            alert(`Detalles del rol:\nID: ${role.Role_id}\nNombre: ${role.Role_name}`);
        } catch (error) {
            alert("Error al cargar el rol: " + error.message);
        }
    }

    // Editar rol
    async function handleEditRole(e) {
        const roleId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/role/${roleId}`);
            if (!response.ok) throw new Error("Error al obtener el rol");
            const role = await response.json();
            document.getElementById("roleModalLabel").textContent = "Editar Rol";
            roleNameInput.value = role.Role_name;
            roleIdInput.value = role.Role_id;
        } catch (error) {
            alert("Error al cargar el rol: " + error.message);
        }
    }

    // Eliminar rol
    async function handleDeleteRole(e) {
        const roleId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este rol?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/role/${roleId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el rol");
            loadRoles();
        } catch (error) {
            alert("Error al eliminar el rol: " + error.message);
        }
    }

    // Carga inicial
    loadRoles();
});
