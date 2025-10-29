document.addEventListener("DOMContentLoaded", () => {
    const companyTableBody = document.querySelector("#companiesTable tbody");
    const companyModal = document.getElementById("companyModal");
    const companyForm = document.getElementById("companyForm");
    const companyIdInput = document.getElementById("companyId");
    const companyNameInput = document.getElementById("companyName");
    const companyAddressInput = document.getElementById("companyAddress");
    const companyPhoneInput = document.getElementById("companyPhone");
    const companyEmailInput = document.getElementById("companyEmail");

    // ✅ Delegar eventos de botones (solo una vez)
    companyTableBody.addEventListener("click", async (e) => {
        const target = e.target.closest("button");
        if (!target) return;
        if (target.classList.contains("btn-show")) await handleShowCompany(target);
        if (target.classList.contains("btn-edit")) await handleEditCompany(target);
        if (target.classList.contains("btn-delete")) await handleDeleteCompany(target);
    });

    // 🔹 Cargar empresas
    async function loadCompanies() {
        try {
            const response = await fetch(HOST + URL_COMPANY);
            if (!response.ok) throw new Error("Error al obtener empresas");
            const companies = await response.json();
            companyTableBody.innerHTML = "";
            companies.forEach(c => {
                companyTableBody.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td>${c.Company_id}</td>
                        <td>${c.Company_name}</td>
                        <td>${c.Company_Address}</td>
                        <td>${c.Company_phone}</td>
                        <td>${c.Company_mail}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${c.Company_id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-edit" data-id="${c.Company_id}" data-bs-toggle="modal" data-bs-target="#companyModal">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-delete" data-id="${c.Company_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        } catch (error) {
            alert("Error al cargar empresas: " + error.message);
        }
    }

    // 🔹 Reset modal (cuando haces clic en "Agregar")
    document.querySelector('[data-bs-target="#companyModal"]').addEventListener("click", () => {
        document.getElementById("companyModalLabel").textContent = "Agregar Nueva Empresa";
        companyForm.reset();
        companyIdInput.value = "";
    });

    // 🔹 Guardar (crear o actualizar)
    companyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const companyId = companyIdInput.value;
        const method = companyId ? "PUT" : "POST";
        const url = companyId ? `${HOST + URL_COMPANY}/${companyId}` : HOST + URL_COMPANY;

        const data = {
            Company_name: companyNameInput.value.trim(),
            Company_Address: companyAddressInput.value.trim(),
            Company_phone: companyPhoneInput.value.trim(),
            Company_mail: companyEmailInput.value.trim()
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Error al guardar empresa");
            bootstrap.Modal.getInstance(companyModal).hide();
            loadCompanies();
        } catch (error) {
            alert("Error al guardar empresa: " + error.message);
        }
    });

    // 🔹 Mostrar detalles
    async function handleShowCompany(target) {
        const companyId = target.getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_COMPANY}/${companyId}`);
            if (!response.ok) throw new Error("Error al obtener la empresa");
            const c = await response.json();
            alert(`Detalles de la empresa:
ID: ${c.Company_id}
Nombre: ${c.Company_name}
Dirección: ${c.Company_Address}
Teléfono: ${c.Company_phone}
Email: ${c.Company_mail}`);
        } catch (error) {
            alert("Error al cargar la empresa: " + error.message);
        }
    }

    // 🔹 Editar
    async function handleEditCompany(target) {
        const companyId = target.getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_COMPANY}/${companyId}`);
            if (!response.ok) throw new Error("Error al obtener la empresa");
            const c = await response.json();
            document.getElementById("companyModalLabel").textContent = "Editar Empresa";
            companyIdInput.value = c.Company_id;
            companyNameInput.value = c.Company_name;
            companyAddressInput.value = c.Company_Address;
            companyPhoneInput.value = c.Company_phone;
            companyEmailInput.value = c.Company_mail;
        } catch (error) {
            alert("Error al cargar la empresa: " + error.message);
        }
    }

    // 🔹 Eliminar
    async function handleDeleteCompany(target) {
        const companyId = target.getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar esta empresa?")) return;
        try {
            const response = await fetch(`${HOST + URL_COMPANY}/${companyId}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Error al eliminar la empresa");
            alert("Empresa eliminada correctamente.");
            loadCompanies();
        } catch (error) {
            alert("Error al eliminar la empresa: " + error.message);
        }
    }

    // 🔹 Cargar al iniciar
    loadCompanies();
});
