document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/api_v1/Profile";
  const IMAGE_API_URL = "http://localhost:3000/api_v1/img";
  const TYPE_DOC_API_URL = "http://localhost:3000/api_v1/typeDocument";
  const USERS_API_URL = "http://localhost:3000/api_v1/users";

  const email = localStorage.getItem("currentUserEmail");
  const username = localStorage.getItem("currentUserName");

  // Elementos
  const createForm = document.getElementById("createProfileForm");
  const profileForm = document.getElementById("profileForm");
  const profileData = document.getElementById("profileData");

  const profileImage = document.getElementById("profileImage");
  const imageName = document.getElementById("imageName");

  const DataProfileName = document.getElementById("DataProfileName");
  const DataProfileLastName = document.getElementById("DataProfileLastName");
  const DataProfilePhone = document.getElementById("DataProfilePhone");
  const DataProfileNumberDocument = document.getElementById("DataProfileNumberDocument");
  const DataProfileDocumentType = document.getElementById("DataProfileDocumentType");
  const DataProfileMail = document.getElementById("DataProfileMail");
  const DataProfileUserName = document.getElementById("DataProfileUserName");

  const ProfileMail = document.getElementById("ProfileMail");
  const ProfileName = document.getElementById("ProfileName");
  const ProfileLastName = document.getElementById("ProfileLastName");
  const ProfilePhone = document.getElementById("ProfilePhone");
  const ProfileNumberDocument = document.getElementById("ProfileNumberDocument");
  const ProfileDocumentType = document.getElementById("ProfileDocumentType");

  const editImageBtn = document.getElementById("editImageBtn");
  const changeImageModal = new bootstrap.Modal(document.getElementById("changeImageModal"));
  const newImageSelect = document.getElementById("newImageSelect");
  const changeImageForm = document.getElementById("changeImageForm");

  let currentProfile = null;
  let selectedImageId = 1; // Imagen por defecto

  async function loadDocumentTypes() {
    const res = await fetch(TYPE_DOC_API_URL);
    const types = await res.json();
    ProfileDocumentType.innerHTML = `<option value="" disabled selected>Seleccione un tipo</option>`;
    types.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.Type_document_id;
      opt.textContent = t.Type_document_name;
      ProfileDocumentType.appendChild(opt);
    });
  }

  async function loadImagesSelect() {
    const res = await fetch(IMAGE_API_URL);
    const images = await res.json();
    newImageSelect.innerHTML = `<option value="" disabled selected>Selecciona una imagen</option>`;
    images.forEach(img => {
      const opt = document.createElement("option");
      opt.value = img.Image_id;
      opt.textContent = img.Image_name;
      newImageSelect.appendChild(opt);
    });
  }

  async function getUser() {
    const res = await fetch(USERS_API_URL);
    const users = await res.json();
    return users.find(u => u.User_mail === email);
  }

  async function loadProfile() {
    const res = await fetch(API_URL);
    const profiles = await res.json();
    const profile = profiles.find(p => p.User_mail === email);

    if (!profile) {
      createForm.classList.remove("d-none");
      ProfileMail.value = email;
      return;
    }

    currentProfile = profile;
    profileData.classList.remove("d-none");

    profileImage.innerHTML = profile.Image_url
      ? `<img src="${profile.Image_url}" class="profile-img">`
      : `<img src="../../assets/imgs/default-profile.jpg" class="profile-img">`;
    imageName.textContent = profile.Image_name || "Sin imagen";

    DataProfileName.textContent = profile.Profile_name;
    DataProfileLastName.textContent = profile.Profile_lastname;
    DataProfilePhone.textContent = profile.Profile_phone || "—";
    DataProfileNumberDocument.textContent = profile.Profile_number_document;
    DataProfileDocumentType.textContent = profile.Type_document_name;
    DataProfileMail.textContent = profile.User_mail;
    DataProfileUserName.textContent = profile.User_name;
  }

  profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = ProfileName.value;
  const lastname = ProfileLastName.value;
  const phone = ProfilePhone.value;
  const docNumber = ProfileNumberDocument.value;
  const docType = ProfileDocumentType.value;

  if (!name || !lastname || !docNumber || !docType) {
    alert("Completa todos los campos requeridos.");
    return;
  }

  const user = await getUser();
  if (!user) {
    alert("No se encontró el usuario.");
    return;
  }

  const body = {
    Profile_name: name,
    Profile_lastname: lastname,
    Profile_phone: phone ? parseInt(phone) : null,
    Profile_number_document: docNumber,
    Type_document_fk: parseInt(docType),
    Image_fk: parseInt(selectedImageId),
    User_fk: user.User_id
  };

  console.log("=== DATOS QUE SE ENVIAN AL BACKEND ===");
  console.log(body);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const responseJson = await res.json();

    if (!res.ok) {
      console.error("Error backend:", responseJson);
      throw new Error(responseJson.error || "Error al crear el perfil.");
    }

    alert("Perfil creado correctamente.");
    window.location.reload();
  } catch (err) {
    console.error("Error:", err);
    alert("Error al crear el perfil: " + err.message);
  }
});


  changeImageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const imgId = newImageSelect.value;
    if (!imgId) {
      alert("Selecciona una imagen.");
      return;
    }

    if (!currentProfile) {
      selectedImageId = parseInt(imgId);
      imageName.textContent = newImageSelect.options[newImageSelect.selectedIndex].text;
      changeImageModal.hide();
      return;
    }

    const res = await fetch(`${API_URL}/${currentProfile.Profile_id}/image`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Image_fk: parseInt(imgId) })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "No se pudo actualizar la imagen.");
    }

    alert("Imagen actualizada.");
    window.location.reload();
  });

  editImageBtn.addEventListener("click", async () => {
    await loadImagesSelect();
    changeImageModal.show();
  });

  if (email && username) {
    loadDocumentTypes();
    loadProfile();
  } else {
    alert("Usuario no logueado.");
  }
});
