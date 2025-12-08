document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // Referencias DOM
  // ==========================
  const orderTableBody = document.querySelector("#orderTable tbody");
  const orderModal = new bootstrap.Modal(document.getElementById("orderModal"));
  const orderForm = document.getElementById("orderForm");

  const orderIdInput = document.getElementById("orderId");
  const productFkInput = document.getElementById("productFk");
  const userFkInput = document.getElementById("userFk");
  const stateOrderFkInput = document.getElementById("stateOrderFk");

  const totalOrdersEl = document.getElementById("totalOrders");
  const completedOrdersEl = document.getElementById("completedOrders");
  const pendingOrdersEl = document.getElementById("pendingOrders");

  // ==========================
  // URLs base
  // ==========================
  const URL_ORDERS = "http://localhost:3000/api_v1/orders";
  const URL_PRODUCTS = "http://localhost:3000/api_v1/products";
  const URL_USERS = "http://localhost:3000/api_v1/users";
  const URL_STATE_ORDER = "http://localhost:3000/api_v1/StateOrder";

  // ==========================
  // Delegación de eventos (acciones tabla)
  // ==========================
  orderTableBody.addEventListener("click", async (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    if (target.classList.contains("btn-show")) await showOrder(target);
    if (target.classList.contains("btn-edit")) await editOrder(target);
    if (target.classList.contains("btn-delete")) await deleteOrder(target);
  });

  // ==========================
  // Cargar tabla de órdenes
  // ==========================
  async function loadOrders() {
    try {
      const res = await fetch(URL_ORDERS);
      if (!res.ok) throw new Error("Error al obtener órdenes");
      const orders = await res.json();

      orderTableBody.innerHTML = "";
      orders.forEach(order => {
        orderTableBody.insertAdjacentHTML("beforeend", `
          <tr>
            <td>${order.Orders_id}</td>
            <td>${order.product_name}</td>
            <td>${order.product_amount}</td>
            <td>$${order.price}</td>
            <td><img src="${order.image_url}" width="60" /></td>
            <td>${order.user_name}</td>
            <td>${order.company_name}</td>
            <td>${order.state_order_name}</td>
            <td>
              <button class="btn btn-info btn-sm me-1 btn-show" data-id="${order.Orders_id}">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-warning btn-sm me-1 btn-edit" data-id="${order.Orders_id}" data-bs-toggle="modal" data-bs-target="#orderModal">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-sm btn-delete" data-id="${order.Orders_id}">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `);
      });

      updateDashboard(orders);
    } catch (error) {
      console.error("❌ Error al cargar órdenes:", error);
      alert("Error al cargar órdenes: " + error.message);
    }
  }

  // ==========================
  // Dashboard
  // ==========================
  function updateDashboard(stats) {
    // Ejemplo: { totalOrders: 10, completedOrders: 4, pendingOrders: 6 }

    const totalOrdersEl = document.getElementById("totalOrders");
    if (totalOrdersEl) totalOrdersEl.textContent = stats.totalOrders;

    const completedOrdersEl = document.getElementById("completedOrders");
    if (completedOrdersEl) completedOrdersEl.textContent = stats.completedOrders;

    const pendingOrdersEl = document.getElementById("pendingOrders");
    if (pendingOrdersEl) pendingOrdersEl.textContent = stats.pendingOrders;
}

  // ==========================
  // Reset modal
  // ==========================
  document.querySelector('[data-bs-target="#orderModal"]').addEventListener("click", () => {
    document.getElementById("orderModalLabel").textContent = "Agregar Nueva Orden";
    orderForm.reset();
    orderIdInput.value = "";
  });

  // ==========================
  // Guardar orden
  // ==========================
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const orderId = orderIdInput.value;
    const method = orderId ? "PUT" : "POST";
    const url = orderId ? `${URL_ORDERS}/${orderId}` : URL_ORDERS;

    const data = {
      Product_fk: productFkInput.value,
      User_fk: userFkInput.value,
      State_order_fk: stateOrderFkInput.value
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Error al guardar la orden");

      orderForm.reset();
      orderModal.hide();
      loadOrders();
    } catch (error) {
      console.error("❌ Error guardando orden:", error);
      alert("Error al guardar la orden: " + error.message);
    }
  });

  // ==========================
  // Mostrar orden
  // ==========================
  async function showOrder(target) {
    const id = target.getAttribute("data-id");
    try {
      const res = await fetch(`${URL_ORDERS}/${id}`);
      if (!res.ok) throw new Error("Error al obtener la orden");
      const order = await res.json();

      alert(`Detalles de la orden:
        ID: ${order.Orders_id}
        Producto: ${order.product_name}
        Cantidad: ${order.product_amount}
        Precio: $${order.price}
        Usuario: ${order.user_name}
        Empresa: ${order.company_name}
        Estado: ${order.state_order_name}`);
    } catch (error) {
      console.error("❌ Error al mostrar orden:", error);
      alert("Error al cargar la orden: " + error.message);
    }
  }

  // ==========================
  // Editar orden
  // ==========================
  async function editOrder(target) {
    const id = target.getAttribute("data-id");
    try {
      const res = await fetch(`${URL_ORDERS}/${id}`);
      if (!res.ok) throw new Error("Error al obtener la orden");
      const order = await res.json();

      document.getElementById("orderModalLabel").textContent = "Editar Orden";
      orderIdInput.value = order.Orders_id;

      // ⚠️ Ajuste importante:
      // Si tu backend no devuelve Product_fk, User_fk y State_order_fk,
      // debes agregarlos en el SELECT. 
      productFkInput.value = order.Product_fk || "";
      userFkInput.value = order.User_fk || "";
      stateOrderFkInput.value = order.State_order_fk || "";

    } catch (error) {
      console.error("❌ Error al editar orden:", error);
      alert("Error al cargar la orden: " + error.message);
    }
  }

  // ==========================
  // Eliminar orden
  // ==========================
  async function deleteOrder(target) {
    const id = target.getAttribute("data-id");
    if (!confirm("¿Seguro que deseas eliminar esta orden?")) return;

    try {
      const res = await fetch(`${URL_ORDERS}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar la orden");

      alert("Orden eliminada correctamente.");
      loadOrders();
    } catch (error) {
      console.error("❌ Error al eliminar orden:", error);
      alert("Error al eliminar la orden: " + error.message);
    }
  }

  // ==========================
  // Cargar selects
  // ==========================
  async function loadProducts() {
    try {
      const res = await fetch(URL_PRODUCTS);
      if (!res.ok) throw new Error("Error al cargar productos");
      const products = await res.json();

      productFkInput.innerHTML = '<option value="">Selecciona un producto</option>';
      products.forEach(p => {
        const option = document.createElement("option");
        option.value = p.Product_id;
        option.textContent = p.Product_name;
        productFkInput.appendChild(option);
      });
    } catch (error) {
      console.error("❌ Error cargando productos:", error);
    }
  }

  async function loadUsers() {
    try {
      const res = await fetch(URL_USERS);
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const users = await res.json();

      userFkInput.innerHTML = '<option value="">Selecciona un usuario</option>';
      users.forEach(u => {
        const option = document.createElement("option");
        option.value = u.User_id;
        option.textContent = u.User_name;
        userFkInput.appendChild(option);
      });
    } catch (error) {
      console.error("❌ Error cargando usuarios:", error);
    }
  }

  async function loadStateOrders() {
    try {
      const res = await fetch(URL_STATE_ORDER);
      if (!res.ok) throw new Error("Error al cargar estados");
      const states = await res.json();

      stateOrderFkInput.innerHTML = '<option value="">Selecciona un estado</option>';
      states.forEach(s => {
        const option = document.createElement("option");
        option.value = s.State_order_id;
        option.textContent = s.State_order_name;
        stateOrderFkInput.appendChild(option);
      });
    } catch (error) {
      console.error("❌ Error cargando estados de orden:", error);
    }
  }

  // ==========================
  // Inicialización
  // ==========================
  loadOrders();
  loadProducts();
  loadUsers();
  loadStateOrders();
});
