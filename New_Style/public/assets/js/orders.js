document.addEventListener("DOMContentLoaded", () => {
  const orderTableBody = document.querySelector("#orderTable tbody");
  const orderModal = document.getElementById("orderModal");
  const orderForm = document.getElementById("orderForm");

  const orderIdInput = document.getElementById("orderId");
  const productFkInput = document.getElementById("productFk");
  const userFkInput = document.getElementById("userFk");
  const stateOrderFkInput = document.getElementById("stateOrderFk");

  const totalOrdersEl = document.getElementById("totalOrders");
  const completedOrdersEl = document.getElementById("completedOrders");
  const pendingOrdersEl = document.getElementById("pendingOrders");

  const API_URL = "http://localhost:3000/api_v1/orders";

  // Delegación de eventos para botones
  orderTableBody.addEventListener("click", async (e) => {
    const target = e.target.closest("button");
    if (!target) return;
    if (target.classList.contains("btn-show")) await handleShowOrder(target);
    if (target.classList.contains("btn-edit")) await handleEditOrder(target);
    if (target.classList.contains("btn-delete")) await handleDeleteOrder(target);
  });

  // Cargar tabla de órdenes
  async function loadOrders() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener órdenes");
      const orders = await response.json();

      // Actualizar tabla
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
              <button class="action-btn btn-show" data-id="${order.Orders_id}"><i class="fas fa-eye"></i></button>
              <button class="action-btn btn-edit" data-id="${order.Orders_id}" data-bs-toggle="modal" data-bs-target="#orderModal"><i class="fas fa-edit"></i></button>
              <button class="action-btn btn-delete" data-id="${order.Orders_id}"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        `);
      });

      // Actualizar dashboard
      updateDashboard(orders);

    } catch (error) {
      alert("Error al cargar órdenes: " + error.message);
    }
  }

  function updateDashboard(orders) {
    totalOrdersEl.textContent = orders.length;
    const completed = orders.filter(order => order.State_order_fk === 2).length;
    const pending = orders.filter(order => order.State_order_fk === 1).length;
    completedOrdersEl.textContent = completed;
    pendingOrdersEl.textContent = pending;
  }

  // Reset modal
  document.querySelector('[data-bs-target="#orderModal"]').addEventListener("click", () => {
    document.getElementById("orderModalLabel").textContent = "Agregar Nueva Orden";
    orderForm.reset();
    orderIdInput.value = "";
  });

  // Guardar orden
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const orderId = orderIdInput.value;
    const method = orderId ? "PUT" : "POST";
    const url = orderId ? `${API_URL}/${orderId}` : API_URL;

    const data = {
      Product_fk: productFkInput.value,
      User_fk: userFkInput.value,
      State_order_fk: stateOrderFkInput.value
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Error al guardar la orden");
      bootstrap.Modal.getInstance(orderModal).hide();
      loadOrders();
    } catch (error) {
      alert("Error al guardar la orden: " + error.message);
    }
  });

  // Mostrar orden
  async function handleShowOrder(target) {
    const orderId = target.getAttribute("data-id");
    try {
      const response = await fetch(`${API_URL}/${orderId}`);
      if (!response.ok) throw new Error("Error al obtener la orden");
      const order = await response.json();
      alert(`Detalles de la orden:
        ID: ${order.Orders_id}
        Producto: ${order.product_name}
        Cantidad: ${order.product_amount}
        Precio: $${order.price}
        Usuario: ${order.user_name}
        Empresa: ${order.company_name}
        Estado: ${order.state_order_name}`);
    } catch (error) {
      alert("Error al cargar la orden: " + error.message);
    }
  }

  // Editar orden
  async function handleEditOrder(target) {
    const orderId = target.getAttribute("data-id");
    try {
      const response = await fetch(`${API_URL}/${orderId}`);
      if (!response.ok) throw new Error("Error al obtener la orden");
      const order = await response.json();

      document.getElementById("orderModalLabel").textContent = "Editar Orden";
      orderIdInput.value = order.Orders_id;
      productFkInput.value = order.Product_fk;
      userFkInput.value = order.User_fk;
      stateOrderFkInput.value = order.State_order_fk;

    } catch (error) {
      alert("Error al cargar la orden: " + error.message);
    }
  }

  // Eliminar orden
  async function handleDeleteOrder(target) {
    const orderId = target.getAttribute("data-id");
    if (!confirm("¿Estás seguro de eliminar esta orden?")) return;
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Error al eliminar la orden");
      alert("Orden eliminada correctamente.");
      loadOrders();
    } catch (error) {
      alert("Error al eliminar la orden: " + error.message);
    }
  }

  // Cargar productos
  async function loadProducts() {
    try {
      const response = await fetch("http://localhost:3000/api_v1/products");
      if (!response.ok) throw new Error("Error al cargar productos");
      const products = await response.json();

      productFkInput.innerHTML = '<option value="">Selecciona un producto</option>';
      products.forEach(p => {
        const option = document.createElement("option");
        option.value = p.Product_id;
        option.textContent = p.Product_name;
        productFkInput.appendChild(option);
      });
    } catch (error) {
      alert("Error cargando productos: " + error.message);
    }
  }

  // Cargar usuarios
  async function loadUsers() {
    try {
      const response = await fetch("http://localhost:3000/api_v1/users");
      if (!response.ok) throw new Error("Error al cargar usuarios");
      const users = await response.json();

      userFkInput.innerHTML = '<option value="">Selecciona un usuario</option>';
      users.forEach(u => {
        const option = document.createElement("option");
        option.value = u.User_id;
        option.textContent = u.User_name;
        userFkInput.appendChild(option);
      });
    } catch (error) {
      alert("Error cargando usuarios: " + error.message);
    }
  }

  // Cargar estados de orden
  async function loadStateOrders() {
    try {
      const response = await fetch("http://localhost:3000/api_v1/stateOrder");
      if (!response.ok) throw new Error("Error al cargar estados");
      const states = await response.json();

      stateOrderFkInput.innerHTML = '<option value="">Selecciona un estado</option>';
      states.forEach(s => {
        const option = document.createElement("option");
        option.value = s.State_order_id;
        option.textContent = s.State_order_name;
        stateOrderFkInput.appendChild(option);
      });
    } catch (error) {
      alert("Error cargando estados de orden: " + error.message);
    }
  }

  // Inicializar
  loadOrders();
  loadProducts();
  loadUsers();
  loadStateOrders();
});
