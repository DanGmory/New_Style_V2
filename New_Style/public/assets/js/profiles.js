document.addEventListener("DOMContentLoaded", () => {
    const profileTableBody = document.querySelector("#profileTable tbody");
    const profileModal = document.getElementById("profileModal");
    const profileForm = document.getElementById("profileForm");

    const profileIdInput = document.getElementById("profileId");
    const profileNameInput = document.getElementById("profileName");
    const profileLastnameInput = document.getElementById("profileLastname");
    const profilePhoneInput = document.getElementById("profilePhone");
    const profileNumberDocumentInput = document.getElementById("profileNumberDocument");
    const userFkInput = document.getElementById("userFk");
    const imageFkInput = document.getElementById("imageFk");
    const typeDocumentFkInput = document.getElementById("typeDocumentFk");

    const userFkGroup = document.getElementById("userFkGroup");

    const API_URL = "http://localhost:3000/api_v1/Profile";

    async function loadProfiles() {
        try {
            const response = await fetch(API_URL);
            const profiles = await response.json();
            profileTableBody.innerHTML = "";

            profiles.forEach(profile => {
                const imageTag = profile.Image_url
                    ? `<img src="${profile.Image_url}" alt="${profile.Image_name}" style="max-height:60px;">`
                    : "Sin imagen";

                const row = `
                    <tr>
                        <td>${profile.Profile_id}</td>
                        <td>${profile.Profile_name}</td>
                        <td>${profile.Profile_lastname}</td>
                        <td>${profile.User_mail}</td>
                        <td>${profile.Type_document_name}</td>
                        <td>${profile.Profile_number_document}</td>
                        <td>${profile.Profile_phone}</td>
                        <td>${imageTag}</td>
                        <td>
                            <button class="btn btn-sm btn-info btn-show" data-id="${profile.Profile_id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning btn-edit" data-id="${profile.Profile_id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-delete" data-id="${profile.Profile_id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;
                profileTableBody.insertAdjacentHTML("beforeend", row);
            });
        } catch (error) {
            console.error("Error cargando perfiles:", error);
        }
    }

    async function loadUsers() {
        try {
            const res = await fetch("http://localhost:3000/api_v1/users");
            const users = await res.json();
            userFkInput.innerHTML = '<option disabled selected>Selecciona un usuario</option>';
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user.User_id;
                option.textContent = user.User_mail;
                userFkInput.appendChild(option);
            });
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
        }
    }

    async function loadImages() {
        try {
            const res = await fetch("http://localhost:3000/api_v1/img");
            const images = await res.json();
            imageFkInput.innerHTML = '<option value="" disabled selected>Selecciona una Imagen</option>';
            images.forEach(image => {
                const option = document.createElement("option");
                option.value = image.Image_id;
                option.textContent = image.Image_name || `Imagen ${image.Image_id}`;
                imageFkInput.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar imágenes:", error);
        }
    }

    async function loadTypeDocuments() {
        try {
            const res = await fetch("http://localhost:3000/api_v1/typeDocument");
            const types = await res.json();
            typeDocumentFkInput.innerHTML = '<option disabled selected>Selecciona un tipo</option>';
            types.forEach(t => {
                const opt = document.createElement("option");
                opt.value = t.Type_document_id;
                opt.textContent = t.Type_document_name;
                typeDocumentFkInput.appendChild(opt);
            });
        } catch (err) {
            console.error("Error cargando tipos de documento:", err);
        }
    }

    document.querySelector('[data-bs-target="#profileModal"]')?.addEventListener("click", () => {
        document.getElementById("profileModalLabel").textContent = "Agregar Nuevo Perfil";
        profileForm.reset();
        profileIdInput.value = "";
        userFkGroup.style.display = "block";
    });

    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const profileId = profileIdInput.value;
        const method = profileId ? "PUT" : "POST";
        const url = profileId ? `${API_URL}/${profileId}` : API_URL;

        const data = {
            Profile_name: profileNameInput.value,
            Profile_lastname: profileLastnameInput.value,
            Profile_phone: profilePhoneInput.value,
            Profile_number_document: profileNumberDocumentInput.value,
            image_fk: imageFkInput.value,
            Type_document_fk: typeDocumentFkInput.value
        };

        if (!profileId) {
            data.User_fk = userFkInput.value;
        }

        if (Object.values(data).some(v => !v)) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Error al guardar perfil.");
            }

            bootstrap.Modal.getInstance(profileModal).hide();
            await loadProfiles();
        } catch (error) {
            console.error("Error guardando perfil:", error);
            alert("Error: " + error.message);
        }
    });

    async function handleShow(e) {
        const id = e.target.closest("button").dataset.id;
        try {
            const res = await fetch(`${API_URL}/${id}`);
            const p = await res.json();
            alert(`
ID: ${p.Profile_id}
Nombre: ${p.Profile_name}
Apellido: ${p.Profile_lastname}
Teléfono: ${p.Profile_phone}
Documento: ${p.Profile_number_document}
Correo: ${p.User_mail}
Imagen: ${p.Image_name}
Tipo de Documento: ${p.Type_document_name}
            `);
        } catch (err) {
            console.error("Error al mostrar perfil:", err);
        }
    }

    async function handleEdit(e) {
        const id = e.target.closest("button").dataset.id;
        try {
            const res = await fetch(`${API_URL}/${id}`);
            const p = await res.json();

            document.getElementById("profileModalLabel").textContent = "Editar Perfil";
            profileIdInput.value = p.Profile_id;
            profileNameInput.value = p.Profile_name;
            profileLastnameInput.value = p.Profile_lastname;
            profilePhoneInput.value = p.Profile_phone;
            profileNumberDocumentInput.value = p.Profile_number_document;
            imageFkInput.value = p.Image_fk;
            typeDocumentFkInput.value = p.Type_document_fk;

            userFkGroup.style.display = "none";

            new bootstrap.Modal(profileModal).show();
        } catch (err) {
            console.error("Error al cargar perfil:", err);
        }
    }

    async function handleDelete(e) {
        const id = e.target.closest("button").dataset.id;
        if (!confirm("¿Eliminar este perfil?")) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error al eliminar");
            await loadProfiles();
        } catch (err) {
            console.error("Error al eliminar perfil:", err);
        }
    }

    profileTableBody.addEventListener("click", (e) => {
        if (e.target.closest(".btn-edit")) handleEdit(e);
        if (e.target.closest(".btn-delete")) handleDelete(e);
        if (e.target.closest(".btn-show")) handleShow(e);
    });

    loadProfiles();
    loadUsers();
    loadImages();
    loadTypeDocuments();
});
