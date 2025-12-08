document.addEventListener("DOMContentLoaded", () => {
    const typeDocumentTableBody = document.querySelector("#typeDocumentTable tbody");
    const typeDocumentModal = document.getElementById("typeDocumentModal");
    const typeDocumentForm = document.getElementById("typeDocumentForm");
    const typeDocumentIdInput = document.getElementById("typeDocumentId");
    const typeDocumentNameInput = document.getElementById("typeDocumentName");

    // Cargar todos los tipos de documento
    async function loadTypeDocuments() {
        try {
            const response = await fetch(HOST + URL_TYPE_DOCUMENT);
            if (!response.ok) throw new Error("Error al obtener los tipos de documento");
            const typeDocuments = await response.json();
            typeDocumentTableBody.innerHTML = "";

            typeDocuments.forEach(doc => {
                const row = `
                    <tr>
                        <td>${doc.Type_document_id}</td>
                        <td>${doc.Type_document_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${doc.Type_document_id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-edit" data-id="${doc.Type_document_id}" data-bs-toggle="modal" data-bs-target="#typeDocumentModal">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-delete" data-id="${doc.Type_document_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                typeDocumentTableBody.insertAdjacentHTML("beforeend", row);
            });

            document.querySelectorAll(".btn-show").forEach(btn => btn.addEventListener("click", handleShowTypeDocument));
            document.querySelectorAll(".btn-edit").forEach(btn => btn.addEventListener("click", handleEditTypeDocument));
            document.querySelectorAll(".btn-delete").forEach(btn => btn.addEventListener("click", handleDeleteTypeDocument));
        } catch (error) {
            alert("Error al cargar tipos de documento: " + error.message);
        }
    }

    // Abrir modal en modo "nuevo"
    document.querySelector('[data-bs-target="#typeDocumentModal"]').addEventListener("click", () => {
        document.getElementById("typeDocumentModalLabel").textContent = "Agregar Tipo de Documento";
        typeDocumentForm.reset();
        typeDocumentIdInput.value = "";
    });

    // Guardar (crear o editar)
    typeDocumentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const typeDocumentId = typeDocumentIdInput.value;
        const typeDocumentName = typeDocumentNameInput.value.trim();

        if (!typeDocumentName) {
            alert("El nombre es obligatorio.");
            return;
        }

        const method = typeDocumentId ? "PUT" : "POST";
        const url = typeDocumentId
            ? `${HOST + URL_TYPE_DOCUMENT}/${typeDocumentId}`
            : HOST + URL_TYPE_DOCUMENT;

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Type_document_name: typeDocumentName })
            });

            if (!response.ok) throw new Error("Error al guardar el tipo de documento");

            bootstrap.Modal.getInstance(typeDocumentModal).hide();
            loadTypeDocuments();
        } catch (error) {
            alert("Error al guardar el tipo de documento: " + error.message);
        }
    });

    // Mostrar detalles
    async function handleShowTypeDocument(e) {
        const id = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_TYPE_DOCUMENT}/${id}`);
            if (!response.ok) throw new Error("Error al obtener el tipo de documento");
            const doc = await response.json();
            alert(`Detalles:\nID: ${doc.Type_document_id}\nNombre: ${doc.Type_document_name}`);
        } catch (error) {
            alert("Error al cargar el tipo de documento: " + error.message);
        }
    }

    // Editar
    async function handleEditTypeDocument(e) {
        const id = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_TYPE_DOCUMENT}/${id}`);
            if (!response.ok) throw new Error("Error al obtener el tipo de documento");
            const doc = await response.json();

            document.getElementById("typeDocumentModalLabel").textContent = "Editar Tipo de Documento";
            typeDocumentIdInput.value = doc.Type_document_id;
            typeDocumentNameInput.value = doc.Type_document_name;
        } catch (error) {
            alert("Error al cargar el tipo de documento: " + error.message);
        }
    }

    // Eliminar
    async function handleDeleteTypeDocument(e) {
        const id = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este tipo de documento?")) return;

        try {
            const response = await fetch(`${HOST + URL_TYPE_DOCUMENT}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el tipo de documento");
            loadTypeDocuments();
        } catch (error) {
            alert("Error al eliminar el tipo de documento: " + error.message);
        }
    }

    // Inicializar
    loadTypeDocuments();
});
