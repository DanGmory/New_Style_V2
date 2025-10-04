document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#codigeTable tbody');
  const modalEl = document.getElementById('codigeModal');
  const modal = modalEl ? new bootstrap.Modal(modalEl) : null;

  const form = document.getElementById('codigeForm');
  const inputId = document.getElementById('codigeId');
  const inputNumber = document.getElementById('codigeNumber');
  const selectOrder = document.getElementById('ordersFk');
  const titleEl = document.getElementById('codigeModalLabel');

  // Load list
  async function loadCodige() {
    try {
      const res = await fetch(HOST + URL_CODIGE);
      if (!res.ok) throw new Error('No se pudo obtener la lista de códigos');
      const list = await res.json();
      tableBody.innerHTML = '';
      list.forEach(row => {
        tableBody.insertAdjacentHTML('beforeend', `
          <tr>
            <td>${row.Codige_id}</td>
            <td>${row.codige_number}</td>
            <td>${row.product_name}</td>
            <td>${row.product_amount}</td>
            <td>${row.price}</td>
            <td>${row.user_name}</td>
            <td>${row.company_name}</td>
            <td>
              <button class="btn btn-sm btn-warning btn-edit" data-id="${row.Codige_id}"><i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-danger btn-delete" data-id="${row.Codige_id}"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        `);
      });
    } catch (e) {
      console.error(e);
      alert('Error cargando códigos');
    }
  }

  // Load orders into select
  async function loadOrders() {
    try {
      const res = await fetch(HOST + URL_ORDERS);
      if (!res.ok) throw new Error('No se pudieron cargar las órdenes');
      const list = await res.json();
      selectOrder.innerHTML = '<option value="" disabled selected>Seleccione una orden</option>';
      list.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.Orders_id;
        opt.textContent = `#${o.Orders_id} - ${o.product_name} (${o.product_amount}) - ${o.user_name}`;
        selectOrder.appendChild(opt);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Reset modal for create
  document.querySelector('[data-bs-target="#codigeModal"]').addEventListener('click', async () => {
    titleEl.textContent = 'Agregar Nuevo Código';
    inputId.value = '';
    inputNumber.value = '';
    await loadOrders();
  });

  // Delegate actions
  tableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');

    if (btn.classList.contains('btn-delete')) {
      if (!confirm('¿Eliminar este código?')) return;
      try {
        const res = await fetch(`${HOST + URL_CODIGE}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('No se pudo eliminar');
        loadCodige();
      } catch (e) {
        console.error(e);
        alert('Error eliminando código');
      }
      return;
    }

    if (btn.classList.contains('btn-edit')) {
      try {
        const res = await fetch(`${HOST + URL_CODIGE}/${id}`);
        if (!res.ok) throw new Error('No se pudo obtener el código');
        const item = await res.json();
        titleEl.textContent = 'Editar Código';
        inputId.value = item.Codige_id;
        inputNumber.value = item.codige_number || item.Codige_number || '';
        await loadOrders();
        if (item.orders_fk) {
          selectOrder.value = String(item.orders_fk);
        }
        modal && modal.show();
      } catch (e) {
        console.error(e);
        alert('Error cargando código');
      }
    }
  });

  // Submit form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = inputId.value;
    const number = inputNumber.value.trim();
    const orderId = parseInt(selectOrder.value, 10);
    if (!number || Number.isNaN(orderId) || orderId <= 0) {
      alert('Complete los campos obligatorios');
      return;
    }
    const payload = { Codige_number: number, Orders_fk: orderId };
    try {
      const url = id ? `${HOST + URL_CODIGE}/${id}` : HOST + URL_CODIGE;
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        try { console.error('Respuesta:', await res.json()); } catch {}
        throw new Error('No se pudo guardar');
      }
      modal && modal.hide();
      loadCodige();
    } catch (e) {
      console.error(e);
      alert('Error guardando');
    }
  });

  // Init
  loadCodige();
});
