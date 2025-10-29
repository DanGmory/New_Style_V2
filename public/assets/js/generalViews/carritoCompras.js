// Carrito de Compras - Vista de usuario
// Requiere system.js cargado antes (HOST, URL_ORDERS, etc.)

(function(){
  const cartItemsEl = document.getElementById('cartItems');
  const cartCountText = document.getElementById('cartCountText');
  const subtotalEl = document.getElementById('subtotal');
  const ivaEl = document.getElementById('iva');
  const totalEl = document.getElementById('total');
  const btnPagar = document.getElementById('btnPagar');

  const codesModalEl = document.getElementById('purchaseCodesModal');
  const codesListEl = document.getElementById('generatedCodesList');
  const codesModal = codesModalEl ? new bootstrap.Modal(codesModalEl) : null;

  const IVA_RATE = 0.19; // 19%

  function getCurrentUserEmail(){
    try { return localStorage.getItem('currentUserEmail') || localStorage.getItem('User_mail') || null; } catch { return null; }
  }

  function getCart(){
    const email = getCurrentUserEmail();
    if (!email) return [];
    const key = `carrito_${email}`;
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }

  function setCart(items){
    const email = getCurrentUserEmail();
    if (!email) return;
    const key = `carrito_${email}`;
    localStorage.setItem(key, JSON.stringify(items));
  }

  function renderCart(){
    const items = getCart();
    cartItemsEl.innerHTML = '';
    let subtotal = 0;

    items.forEach((it, idx) => {
      const price = parseFloat(it.precio || 0);
      const qty = parseInt(it.cantidad || 1, 10);
      const line = price * qty;
      subtotal += line;

      const row = document.createElement('div');
      row.className = 'd-flex align-items-center p-2 border rounded';
      row.innerHTML = `
        <img src="${it.imagen || ''}" alt="${it.nombre}" style="width:80px;height:80px;object-fit:cover" class="me-3" />
        <div class="flex-grow-1">
          <div class="fw-bold">${it.nombre}</div>
          <div class="small text-muted">${it.categoria || ''}</div>
          <div class="d-flex align-items-center gap-2 mt-1">
            <button class="btn btn-sm btn-outline-secondary btn-dec" data-index="${idx}">-</button>
            <span class="px-2">${qty}</span>
            <button class="btn btn-sm btn-outline-secondary btn-inc" data-index="${idx}">+</button>
            <span class="ms-auto fw-semibold">$${line.toFixed(2)}</span>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-danger ms-3 btn-del" data-index="${idx}"><i class="fas fa-trash"></i></button>
      `;
      cartItemsEl.appendChild(row);
    });

    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    ivaEl.textContent = `$${iva.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
    cartCountText.textContent = `Tienes ${items.length} producto${items.length === 1 ? '' : 's'} actualmente`;
  }

  // Delegación de eventos para +/- y eliminar
  cartItemsEl.addEventListener('click', (e) => {
    const btnDec = e.target.closest('.btn-dec');
    const btnInc = e.target.closest('.btn-inc');
    const btnDel = e.target.closest('.btn-del');
    const items = getCart();

    if (btnDec) {
      const i = parseInt(btnDec.getAttribute('data-index'), 10);
      items[i].cantidad = Math.max(1, (parseInt(items[i].cantidad || 1, 10) - 1));
      setCart(items); renderCart(); return;
    }
    if (btnInc) {
      const i = parseInt(btnInc.getAttribute('data-index'), 10);
      items[i].cantidad = (parseInt(items[i].cantidad || 1, 10) + 1);
      setCart(items); renderCart(); return;
    }
    if (btnDel) {
      const i = parseInt(btnDel.getAttribute('data-index'), 10);
      items.splice(i, 1);
      setCart(items); renderCart(); return;
    }
  });

  // Crear órdenes en backend y mostrar códigos
  async function checkout(){
    const items = getCart();
    if (!items.length) { alert('Tu carrito está vacío'); return; }

    // Tomar un snapshot del carrito ANTES de modificarlo, para usarlo en impresión
    const snapshot = items.map(it => ({
      id: parseInt(it.id, 10),
      nombre: it.nombre,
      precio: parseFloat(it.precio || 0) || 0,
      cantidad: parseInt(it.cantidad || 1, 10) || 1,
    }));
    try {
      const subtotalSnap = snapshot.reduce((acc, it) => acc + (it.precio * it.cantidad), 0);
      const ivaSnap = subtotalSnap * IVA_RATE;
      const totalSnap = subtotalSnap + ivaSnap;
      localStorage.setItem('lastCheckoutSnapshot', JSON.stringify(snapshot));
      localStorage.setItem('lastCheckoutTotals', JSON.stringify({ subtotal: subtotalSnap, iva: ivaSnap, total: totalSnap }));
    } catch {}

    // Requiere que el backend de orders acepte Product_fk, User_fk, State_order_fk
    // y que genere automáticamente codige en addOrders (ya implementado en backend)

    const userId = await resolveUserId();
    if (!userId) { alert('No se pudo identificar al usuario'); return; }

    // Obtener un State_order_fk válido desde el backend
    const stateId = await resolveDefaultStateOrderId();
    if (!stateId) {
      alert('No hay estados de pedido configurados. Crea al menos uno en el sistema.');
      return;
    }

    const codes = [];
    for (const it of items) {
      try {
        // Necesitamos el Product_fk; asumimos que el id guardado en carrito es el Product_id
        const productId = parseInt(it.id, 10);
        if (!Number.isFinite(productId) || productId <= 0) { console.warn('ID de producto inválido en carrito:', it); continue; }
        const payload = { Product_fk: productId, User_fk: userId, State_order_fk: stateId };
        const res = await fetch(HOST + URL_ORDERS, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        if (!res.ok) { console.error('Fallo creando orden', await safeRead(res)); continue; }
        const data = await res.json();
        const code = data?.data?.[0]?.Codige_number;
        if (code) codes.push(code);
      } catch (err) {
        console.error('Error creando orden', err);
      }
    }

    if (codes.length) {
      codesListEl.innerHTML = '';
      codes.forEach(c => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `<span>${c}</span><button class="btn btn-sm btn-outline-primary btn-copy" data-code="${c}"><i class="fa fa-copy"></i></button>`;
        codesListEl.appendChild(li);
      });
      codesModal && codesModal.show();
      // Vaciar carrito
      setCart([]); renderCart();
    } else {
      alert('No se generaron códigos. Revisa la consola por errores.');
    }
  }

  async function safeRead(res){ try { return await res.json(); } catch { try { return await res.text(); } catch { return null; } } }

  async function resolveUserId(){
    // Obtiene el usuario por email desde /api_v1/users
    try {
      const email = getCurrentUserEmail();
      if (!email) return null;
      const res = await fetch(HOST + URL_USERS);
      if (!res.ok) return null;
      const list = await res.json();
      const u = list.find(x => (x.User_mail || '').toLowerCase() === String(email).toLowerCase());
      return u?.User_id || null;
    } catch { return null; }
  }

  async function resolveDefaultStateOrderId(){
    // Busca un estado con nombre 'pendiente' (insensible a mayúsculas), si no existe toma el primero
    try {
      const res = await fetch(HOST + URL_STATE_ORDER);
      if (!res.ok) return null;
      const list = await res.json();
      if (!Array.isArray(list) || !list.length) return null;
      const match = list.find(x => (x.State_order_name || '').toLowerCase() === 'pendiente');
      return match?.State_order_id || list[0]?.State_order_id || null;
    } catch { return null; }
  }

  document.getElementById('btnPagar').addEventListener('click', checkout);

  // Copiar código desde el modal
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-copy');
    if (!btn) return;
    const code = btn.getAttribute('data-code');
    try { await navigator.clipboard.writeText(code); alert('Código copiado'); } catch { alert('No se pudo copiar'); }
  });

  // Imprimir códigos
  document.getElementById('printCodesBtn')?.addEventListener('click', () => {
    try {
      const lis = Array.from(codesListEl.querySelectorAll('li'));
      if (!lis.length) { alert('No hay códigos para imprimir'); return; }

      // Usar snapshot guardado durante el checkout; si no existe, intentar con el carrito actual
      let snap = [];
      try { snap = JSON.parse(localStorage.getItem('lastCheckoutSnapshot') || '[]') || []; } catch { snap = []; }
      const itemsByIdx = Array.isArray(snap) && snap.length ? snap : (Array.isArray(getCart()) ? getCart() : []);

      const lines = lis.map((li, idx) => {
        const code = (li.querySelector('span')?.textContent || '').trim();
        const price = parseFloat(itemsByIdx[idx]?.precio || 0);
        const qty = parseInt(itemsByIdx[idx]?.cantidad || 1, 10);
        const lineTotal = (Number.isFinite(price) ? price : 0) * (Number.isFinite(qty) ? qty : 1);
        const priceTxt = lineTotal > 0 ? ` - $${lineTotal.toFixed(2)}` : '';
        return { code, priceTxt };
      });

      // Calcular total preferentemente desde los totales del snapshot (incluye IVA)
      let total = 0;
      try {
        const totals = JSON.parse(localStorage.getItem('lastCheckoutTotals') || 'null');
        if (totals && Number.isFinite(totals.total)) {
          total = totals.total;
        } else {
          // Fallback: suma de líneas + IVA
          const sub = itemsByIdx.reduce((acc, it) => acc + ((parseFloat(it?.precio || 0) || 0) * (parseInt(it?.cantidad || 1, 10) || 1)), 0);
          total = sub + (sub * IVA_RATE);
        }
      } catch {
        const sub = itemsByIdx.reduce((acc, it) => acc + ((parseFloat(it?.precio || 0) || 0) * (parseInt(it?.cantidad || 1, 10) || 1)), 0);
        total = sub + (sub * IVA_RATE);
      }

      const html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Códigos de Compra</title>
        <style>body{font-family:Arial, sans-serif;padding:20px} h2{margin-top:0} ul{padding-left:20px} li{margin:8px 0} .total{margin-top:12px;font-weight:bold}</style>
      </head><body>
        <h2>Códigos de Compra</h2>
        <ul>${lines.map(l => `<li>${l.code}${l.priceTxt}</li>`).join('')}</ul>
        <div class="total">Total: $${Number.isFinite(total) ? total.toFixed(2) : '0.00'}</div>
        <script>window.onload = () => { window.print(); }<\/script>
      </body></html>`;
      const w = window.open('', '_blank');
      if (!w) { alert('Bloqueador de ventanas emergentes activo. Permite popups para imprimir.'); return; }
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (err) {
      console.error('Error imprimiendo códigos', err);
      alert('No se pudo preparar la impresión');
    }
  });

  // Init
  renderCart();
})();
