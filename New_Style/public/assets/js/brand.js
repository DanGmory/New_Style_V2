document.addEventListener("DOMContentLoaded", () => {
    const brandTableBody = document.querySelector("#brandTable tbody");
    const brandModal = document.getElementById("brandModal");
    const brandForm = document.getElementById("brandForm");
    const brandNameInput = document.getElementById("brandName");
    const brandIdInput = document.getElementById("brandId");

    async function loadBrand() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/brand");
            if (!response.ok) throw new Error("Error al obtener marcas");
            const brands = await response.json();
            brandTableBody.innerHTML = "";
            brands.forEach(brand => {
                const row = `
                    <tr>
                        <td>${brand.Brand_id}</td>
                        <td>${brand.Brand_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${brand.Brand_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${brand.Brand_id}" data-bs-toggle="modal" data-bs-target="#brandModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${brand.Brand_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                brandTableBody.insertAdjacentHTML("beforeend", row);
            });

            // Delegación de eventos
            brandTableBody.addEventListener("click", async (e) => {
                const target = e.target.closest("button");
                if (!target) return;

                const brandId = target.getAttribute("data-id");

                if (target.classList.contains("btn-show")) {
                    await handleShowBrand({ target });
                } else if (target.classList.contains("btn-edit")) {
                    await handleEditBrand({ target });
                } else if (target.classList.contains("btn-delete")) {
                    await handleDeleteBrand({ target });
                }
            });
        } catch (error) {
            alert("Error al cargar marcas: " + error.message);
        }
    }

    document.querySelector('[data-bs-target="#brandModal"]').addEventListener("click", () => {
        document.getElementById("brandModalLabel").textContent = "Agregar Nueva Marca";
        brandNameInput.value = "";
        brandIdInput.value = "";
    });

    brandForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const brandName = brandNameInput.value.trim();
        const brandId = brandIdInput.value;
        const method = brandId ? "PUT" : "POST";
        const url = brandId ? `http://localhost:3000/api_v1/brand/${brandId}` : "http://localhost:3000/api_v1/brand";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Brand_name: brandName })

            });
            if (!response.ok) throw new Error("Error al guardar la marca");
            bootstrap.Modal.getInstance(brandModal).hide();
            loadBrand(); // Recargar la tabla después de guardar
        } catch (error) {
            alert("Error al guardar la marca: " + error.message);
        }
    });

    async function handleShowBrand(e) {
        const brandId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/brand/${brandId}`);
            if (!response.ok) throw new Error("Error al obtener la marca");
            const brand = await response.json();
            alert(`Detalles de la marca:\nID: ${brand.Brand_id}\nNombre: ${brand.Brand_name}`);
        } catch (error) {
            alert("Error al cargar la marca: " + error.message);
        }
    }

    async function handleEditBrand(e) {
        const brandId = e.target.closest("button").getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/brand/${brandId}`);
            if (!response.ok) throw new Error("Error al obtener la marca");
            const brand = await response.json();
            document.getElementById("brandModalLabel").textContent = "Editar Marca";
            brandNameInput.value = brand.Brand_name;
            brandIdInput.value = brand.Brand_id;
        } catch (error) {
            alert("Error al cargar la marca: " + error.message);
        }
    }

    async function handleDeleteBrand(e) {
        const brandId = e.target.closest("button").getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar esta marca?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api_v1/brand/${brandId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar la marca");
            loadBrand(); // Recargar la tabla después de eliminar
        } catch (error) {
            alert("Error al eliminar la marca: " + error.message);
        }
    }

    loadBrand(); // Cargar marcas al cargar la página
});