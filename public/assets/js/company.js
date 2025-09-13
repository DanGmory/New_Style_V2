document.addEventListener("DOMContentLoaded", () => {
    const companiesTableBody = document.querySelector("#companiesTable tbody");
    const companyModal = document.getElementById("companyModal");
    const companyForm = document.getElementById("companyForm");
    const companyNameInput = document.getElementById("companyName");
    const companyAddressInput = document.getElementById("companyAddress");
    const companyPhoneInput = document.getElementById("companyPhone");
    const companyEmailInput = document.getElementById("companyEmail");
    const companyIdInput = document.getElementById("companyId");

    async function loadCompanies() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/company");
            if (!response.ok) throw new Error("Error al obtener empresas");
            const companies = await response.json();
            companiesTableBody.innerHTML = "";
            companies.forEach(company => {
                companiesTableBody.innerHTML += `
                    <tr>
                        <td>${company.Company_id}</td>
                        <td>${company.Company_name}</td>
                        <td>${company.Company_Address}</td>
                        <td>${company.Company_phone}</td>
                        <td>${company.Company_mail}</td>
                        <td>
                            <button class="action-btn btn-show btn btn-success btn-sm" data-id="${company.Company_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit btn btn-warning btn-sm" data-id="${company.Company_id}" data-bs-toggle="modal" data-bs-target="#companyModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete btn btn-danger btn-sm" data-id="${company.Company_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });

            document.querySelectorAll(".btn-show").forEach(btn => btn.addEventListener("click", handleShowCompany));
            document.querySelectorAll(".btn-edit").forEach(btn => btn.addEventListener("click", handleEditCompany));
            document.querySelectorAll(".btn-delete").forEach(btn => btn.addEventListener("click", handleDeleteCompany));
        } catch (error) {
            alert("Error al cargar empresas: " + error.message);
        }
    }

    document.querySelector('[data-bs-target="#companyModal"]').addEventListener("click", () => {
        companyForm.reset();
        companyIdInput.value = "";
        document.getElementById("companyModalLabel").textContent = "Agregar Nueva Empresa";
    });

    companyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            Company_name: companyNameInput.value.trim(),
            Company_Address: companyAddressInput.value.trim(),
            Company_phone: companyPhoneInput.value.trim(),
            Company_mail: companyEmailInput.value.trim()
        };

        const id = companyIdInput.value;
        const method = id ? "PUT" : "POST";
        const url = id ? `http://localhost:3000/api_v1/company/${id}` : "http://localhost:3000/api_v1/company";
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Error en el guardado");
            bootstrap.Modal.getInstance(companyModal).hide();
            loadCompanies();
        } catch (error) {
            alert("Error al guardar empresa: " + error.message);
        }
    });

    async function handleShowCompany(e) {
        const id = e.target.closest("button").dataset.id;
        try {
            const response = await fetch(`http://localhost:3000/api_v1/company/${id}`);
            if (!response.ok) throw new Error("Error al obtener la empresa");
            const c = await response.json();
            alert(`Empresa:
            Nombre: ${c.Company_name}
            Dirección: ${c.Company_Address}
            Teléfono: ${c.Company_phone}
            Email: ${c.Company_mail}`);
        } catch (error) {
            alert("Error al mostrar empresa: " + error.message);
        }
    }

    async function handleEditCompany(e) {
        const id = e.target.closest("button").dataset.id;
        try {
            const response = await fetch(`http://localhost:3000/api_v1/company/${id}`);
            if (!response.ok) throw new Error("Error al obtener la empresa");
            const c = await response.json();
            companyNameInput.value = c.Company_name;
            companyAddressInput.value = c.Company_Address;
            companyPhoneInput.value = c.Company_phone;
            companyEmailInput.value = c.Company_mail;
            companyIdInput.value = c.Company_id;
            document.getElementById("companyModalLabel").textContent = "Editar Empresa";
        } catch (error) {
            alert("Error al cargar empresa: " + error.message);
        }
    }

    async function handleDeleteCompany(e) {
        const id = e.target.closest("button").dataset.id;
        if (!confirm("¿Deseas eliminar esta empresa?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/company/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar");
            loadCompanies();
        } catch (error) {
            alert("Error al eliminar empresa: " + error.message);
        }
    }

    loadCompanies();
});
