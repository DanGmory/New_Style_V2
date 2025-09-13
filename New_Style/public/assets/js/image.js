const imageTableBody = document.getElementById('imageTableBody');
const uploadForm = document.getElementById('uploadForm');

// Cargar imágenes al iniciar
async function fetchImages() {
  const res = await fetch('http://localhost:3000/api_v1/Img');
  const images = await res.json();

  imageTableBody.innerHTML = '';
  images.forEach((img, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${img.Image_name}</td>
      <td>
        <img src="${img.Image_url}" alt="${img.Image_name}" style="max-height: 80px;">
      </td>
      <td>
        <button class="btn btn-info btn-sm view-btn" data-id="${img.Image_id}">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-warning btn-sm edit-btn" data-id="${img.Image_id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${img.Image_id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    imageTableBody.appendChild(row);
  });

  bindImageActions();
}

// Asignar eventos a los botones
function bindImageActions() {
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", handleShowImage);
  });
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", handleEditImage);
  });
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", handleDeleteImage);
  });
}

// Subir o actualizar imagen
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);
  const imageId = document.getElementById("imageId").value;

  const url = imageId
    ? `http://localhost:3000/api_v1/Img/${imageId}`
    : `http://localhost:3000/api_v1/Img`;

  const method = imageId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method: method,
    body: formData
  });

  if (res.ok) {
    alert(imageId ? 'Imagen actualizada correctamente.' : 'Imagen subida correctamente.');
    uploadForm.reset();
    document.getElementById("imageId").value = ""; // Limpiar el ID
    document.getElementById("imageModalLabel").textContent = "Subir Imagen"; // Restaurar título
    const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
    modal.hide();
    fetchImages();
  } else {
    alert('Error al subir/actualizar la imagen.');
  }
});

// Ver detalles de una imagen
async function handleShowImage(e) {
  const id = e.target.closest("button").getAttribute("data-id");
  try {
    const res = await fetch(`http://localhost:3000/api_v1/Img/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener la imagen");
    const img = await res.json();
    alert(`Detalles:\nID: ${img.Image_id}\nNombre: ${img.Image_name}\nURL: ${img.Image_url}`);
  } catch (error) {
    alert("Error al obtener la imagen: " + error.message);
  }
}

// Editar imagen
async function handleEditImage(e) {
  const id = e.target.closest("button").getAttribute("data-id");
  try {
    const res = await fetch(`http://localhost:3000/api_v1/Img/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener la imagen");
    const img = await res.json();

    document.getElementById("imageModalLabel").textContent = "Editar Imagen";
    document.getElementById("customName").value = img.Image_name; // OJO: tu input es customName
    document.getElementById("imageId").value = img.Image_id;

    const modal = new bootstrap.Modal(document.getElementById("imageModal"));
    modal.show();
  } catch (error) {
    alert("Error al cargar la imagen: " + error.message);
  }
}

// Eliminar imagen
async function handleDeleteImage(e) {
  const id = e.target.closest("button").getAttribute("data-id");
  if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api_v1/Img/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("No se pudo eliminar la imagen");
    alert("Imagen eliminada correctamente.");
    fetchImages();
  } catch (error) {
    alert("Error al eliminar: " + error.message);
  }
}

// Inicial
fetchImages();
