document.addEventListener("DOMContentLoaded", () => {
    const addressTableBody = document.querySelector("#addressTable tbody");
    const addressModal = document.getElementById("addressModal");
    const addressForm = document.getElementById("addressForm");
    const addressIdInput = document.getElementById("addressId");
    const addressNumberStreetInput = document.getElementById("addressNumberStreet");
    const addressBarrioInput = document.getElementById("addressBarrio");
    const addressLocalidadInput = document.getElementById("addressLocalidad");
    const addressCiudadInput = document.getElementById("addressCiudad");

    // ✅ Delegar eventos una sola vez
    addressTableBody.addEventListener("click", async (e) => {
        const target = e.target.closest("button");
        if (!target) return;
        if (target.classList.contains("btn-show")) await handleShowAddress(target);
        if (target.classList.contains("btn-edit")) await handleEditAddress(target);
        if (target.classList.contains("btn-delete")) await handleDeleteAddress(target);
    });

    async function loadAddress() {
        try {
            const response = await fetch("http://localhost:3000/api_v1/address");
            if (!response.ok) throw new Error("Error al obtener direcciones");
            const addresses = await response.json();
            addressTableBody.innerHTML = "";
            addresses.forEach(address => {
                addressTableBody.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td>${address.Address_id}</td>
                        <td>${address.Address_number_street}</td>
                        <td>${address.Address_neighborhood}</td>
                        <td>${address.Address_locality}</td>
                        <td>${address.Address_city}</td>
                        <td>
                            <button class="action-btn btn-show" data-id="${address.Address_id}"><i class="fas fa-eye"></i></button>
                            <button class="action-btn btn-edit" data-id="${address.Address_id}" data-bs-toggle="modal" data-bs-target="#addressModal"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${address.Address_id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `);
            });
        } catch (error) {
            alert("Error al cargar direcciones: " + error.message);
        }
    }

    // Reset modal
    document.querySelector('[data-bs-target="#addressModal"]').addEventListener("click", () => {
        document.getElementById("addressModalLabel").textContent = "Agregar Nueva Dirección";
        addressIdInput.value = "";
        addressNumberStreetInput.value = "";
        addressBarrioInput.value = "";
        addressLocalidadInput.value = "";
        addressCiudadInput.value = "";
    });

    // Guardar
    addressForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const addressId = addressIdInput.value;
        const method = addressId ? "PUT" : "POST";
        const url = addressId ? `http://localhost:3000/api_v1/address/${addressId}` : "http://localhost:3000/api_v1/address";

        const data = {
            Address_number_street: addressNumberStreetInput.value.trim(),
            Address_neighborhood: addressBarrioInput.value.trim(),
            Address_locality: addressLocalidadInput.value.trim(),
            Address_city: addressCiudadInput.value.trim()
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Error al guardar la dirección");
            bootstrap.Modal.getInstance(addressModal).hide();
            loadAddress();
        } catch (error) {
            alert("Error al guardar la dirección: " + error.message);
        }
    });

    async function handleShowAddress(target) {
        const addressId = target.getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/address/${addressId}`);
            if (!response.ok) throw new Error("Error al obtener la dirección");
            const address = await response.json();
            alert(`Detalles de la dirección:
ID: ${address.Address_id}
Calle: ${address.Address_number_street}
Barrio: ${address.Address_neighborhood}
Localidad: ${address.Address_locality}
Ciudad: ${address.Address_city}`);
        } catch (error) {
            alert("Error al cargar la dirección: " + error.message);
        }
    }

    async function handleEditAddress(target) {
        const addressId = target.getAttribute("data-id");
        try {
            const response = await fetch(`http://localhost:3000/api_v1/address/${addressId}`);
            if (!response.ok) throw new Error("Error al obtener la dirección");
            const address = await response.json();
            document.getElementById("addressModalLabel").textContent = "Editar Dirección";
            addressIdInput.value = address.Address_id;
            addressNumberStreetInput.value = address.Address_number_street;
            addressBarrioInput.value = address.Address_neighborhood;
            addressLocalidadInput.value = address.Address_locality;
            addressCiudadInput.value = address.Address_city;
        } catch (error) {
            alert("Error al cargar la dirección: " + error.message);
        }
    }

    async function handleDeleteAddress(target) {
        const addressId = target.getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar esta dirección?")) return;
        try {
            const response = await fetch(`http://localhost:3000/api_v1/address/${addressId}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Error al eliminar la dirección");
            alert("Dirección eliminada correctamente."); // ✅ mensaje único
            loadAddress();
        } catch (error) {
            alert("Error al eliminar la dirección: " + error.message);
        }
    }

    // Cargar al iniciar
    loadAddress();
});
