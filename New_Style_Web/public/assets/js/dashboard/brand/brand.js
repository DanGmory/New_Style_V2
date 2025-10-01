document.addEventListener("DOMContentLoaded", () => {
    const brandTableBody = document.querySelector("#brandTable tbody");
    const brandModal = document.getElementById("brandModal");
    const brandForm = document.getElementById("brandForm");
    const brandIdInput = document.getElementById("brandId");
    const brandNameInput = document.getElementById("brandName");

    // ✅ Delegar eventos de botones
    brandTableBody.addEventListener("click", async (e) => {
        const target = e.target.closest("button");
        if (!target) return;
        if (target.classList.contains("btn-show")) await handleShowBrand(target);
        if (target.classList.contains("btn-edit")) await handleEditBrand(target);
        if (target.classList.contains("btn-delete")) await handleDeleteBrand(target);
    });

    // 🔹 Cargar marcas
    async function loadBrands() {
        try {
            const response = await fetch(HOST + URL_BRAND);
            if (!response.ok) throw new Error("Error al obtener marcas");
            const brands = await response.json();
            brandTableBody.innerHTML = "";
            brands.forEach(brand => {
                brandTableBody.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td>${brand.Brand_id}</td>
                        <td>${brand.Brand_name}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${brand.Brand_id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-edit" data-id="${brand.Brand_id}" data-bs-toggle="modal" data-bs-target="#brandModal">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-delete" data-id="${brand.Brand_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        } catch (error) {
            alert("Error al cargar marcas: " + error.message);
        }
    }

    // 🔹 Reset modal (cuando haces clic en "Agregar")
    document.querySelector('[data-bs-target="#brandModal"]').addEventListener("click", () => {
        document.getElementById("brandModalLabel").textContent = "Agregar Nueva Marca";
        brandIdInput.value = "";
        brandNameInput.value = "";
    });

    // 🔹 Guardar (crear o actualizar)
    brandForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const brandId = brandIdInput.value;
        const method = brandId ? "PUT" : "POST";
        const url = brandId ? `${HOST + URL_BRAND}/${brandId}` : HOST + URL_BRAND;

        const data = {
            Brand_name: brandNameInput.value.trim()
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Error al guardar la marca");
            bootstrap.Modal.getInstance(brandModal).hide();
            loadBrands();
        } catch (error) {
            alert("Error al guardar la marca: " + error.message);
        }
    });

    // 🔹 Mostrar detalles
    async function handleShowBrand(target) {
        const brandId = target.getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_BRAND}/${brandId}`);
            if (!response.ok) throw new Error("Error al obtener la marca");
            const brand = await response.json();
            alert(`Detalles de la marca:
ID: ${brand.Brand_id}
Nombre: ${brand.Brand_name}`);
        } catch (error) {
            alert("Error al cargar la marca: " + error.message);
        }
    }

    // 🔹 Editar
    async function handleEditBrand(target) {
        const brandId = target.getAttribute("data-id");
        try {
            const response = await fetch(`${HOST + URL_BRAND}/${brandId}`);
            if (!response.ok) throw new Error("Error al obtener la marca");
            const brand = await response.json();
            document.getElementById("brandModalLabel").textContent = "Editar Marca";
            brandIdInput.value = brand.Brand_id;
            brandNameInput.value = brand.Brand_name;
        } catch (error) {
            alert("Error al cargar la marca: " + error.message);
        }
    }

    // 🔹 Eliminar
    async function handleDeleteBrand(target) {
        const brandId = target.getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar esta marca?")) return;
        try {
            const response = await fetch(`${HOST + URL_BRAND}/${brandId}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Error al eliminar la marca");
            alert("Marca eliminada correctamente.");
            loadBrands();
        } catch (error) {
            alert("Error al eliminar la marca: " + error.message);
        }
    }

    // 🔹 Cargar al iniciar
    loadBrands();
});
