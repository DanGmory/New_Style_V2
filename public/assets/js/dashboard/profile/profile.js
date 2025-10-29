document.addEventListener("DOMContentLoaded", () => {
    // Definiciones de elementos del DOM
    const profileTableBody = document.querySelector("#profileTable tbody");
    const profileModal = document.getElementById("profileModal");
    const profileForm = document.getElementById("profileForm");
    const profileIdInput = document.getElementById("profileId");

    // Inputs para los datos del perfil
    const profileNameInput = document.getElementById("profileName");
    const profileLastnameInput = document.getElementById("profileLastname");
    const profilePhoneInput = document.getElementById("profilePhone");
    const profileNumberDocumentInput = document.getElementById("profileNumberDocument");
    const userFkInput = document.getElementById("userFk"); // Select para usuarios
    const imageFkInput = document.getElementById("imageFk"); // Select para imágenes
    const typeDocumentFkInput = document.getElementById("typeDocumentFk"); // Select para tipos de documento
    const addressFkInput = document.getElementById("addressFk"); // Select para direcciones


        async function loadProfiles() {
        try {
            const response = await fetch(HOST + URL_PROFILE);
            if (!response.ok) throw new Error("Error al obtener perfiles");
            const profiles = await response.json();
            profileTableBody.innerHTML = "";
            profiles.forEach(p => {
                const imageCell = p.Image_url ? `<img src="${p.Image_url}" alt="img" style="width:40px;height:40px;object-fit:cover;border-radius:4px;"/>` : '';
                profileTableBody.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td>${p.Profile_id}</td>
                        <td>${p.Profile_name}</td>
                        <td>${p.Profile_lastname ?? ''}</td>
                        <td>${p.User_mail ?? ''}</td>
                        <td>${p.Type_document_name ?? ''}</td>
                        <td>${p.Profile_number_document ?? ''}</td>
                        <td>${p.Profile_phone ?? ''}</td>
                        <td>${imageCell}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${p.Profile_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${p.Profile_id}" data-bs-toggle="modal" data-bs-target="#profileModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${p.Profile_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `);
            });
        } catch (error) {
            alert("Error al cargar perfiles: " + error.message);
        }
    }   

    // ✅ Delegar eventos una sola vez
    profileTableBody.addEventListener("click", async (e) => {
        const target = e.target.closest("button");
        if (!target) return;
        if (target.classList.contains("btn-show")) await handleShowProfile(target);
        if (target.classList.contains("btn-edit")) await handleEditProfile(target);
        if (target.classList.contains("btn-delete")) await handleDeleteProfile(target);
    });

    // Resetear el modal para agregar un nuevo perfil
    document.querySelector('[data-bs-target="#profileModal"]').addEventListener("click", () => {
        document.getElementById("profileModalLabel").textContent = "Agregar Nuevo Perfil";
        profileIdInput.value = "";
        profileNameInput.value = "";
        profileLastnameInput.value = "";
        profilePhoneInput.value = "";
        profileNumberDocumentInput.value = "";
        userFkInput.value = "";
        imageFkInput.value = "";
    typeDocumentFkInput.value = "";
    if (addressFkInput) addressFkInput.value = "";
    });

    // Guardar (crear o actualizar) un perfil
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const profileId = profileIdInput.value;
        const method = profileId ? "PUT" : "POST";
        const url = profileId ? `${HOST + URL_PROFILE}/${profileId}` : HOST + URL_PROFILE;

        const data = {
            Profile_name: profileNameInput.value.trim(),
            Profile_lastname: profileLastnameInput.value.trim(),
            Profile_phone: profilePhoneInput.value.trim(),
            Profile_number_document: profileNumberDocumentInput.value.trim(),
            User_fk: userFkInput.value,
            image_fk: imageFkInput.value || null, // Se envía null si el campo está vacío
            Type_document_fk: typeDocumentFkInput.value,
            Address_fk: addressFkInput ? (addressFkInput.value || null) : null // Se envía null si el campo no existe o está vacío
        };
        
        // Validación básica
        if (!data.Profile_name || !data.User_fk || !data.Type_document_fk || (addressFkInput && !data.Address_fk)) {
            alert("Por favor, completa los campos obligatorios.");
            return;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Error al guardar el perfil");
            bootstrap.Modal.getInstance(profileModal).hide();
            loadProfiles();
        } catch (error) {
            alert("Error al guardar el perfil: " + error.message);
        }
    });

    async function handleShowProfile(target) {
        const profileId = target.getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_PROFILE}/${profileId}`);
            if (!response.ok) throw new Error("Error al obtener el perfil");
            const profile = await response.json();
            alert(`Detalles del Perfil:
ID: ${profile.Profile_id}
Nombre: ${profile.Profile_name} ${profile.Profile_lastname ?? ''}
Correo: ${profile.User_mail ?? ''}
Documento: ${profile.Type_document_name ?? ''} - ${profile.Profile_number_document ?? ''}
Teléfono: ${profile.Profile_phone ?? ''}`);
        } catch (error) {
            alert("Error al cargar el perfil: " + error.message);
        }
    }

    async function handleEditProfile(target) {
        const profileId = target.getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_PROFILE}/${profileId}`);
            if (!response.ok) throw new Error("Error al obtener el perfil");
            const profile = await response.json();
            document.getElementById("profileModalLabel").textContent = "Editar Perfil";
            profileIdInput.value = profile.Profile_id;
            profileNameInput.value = profile.Profile_name;
            profileLastnameInput.value = profile.Profile_lastname;
            profilePhoneInput.value = profile.Profile_phone;
            profileNumberDocumentInput.value = profile.Profile_number_document;
            userFkInput.value = profile.User_fk;
            imageFkInput.value = profile.image_fk;
            typeDocumentFkInput.value = profile.Type_document_fk;
            if (addressFkInput) addressFkInput.value = profile.Address_fk;
        } catch (error) {
            alert("Error al cargar el perfil: " + error.message);
        }
    }

    async function handleDeleteProfile(target) {
        const profileId = target.getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este perfil?")) return;
        try {
            const response = await fetch(`${HOST + URL_PROFILE}/${profileId}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Error al eliminar el perfil");
            alert("Perfil eliminado correctamente.");
            loadProfiles();
        } catch (error) {
            alert("Error al eliminar el perfil: " + error.message);
        }
    }

    async function loadUsers() {
        try {
            const response = await fetch(HOST + URL_USERS);
            if (!response.ok) throw new Error("Error al cargar usuarios");
            const users = await response.json();
            userFkInput.innerHTML = '<option value="">Selecciona un usuario</option>';
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user.User_id;
                option.textContent = user.User_name;
                userFkInput.appendChild(option);
            });
        } catch (error) {
            alert("Error al cargar usuarios: " + error.message);
        }
    }

    async function loadImages() {
        try {
            const response = await fetch(HOST + URL_IMAGE);
            if (!response.ok) throw new Error("Error al cargar imágenes");
            const images = await response.json();
            imageFkInput.innerHTML = '<option value="">Sin imagen</option>';
            images.forEach(image => {
                const option = document.createElement("option");
                option.value = image.Image_id;
                option.textContent = image.Image_name;
                imageFkInput.appendChild(option);
            });
        } catch (error) {
            alert("Error al cargar imágenes: " + error.message);
        }
    }

    async function loadTypeDocuments() {
        try {
            const response = await fetch(HOST + URL_TYPE_DOCUMENT);
            if (!response.ok) throw new Error("Error al cargar tipos de documento");
            const types = await response.json();
            typeDocumentFkInput.innerHTML = '<option value="">Selecciona un tipo de documento</option>';
            types.forEach(type => {
                const option = document.createElement("option");
                option.value = type.Type_document_id;
                option.textContent = type.Type_document_name;
                typeDocumentFkInput.appendChild(option);
            });
        } catch (error) {
            alert("Error al cargar tipos de documento: " + error.message);
        }
    }

    async function loadAddresses() {
        try {
            const response = await fetch(HOST + URL_ADDRESS);
            if (!response.ok) throw new Error("Error al cargar direcciones");
            const addresses = await response.json();
            addressFkInput.innerHTML = '<option value="">Selecciona una dirección</option>';
            addresses.forEach(address => {
                const option = document.createElement("option");
                option.value = address.Address_id;
                option.textContent = `Calle/Numero: ${address.Address_number_street} Barrio: ${address.Address_neighborhood}  Localidad: ${address.Address_locality}  Ciudad: ${address.Address_city}`;
                addressFkInput.appendChild(option);
            });
        } catch (error) {
            alert("Error al cargar direcciones: " + error.message);
        }
    }
    
    // ===================================
    //  Inicialización
    // ===================================

    // Cargar todos los datos al iniciar la página
    loadProfiles();
    loadUsers();
    loadImages();
    loadTypeDocuments();
    if (addressFkInput) loadAddresses();
});