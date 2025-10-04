// Vista de usuario para Códigos de Compra
// Requisitos del backend (controllers/codige.Controller.js):
// - GET /api_v1/codige -> retorna: Codige_id, codige_number, product_name, product_amount, price, user_name, company_name
// - GET /api_v1/codige/:id -> retorna detalle del mismo con los mismos campos y orders_fk

(function(){
  // Dependencias globales: HOST, URL_CODIGE de system.js
  const tbody = document.querySelector('#codesTable tbody');
  const emptyNotice = document.getElementById('emptyNotice');
  const btnDownloadCsv = document.getElementById('downloadCsvBtn');

  const modalEl = document.getElementById('codeDetailModal');
  const modal = modalEl ? new bootstrap.Modal(modalEl) : null;

  const dCode = document.getElementById('dCode');
  const dProduct = document.getElementById('dProduct');
  const dAmount = document.getElementById('dAmount');
  const dPrice = document.getElementById('dPrice');
  const dCompany = document.getElementById('dCompany');
  const copyBtn = document.getElementById('copyCodeBtn');

  // Carga la lista completa y filtra por usuario logueado si hay info en localStorage
  let lastData = [];
  async function loadCodes() {
    try {
      const res = await fetch(HOST + URL_CODIGE);
      if (!res.ok) throw new Error('No se pudo cargar la lista');
      let list = await res.json();

      // Si hay usuario logueado en localStorage, filtra por nombre de usuario o email si existiera
      try {
        const userInfo = JSON.parse(localStorage.getItem('userLoggedNewStyle') || 'null');
        const mail = userInfo?.email || userInfo?.User_mail || null;
        const name = userInfo?.name || userInfo?.User_name || null;
        if (name) {
          list = list.filter(x => (x.user_name || '').toLowerCase() === String(name).toLowerCase());
        }
        // Si en tu backend se expone el correo del usuario en esta lista, podrías filtrar por mail también.
      } catch {}

      lastData = Array.isArray(list) ? list : [];
      render(lastData);
    } catch (e) {
      console.error(e);
      lastData = [];
      render([]);
    }
  }

  function render(list) {
    tbody.innerHTML = '';
    if (!list || !list.length) {
      emptyNotice.style.display = 'block';
      return;
    }
    emptyNotice.style.display = 'none';

    list.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${row.codige_number}</td>
        <td>${row.product_name}</td>
        <td>${row.product_amount}</td>
        <td>${row.price}</td>
        <td>${row.company_name}</td>
        <td>
          <button class="btn btn-sm btn-secondary btn-detail" data-id="${row.Codige_id}"><i class="fa fa-eye"></i></button>
          <button class="btn btn-sm btn-primary btn-copy" data-code="${row.codige_number}"><i class="fa fa-copy"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.classList.contains('btn-copy')) {
      const code = btn.getAttribute('data-code');
      try {
        await navigator.clipboard.writeText(code);
        alert('Código copiado al portapapeles');
      } catch {
        alert('No se pudo copiar el código');
      }
      return;
    }

    if (btn.classList.contains('btn-detail')) {
      const id = btn.getAttribute('data-id');
      try {
        const res = await fetch(`${HOST + URL_CODIGE}/${id}`);
        if (!res.ok) throw new Error('No se pudo cargar el detalle');
        const item = await res.json();
        dCode.textContent = item.codige_number;
        dProduct.textContent = item.product_name;
        dAmount.textContent = item.product_amount;
        dPrice.textContent = item.price;
        dCompany.textContent = item.company_name;
        modal && modal.show();
      } catch (err) {
        console.error(err);
        alert('Error cargando detalle');
      }
    }
  });

  copyBtn?.addEventListener('click', async () => {
    const code = dCode?.textContent || '';
    try {
      await navigator.clipboard.writeText(code);
      alert('Código copiado al portapapeles');
    } catch {
      alert('No se pudo copiar el código');
    }
  });

  // Descargar CSV con las filas visibles
  btnDownloadCsv?.addEventListener('click', () => {
    try {
      if (!lastData || !lastData.length) { alert('No hay datos para descargar'); return; }
      const headers = ['Codigo','Producto','Cantidad','Precio','Empresa'];
      const rows = lastData.map(r => [
        safeCSV(r.codige_number),
        safeCSV(r.product_name),
        safeCSV(r.product_amount),
        safeCSV(r.price),
        safeCSV(r.company_name)
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0,10);
      a.download = `mis_codigos_${date}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generando CSV', err);
      alert('No se pudo generar la descarga');
    }
  });

  function safeCSV(val){
    if (val === null || val === undefined) return '';
    const s = String(val).replace(/"/g, '""');
    // Si contiene coma o comillas, encerrar en comillas
    return /[",\n]/.test(s) ? `"${s}"` : s;
  }

  loadCodes();
})();
