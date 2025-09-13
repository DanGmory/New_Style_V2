document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#typeDocumentTable tbody");
    const modal = document.getElementById("typeDocumentModal");
    const form = document.getElementById("typeDocumentForm");
    const idInput = document.getElementById("typeDocumentId");
    const nameInput = document.getElementById("typeDocumentName");
    const API_URL = "http://localhost:3000/api_v1/typeDocument";

    // Cargar registros
    async function loadTypeDocuments() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Error al obtener los tipos de documento");
            const data = await response.json();

            tableBody.innerHTML = "";
            data.forEach(doc => {
                const row = `
                    <tr>
                        <td>${doc.Type_document_id}</td>
                        <td>${doc.Type_document_name}</td>
                        <td>
                            <button class="btn btn-info btn-sm btn-show" data-id="${doc.Type_document_id}"><i class="fas fa-eye"></i></button>
                            <button class="btn btn-warning btn-sm btn-edit" data-id="${doc.Type_document_id}"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-danger btn-sm btn-delete" data-id="${doc.Type_document_id}"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML("beforeend", row);
            });
        } catch (err) {
            console.error(err);
            alert("No se pudieron cargar los tipos de documento.");
        }
    }

    // Mostrar detalles (alerta simple)
    async function handleShow(e) {
        const id = e.target.closest("button").dataset.id;
        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error("No se encontró el tipo de documento");
            const doc = await res.json();
            alert(`ID: ${doc.Type_document_id}\nNombre: ${doc.Type_document_name}`);
        } catch (err) {
            console.error(err);
            alert("Error al mostrar tipo de documento.");
        }
    }

    // Editar
    async function handleEdit(e) {
        const id = e.target.closest("button").dataset.id;
        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error("Tipo de documento no encontrado");
            const doc = await res.json();

            document.getElementById("typeDocumentModalLabel").textContent = "Editar Tipo de Documento";
            idInput.value = doc.Type_document_id;
            nameInput.value = doc.Type_document_name;

            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        } catch (err) {
            console.error(err);
            alert("No se pudo cargar el tipo de documento.");
        }
    }

    // Eliminar
    async function handleDelete(e) {
        const id = e.target.closest("button").dataset.id;
        if (!confirm("¿Estás seguro de eliminar este tipo de documento?")) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error al eliminar");
            await loadTypeDocuments();
        } catch (err) {
            console.error(err);
            alert("No se pudo eliminar el tipo de documento.");
        }
    }

    // Guardar (Crear o Editar)
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = idInput.value;
        const name = nameInput.value.trim();

        if (!name) {
            alert("El nombre es obligatorio.");
            return;
        }

        const method = id ? "PUT" : "POST";
        const url = id ? `${API_URL}/${id}` : API_URL;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Type_document_name: name })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al guardar");
            }

            bootstrap.Modal.getInstance(modal).hide();
            form.reset();
            await loadTypeDocuments();
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }
    });

    // Abrir modal de nuevo
    document.querySelector('[data-bs-target="#typeDocumentModal"]')?.addEventListener("click", () => {
        document.getElementById("typeDocumentModalLabel").textContent = "Agregar Tipo de Documento";
        form.reset();
        idInput.value = "";
    });

    // Delegar eventos
    tableBody.addEventListener("click", (e) => {
        if (e.target.closest(".btn-show")) handleShow(e);
        else if (e.target.closest(".btn-edit")) handleEdit(e);
        else if (e.target.closest(".btn-delete")) handleDelete(e);
    });

    // Inicializar
    loadTypeDocuments();
});
