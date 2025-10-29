document.addEventListener("DOMContentLoaded", () => {
  // Referencias DOM
  const tableBody = document.querySelector("#moduleTable tbody");
  const form = document.getElementById("moduleForm");
  const modal = new bootstrap.Modal(document.getElementById("moduleModal"));
  const moduleIdInput = document.getElementById("moduleId");

  const nameInput = document.getElementById("moduleName");
  const descInput = document.getElementById("moduleDescription");
  const routeInput = document.getElementById("moduleRoute");
  const iconInput = document.getElementById("moduleIcon");

  let editMode = false;

  /** -----------------------------
   *  Cargar todos los módulos
   * ----------------------------- */
  async function loadModules() {
    try {
      const res = await fetch(HOST + URL_MODULE);
      const modules = await res.json();
      tableBody.innerHTML = "";

      modules.forEach((mod, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${mod.Module_name}</td>
          <td>${mod.Module_description}</td>
          <td>${mod.Module_route}</td>
          <td><i class="${mod.Module_icon}"></i> ${mod.Module_icon}</td>
          <td>
            <button class="btn btn-warning btn-sm me-1" data-id="${mod.Module_id}" onclick="editModule(${mod.Module_id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger btn-sm" data-id="${mod.Module_id}" onclick="deleteModule(${mod.Module_id})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("❌ Error cargando módulos:", error);
    }
  }

  /** -----------------------------
   *  Guardar módulo (crear/editar)
   * ----------------------------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      Module_name: nameInput.value.trim(),
      Module_description: descInput.value.trim(),
      Module_route: routeInput.value.trim(),
      Module_icon: iconInput.value.trim()
    };

    try {
      if (editMode) {
        const id = moduleIdInput.value;
        await fetch(`${HOST + URL_MODULE}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } else {
        await fetch(`${HOST + URL_MODULE}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      }

      form.reset();
      modal.hide();
      loadModules();
      editMode = false;
    } catch (error) {
      console.error("❌ Error guardando módulo:", error);
    }
  });

  /** -----------------------------
   *  Editar módulo
   * ----------------------------- */
  window.editModule = async (id) => {
    try {
      const res = await fetch(`${HOST + URL_MODULE}/${id}`);
      const mod = await res.json();

      moduleIdInput.value = id;
      nameInput.value = mod.Module_name;
      descInput.value = mod.Module_description;
      routeInput.value = mod.Module_route;
      iconInput.value = mod.Module_icon;

      editMode = true;
      modal.show();
    } catch (error) {
      console.error("❌ Error al obtener módulo:", error);
    }
  };

  /** -----------------------------
   *  Eliminar módulo
   * ----------------------------- */
  window.deleteModule = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este módulo?")) {
      try {
        await fetch(`${HOST + URL_MODULE}/${id}`, {
          method: "DELETE"
        });
        loadModules();
      } catch (error) {
        console.error("❌ Error eliminando módulo:", error);
      }
    }
  };

  // Inicializar
  loadModules();
});
