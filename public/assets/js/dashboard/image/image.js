document.addEventListener("DOMContentLoaded", () => {
  const imageTableBody = document.getElementById("imageTableBody");
  const imageForm = document.getElementById("uploadForm");

  async function fetchImages() {
    const res = await fetch(`${HOST}${URL_IMAGE}`);
    const images = await res.json();

    imageTableBody.innerHTML = "";
    images.forEach((img, index) => {
      const row = document.createElement("tr");
      const imgSrc = img.Image_url.startsWith("http")
        ? img.Image_url
        : `${HOST}${img.Image_url}`;

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${img.Image_name}</td>
        <td>
          ${
            img.Image_url.endsWith(".pdf")
              ? `<a href="${imgSrc}" target="_blank"> Ver PDF</a>`
        : `<img src="${imgSrc}" alt="${img.Image_name}" style="max-height: 80px;" 
          onerror="this.onerror=null; this.src='${HOST}${img.Image_url}';">`
          }
        </td>
        <td>
          <button class="btn-action btn-action-view show-btn" data-id="${img.Image_id}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-action btn-action-edit edit-btn" data-id="${img.Image_id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-action btn-action-delete delete-btn" data-id="${img.Image_id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      imageTableBody.appendChild(row);
    });

    bindImageActions();
  }

  function bindImageActions() {
    document.querySelectorAll(".show-btn").forEach((btn) => {
      btn.addEventListener("click", handleShowImage);
    });
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", handleEditImage);
    });
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", handleDeleteImage);
    });
  }

  imageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const imageId = document.getElementById("imageId").value;
    const imageName = document.getElementById("customName").value;
    const fileInput = document.getElementById("fileInput");

    // ✅ Backend espera "Image_name"
    formData.append("Image_name", imageName);

    if (fileInput.files && fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }

    if (!imageId && (!fileInput.files || fileInput.files.length === 0)) {
      alert("Por favor selecciona un archivo para subir.");
      return;
    }

    // Asegurar la barra antes del id y enviar el nombre con la clave esperada por el backend
    if (imageName) {
      // Compatibilidad: algunos controladores leen req.body.name
      formData.append("name", imageName);
    }
    const url = imageId
      ? `${HOST}${URL_IMAGE}/${imageId}`
      : `${HOST}${URL_IMAGE}`;
    const method = imageId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });

    if (res.ok) {
      alert(imageId ? "Imagen actualizada correctamente." : "Imagen subida correctamente.");
      imageForm.reset();
      document.getElementById("imageId").value = "";
      document.getElementById("imageModalLabel").textContent = "Subir Imagen";
      const modal = bootstrap.Modal.getInstance(document.getElementById("imageModal"));
      modal.hide();
      fetchImages();
    } else {
      const data = await res.json();
      alert("Error al subir/actualizar la imagen: " + data.message);
    }
  });

  async function handleShowImage(e) {
    const id = e.target.closest("button").getAttribute("data-id");
  const res = await fetch(`${HOST}${URL_IMAGE}/${id}`);
    const img = await res.json();
    alert(`Detalles:\nID: ${img.Image_id}\nNombre: ${img.Image_name}\nRuta: ${img.Image_url}`);
  }

  async function handleEditImage(e) {
    const id = e.target.closest("button").getAttribute("data-id");
  const res = await fetch(`${HOST}${URL_IMAGE}/${id}`);
    const img = await res.json();

    document.getElementById("imageId").value = img.Image_id;
    document.getElementById("customName").value = img.Image_name;
    document.getElementById("imageModalLabel").textContent = "Editar Imagen";
    const modal = new bootstrap.Modal(document.getElementById("imageModal"));
    modal.show();
  }

  async function handleDeleteImage(e) {
    const id = e.target.closest("button").getAttribute("data-id");
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;
  const res = await fetch(`${HOST}${URL_IMAGE}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Imagen eliminada correctamente.");
      fetchImages();
    } else {
      alert("Error al eliminar la imagen");
    }
  }

  fetchImages();
});
