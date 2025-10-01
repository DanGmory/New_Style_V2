document.addEventListener("DOMContentLoaded", () => {
    const codigeTableBody = document.querySelector("#codigeTable tbody");
    const codigeModal = document.getElementById("codigeModal");
    const codigeForm = document.getElementById("codigeForm");

    const codigeIdInput = document.getElementById("codigeId");
    const codigeNumberInput = document.getElementById("codigeNumber");
    const ordersFkInput = document.getElementById("ordersFk");

    // === URLs base ===
    const URL_CODIGE = "http://localhost:3000/api_v1/codige";
    const URL_ORDERS = "http://localhost:3000/api_v1/orders";

    // Delegación de eventos para botones
    codigeTableBody.addEventListener("click", async (e) => {
        const target = e.target.closest("button");
        if (!target) return;
        if (target.classList.contains("btn-show")) await handleShowCodige(target);
        if (target.classList.contains("btn-edit")) await handleEditCodige(target);
        if (target.classList.contains("btn-delete")) await handleDeleteCodige(target);
    });

    // Cargar tabla de codiges
    async function loadCodiges() {
        try {
            const response = await fetch(URL_CODIGE);
            if (!response.ok) throw new Error("Error al obtener codiges");
            const codiges = await response.json();

            codigeTableBody.innerHTML = "";
            codiges.forEach(codige => {
                codigeTableBody.insertAdjacentHTML("beforeend", `
          <tr>
            <td>${codige.Codige_id}</td>
            <td>${codige.codige_number}</td>
            <td>${codige.product_name}</td>
            <td>${codige.product_amount}</td>
            <td>$${codige.price}</td>
            <td>${codige.user_name}</td>
            <td>${codige.company_name}</td>
            <td>
              <button class="action-btn btn-show" data-id="${codige.Codige_id}"><i class="fas fa-eye"></i></button>
              <button class="action-btn btn-edit" data-id="${codige.Codige_id}" data-bs-toggle="modal" data-bs-target="#codigeModal"><i class="fas fa-edit"></i></button>
              <button class="action-btn btn-delete" data-id="${codige.Codige_id}"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        `);
            });
        } catch (error) {
            alert("Error al cargar codiges: " + error.message);
        }
    }

    // Reset modal
    document.querySelector('[data-bs-target="#codigeModal"]').addEventListener("click", () => {
        document.getElementById("codigeModalLabel").textContent = "Agregar Nuevo Codige";
        codigeForm.reset();
        codigeIdInput.value = "";
    });

    // Guardar codige
    codigeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const codigeId = codigeIdInput.value;
        const method = codigeId ? "PUT" : "POST";
        const url = codigeId ? `${URL_CODIGE}/${codigeId}` : URL_CODIGE;

        const data = {
            Codige_number: codigeNumberInput.value,
            Orders_fk: ordersFkInput.value
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Error al guardar el codige");
            bootstrap.Modal.getInstance(codigeModal).hide();
            loadCodiges();
        } catch (error) {
            alert("Error al guardar el codige: " + error.message);
        }
    });

    // Mostrar codige
    async function handleShowCodige(target) {
        const codigeId = target.getAttribute("data-id");
        try {
            const response = await fetch(`${URL_CODIGE}/${codigeId}`);
            if (!response.ok) throw new Error("Error al obtener el codige");
            const codige = await response.json();
            alert(`Detalles del codige:
        ID: ${codige.Codige_id}
        Número: ${codige.codige_number}
        Producto: ${codige.product_name}
        Cantidad: ${codige.product_amount}
        Precio: $${codige.price}
        Usuario: ${codige.user_name}
        Empresa: ${codige.company_name}`);
        } catch (error) {
            alert("Error al cargar el codige: " + error.message);
        }
    }

    // Editar codige
    async function handleEditCodige(target) {
        const codigeId = target.getAttribute("data-id");
        try {
            const response = await fetch(`${URL_CODIGE}/${codigeId}`);
            if (!response.ok) throw new Error("Error al obtener el codige");
            const codige = await response.json();

            document.getElementById("codigeModalLabel").textContent = "Editar Codige";
            codigeIdInput.value = codige.Codige_id;
            codigeNumberInput.value = codige.codige_number;

            // ⚠️ Ajuste: en tu backend no devuelves Orders_fk directamente
            ordersFkInput.value = codige.Orders_fk || "";
        } catch (error) {
            alert("Error al cargar el codige: " + error.message);
        }
    }

    // Eliminar codige
    async function handleDeleteCodige(target) {
        const codigeId = target.getAttribute("data-id");
        if (!confirm("¿Estás seguro de eliminar este codige?")) return;
        try {
            const response = await fetch(`${URL_CODIGE}/${codigeId}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Error al eliminar el codige");
            alert("Codige eliminado correctamente.");
            loadCodiges();
        } catch (error) {
            alert("Error al eliminar el codige: " + error.message);
        }
    }

    // Cargar órdenes para el select
    async function loadOrders() {
        try {
            const response = await fetch(URL_ORDERS);
            if (!response.ok) throw new Error("Error al cargar órdenes");
            const orders = await response.json();

            ordersFkInput.innerHTML = '<option value="">Selecciona una orden</option>';
            orders.forEach(o => {
                const option = document.createElement("option");
                option.value = o.Orders_id;
                option.textContent = `Orden #${o.Orders_id} - ${o.product_name}`;
                ordersFkInput.appendChild(option);
            });
        } catch (error) {
            alert("Error cargando órdenes: " + error.message);
        }
    }

    // Inicializar
    loadCodiges();
    loadOrders();
});
