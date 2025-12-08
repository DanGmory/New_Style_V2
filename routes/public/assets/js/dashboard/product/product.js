(function(){
  // Requiere system.js: HOST, URL_PRODUCTS, URL_BRAND, URL_COLORS, URL_SIZE, URL_TYPE_PRODUCT, URL_IMAGE

  const tableBody = document.querySelector('#productTable tbody');
  const productModalEl = document.getElementById('productModal');
  const productModal = productModalEl ? new bootstrap.Modal(productModalEl) : null;
  const form = document.getElementById('productForm');

  // Inputs
  const fId = document.getElementById('productId');
  const fName = document.getElementById('productName');
  const fAmount = document.getElementById('productAmount');
  const fCategory = document.getElementById('productCategory');
  const fDesc = document.getElementById('productDescription');
  const fPrice = document.getElementById('productPrice');
  const fImage = document.getElementById('productImage');
  const fBrand = document.getElementById('productBrand');
  const fColor = document.getElementById('productColor');
  const fSize = document.getElementById('productSize');
  const fType = document.getElementById('productTypeProduct');

  let currentData = [];

  // Utilidad fetch JSON con manejo básico de error
  async function fx(url, opts){
    const res = await fetch(url, opts);
    if(!res.ok){
      let msg = `HTTP ${res.status}`;
      try { const j = await res.json(); msg = j.error || j.message || msg; } catch {}
      throw new Error(msg);
    }
    try { return await res.json(); } catch { return null; }
  }

  async function loadProducts(){
    try{
      const list = await fx(HOST + URL_PRODUCTS);
      currentData = Array.isArray(list) ? list : [];
      renderTable(currentData);
    }catch(err){
      console.error('Cargando productos:', err);
      currentData = [];
      renderTable([]);
    }
  }

  function renderTable(list){
    tableBody.innerHTML = '';
    list.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.Product_id}</td>
        <td>${p.Product_name}</td>
        <td>${p.Product_amount}</td>
        <td>${p.Product_category}</td>
        <td>${p.price}</td>
        <td>${p.Brand_name || ''}</td>
        <td>${p.Color_name || ''}</td>
        <td>${p.Size_name || ''}</td>
        <td>${p.Type_product_name || ''}</td>
        <td>${p.Image_url ? `<img src="${normalizeImg(p.Image_url)}" alt="${p.Image_name || ''}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;"/>` : ''}</td>
        <td>
          <button class="btn btn-sm btn-success btn-get" data-id="${p.Product_id}" title="Ver"><i class="fa fa-eye"></i></button>
          <button class="btn btn-sm btn-warning btn-edit" data-id="${p.Product_id}" title="Editar"><i class="fa fa-edit"></i></button>
          <button class="btn btn-sm btn-danger btn-del" data-id="${p.Product_id}" title="Eliminar"><i class="fa fa-trash"></i></button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function normalizeImg(url){
    // Si por algún motivo quedó guardada con prefijo /public, quítalo para que el static la sirva
    try {
      return String(url).replace(/^\/public\//, '/');
    } catch { return url; }
  }

  // Cargar data para selects
  async function loadSelect(url, selectEl, idKey, nameKey){
    selectEl.innerHTML = '<option value="" disabled selected>Seleccione...</option>';
    try{
      const list = await fx(HOST + url);
      (list || []).forEach(it => {
        const opt = document.createElement('option');
        opt.value = it[idKey];
        opt.textContent = it[nameKey];
        selectEl.appendChild(opt);
      });
    }catch(err){
      console.error('Cargando select', url, err);
    }
  }

  async function loadFormOptions(){
    await Promise.all([
      loadSelect(URL_IMAGE, fImage, 'Image_id', 'Image_name'),
      loadSelect(URL_BRAND, fBrand, 'Brand_id', 'Brand_name'),
      loadSelect(URL_COLORS, fColor, 'Color_id', 'Color_name'),
      loadSelect(URL_SIZE, fSize, 'Size_id', 'Size_name'),
      loadSelect(URL_TYPE_PRODUCT, fType, 'Type_product_id', 'Type_product_name'),
    ]);
  }

  // Abrir modal para nuevo
  productModalEl?.addEventListener('show.bs.modal', async (e) => {
    const isEdit = !!fId.value;
    document.getElementById('productModalLabel').textContent = isEdit ? 'Editar Producto' : 'Agregar Nuevo Producto';
    await loadFormOptions();
  });

  // Editar
  tableBody.addEventListener('click', async (e) => {
  const btnE = e.target.closest('.btn-edit');
  const btnD = e.target.closest('.btn-del');
  const btnV = e.target.closest('.btn-get');
  if(btnV){
      const id = btnV.getAttribute('data-id');
      try{
        const d = await fx(`${HOST + URL_PRODUCTS}/${id}`);
        // Completar modal de vista
        document.getElementById('vId').textContent = d.Product_id;
        document.getElementById('vName').textContent = d.Product_name || '';
        document.getElementById('vAmount').textContent = d.Product_amount || '';
        document.getElementById('vCategory').textContent = d.Product_category || '';
        document.getElementById('vDescription').textContent = d.Product_description || '';
        document.getElementById('vPrice').textContent = d.price || '';
        document.getElementById('vBrand').textContent = d.Brand_name || '';
        document.getElementById('vColor').textContent = d.Color_name || '';
        document.getElementById('vSize').textContent = d.Size_name || '';
        document.getElementById('vType').textContent = d.Type_product_name || '';
        const img = document.getElementById('vImage');
        img.src = d.Image_url ? normalizeImg(d.Image_url) : '';
        img.style.display = d.Image_url ? 'block' : 'none';
        const viewModal = new bootstrap.Modal(document.getElementById('productViewModal'));
        viewModal.show();
      }catch(err){
        console.error('Ver producto:', err);
        alert('No se pudo cargar el detalle: ' + err.message);
      }
    }
    if(btnE){
      const id = btnE.getAttribute('data-id');
      const item = currentData.find(p => String(p.Product_id) === String(id));
      if(!item) return;
      // Set form values (note mapping names expected por backend)
      fId.value = item.Product_id;
      fName.value = item.Product_name || '';
      fAmount.value = item.Product_amount || '';
      fCategory.value = item.Product_category || '';
      fDesc.value = item.Product_description || '';
      fPrice.value = item.price || '';
      await loadFormOptions();
      // Para selects, se requiere el fk numérico; como showProducts devuelve nombres, necesitamos resolver IDs
      // Estrategia: al editar, pedimos detalle del producto por ID y usamos sus FKs si existieran; de lo contrario, dejamos al usuario re-seleccionar.
      try {
        const detail = await fx(`${HOST + URL_PRODUCTS}/${id}`);
        // detail no incluye los FKs, solo nombres; así que no podemos setear value exacto. Mantendremos selección manual.
      } catch {}
      productModal && productModal.show();
    }
    if(btnD){
      const id = btnD.getAttribute('data-id');
      if(!confirm('¿Eliminar este producto?')) return;
      try{
        await fx(`${HOST + URL_PRODUCTS}/${id}`, { method: 'DELETE' });
        await loadProducts();
      }catch(err){ alert('Error eliminando: ' + err.message); }
    }
  });

  // Guardar (crear o actualizar)
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    try{
      const payload = mapFormToPayload();
      validatePayload(payload);
      const id = fId.value.trim();
      if(id){
        await fx(`${HOST + URL_PRODUCTS}/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      }else{
        await fx(HOST + URL_PRODUCTS, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      }
      productModal && productModal.hide();
      form.reset();
      fId.value = '';
      await loadProducts();
    }catch(err){
      console.error('Guardar producto:', err);
      alert('Error guardando: ' + err.message);
    }
  });

  function mapFormToPayload(){
    return {
      Name: fName.value.trim(),
      Amount: Number(fAmount.value),
      category: fCategory.value.trim(),
      description: fDesc.value.trim(),
      price: Number(fPrice.value),
      Image_fk: Number(fImage.value),
      Brand_fk: Number(fBrand.value),
      Color_fk: Number(fColor.value),
      Size_fk: Number(fSize.value),
      Type_product_fk: Number(fType.value),
    };
  }

  function validatePayload(p){
    const requiredKeys = ['Name','Amount','category','description','price','Image_fk','Brand_fk','Color_fk','Size_fk','Type_product_fk'];
    for(const k of requiredKeys){
      if(p[k] === undefined || p[k] === null || p[k] === '' || (typeof p[k] === 'number' && (!Number.isFinite(p[k]) || p[k] <= 0))){
        throw new Error(`Campo inválido o faltante: ${k}`);
      }
    }
  }

  // Inicial
  loadProducts();
})();
