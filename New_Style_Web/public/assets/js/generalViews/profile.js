document.addEventListener('DOMContentLoaded', () => {
	// Elementos
	const profileImageContainer = document.getElementById('profileImage');
	const imageNameEl = document.getElementById('imageName');
	const editImageBtn = document.getElementById('editImageBtn');

	const createProfileCard = document.getElementById('createProfileForm');
		const profileForm = document.getElementById('profileForm');
	const inputName = document.getElementById('ProfileName');
	const inputLastName = document.getElementById('ProfileLastName');
	const inputPhone = document.getElementById('ProfilePhone');
	const inputNumberDoc = document.getElementById('ProfileNumberDocument');
	const selectDocType = document.getElementById('ProfileDocumentType');
	const inputMail = document.getElementById('ProfileMail');
		const inputImageFile = document.getElementById('ProfileImageFile');

	const profileDataCard = document.getElementById('profileData');
	const dataName = document.getElementById('DataProfileName');
	const dataLastName = document.getElementById('DataProfileLastName');
	const dataPhone = document.getElementById('DataProfilePhone');
	const dataNumberDoc = document.getElementById('DataProfileNumberDocument');
	const dataDocType = document.getElementById('DataProfileDocumentType');
	const dataMail = document.getElementById('DataProfileMail');
	const dataUserName = document.getElementById('DataProfileUserName');
	const userCodesList = document.getElementById('UserCodesList');

	const changeImageModalEl = document.getElementById('changeImageModal');
		const changeImageForm = document.getElementById('changeImageForm');
		const newImageFile = document.getElementById('newImageFile');
	const changeImageModal = changeImageModalEl ? new bootstrap.Modal(changeImageModalEl) : null;

		let currentUserId = localStorage.getItem('currentUserId');
	const userMail = localStorage.getItem('currentUserEmail');
	const userName = localStorage.getItem('currentUserName');

		async function resolveUserId() {
			if (currentUserId && !Number.isNaN(Number(currentUserId))) return Number(currentUserId);
			if (!userMail) throw new Error('No hay correo de usuario en sesión');
			// Buscar el usuario por correo
			const res = await fetch(HOST + URL_USERS);
			if (!res.ok) throw new Error('No se pudieron cargar usuarios');
			const list = await res.json();
			const found = list.find(u => (u.User_mail || '').toLowerCase() === userMail.toLowerCase());
			if (!found) throw new Error('Usuario no encontrado por correo');
			currentUserId = String(found.User_id);
			localStorage.setItem('currentUserId', currentUserId);
			return Number(found.User_id);
		}

	// Helpers
	function renderImage(url, name) {
		if (url) {
			profileImageContainer.innerHTML = `<img class="profile-img" src="${url}" alt="${name || 'Imagen'}"/>`;
			imageNameEl.textContent = name || '';
		} else {
			profileImageContainer.innerHTML = `<img class="profile-img" src="/assets/imgs/default.png" alt="Sin imagen"/>`;
			imageNameEl.textContent = 'Sin imagen';
		}
	}

	async function loadTypeDocuments() {
		try {
			const res = await fetch(HOST + URL_TYPE_DOCUMENT);
			if (!res.ok) throw new Error('No se pudieron cargar tipos de documento');
			const list = await res.json();
			selectDocType.innerHTML = '<option value="" disabled selected>Seleccione un tipo</option>';
			list.forEach(t => {
				const opt = document.createElement('option');
				opt.value = t.Type_document_id;
				opt.textContent = t.Type_document_name;
				selectDocType.appendChild(opt);
			});
		} catch (e) {
			console.error(e);
		}
	}

		async function uploadImage(file, customName) {
			const form = new FormData();
			form.append('file', file);
			if (customName) form.append('name', customName);
			const res = await fetch(HOST + URL_IMAGE, { method: 'POST', body: form });
			if (!res.ok) throw new Error('Error subiendo imagen');
			const data = await res.json();
			return data.file; // { id, name, url }
		}

	function showCreateForm(prefillMail) {
		createProfileCard.classList.remove('d-none');
		profileDataCard.classList.add('d-none');
		inputMail.value = prefillMail || '';
	}

	function showProfile(p) {
		createProfileCard.classList.add('d-none');
		profileDataCard.classList.remove('d-none');
		dataName.textContent = p.Profile_name || '';
		dataLastName.textContent = p.Profile_lastname || '';
		dataPhone.textContent = p.Profile_phone || '';
		dataNumberDoc.textContent = p.Profile_number_document || '';
		dataDocType.textContent = p.Type_document_name || '';
		dataMail.textContent = p.User_mail || '';
		dataUserName.textContent = userName || '';
		renderImage(p.Image_url, p.Image_name);
		// Cargar códigos del usuario
		loadUserCodes().catch(console.error);
	}

		async function findCurrentUserProfile() {
		// Sin endpoint específico, traemos todos y filtramos por User_fk o correo
		const res = await fetch(HOST + URL_PROFILE);
		if (!res.ok) throw new Error('No se pudieron cargar perfiles');
		const list = await res.json();
		// Intenta por ID de usuario, si está disponible
		let found = null;
			if (currentUserId) {
				found = list.find(p => String(p.User_fk) === String(currentUserId));
		}
		if (!found && userMail) {
			// Como el listado trae User_mail, filtra por correo si es necesario
			found = list.find(p => (p.User_mail || '').toLowerCase() === userMail.toLowerCase());
		}
		return found;
	}

	// Inicialización
			(async () => {
				try {
					// Intenta cargar tipos de documento, pero no bloquea el flujo si falla
					try { await loadTypeDocuments(); } catch (e) { console.error('Tipos de documento:', e); }

					let profile = null;
					try { profile = await findCurrentUserProfile(); } catch (e) { console.error('Cargando perfil:', e); }

					if (profile) {
						showProfile(profile);
					} else {
						showCreateForm(userMail);
					}
				} catch (e) {
					console.error(e);
					// Ante cualquier error inesperado, al menos mostrar el formulario
					showCreateForm(userMail);
				}
			})();

	async function loadUserCodes(){
		try {
			const res = await fetch(HOST + URL_CODIGE);
			if (!res.ok) return;
			const list = await res.json();
			// Filtra por email si está disponible
			let filtered = list;
			if (userMail) {
				filtered = filtered.filter(c => (c.user_mail || '').toLowerCase() === userMail.toLowerCase());
			} else if (currentUserId) {
				filtered = filtered.filter(c => String(c.user_id) === String(currentUserId));
			}
			userCodesList.innerHTML = '';
			if (!filtered.length) {
				// No mostrar mensaje cuando no hay códigos; simplemente dejar la lista vacía
				return;
			}
			filtered.forEach(c => {
				const li = document.createElement('li');
				li.className = 'list-group-item d-flex justify-content-between align-items-center';
				li.innerHTML = `<span>${c.codige_number} - ${c.product_name}</span>
					<button class="btn btn-sm btn-outline-primary" data-code="${c.codige_number}">Copiar</button>`;
				userCodesList.appendChild(li);
			});
			userCodesList.addEventListener('click', async (ev) => {
				const btn = ev.target.closest('button[data-code]');
				if (!btn) return;
				try { await navigator.clipboard.writeText(btn.getAttribute('data-code')); alert('Código copiado'); } catch {}
			});
		} catch (e) { console.error('Cargando códigos:', e); }
	}

	// Crear Perfil
	profileForm.addEventListener('submit', async (ev) => {
		ev.preventDefault();
		try {
					const uid = await resolveUserId();
							// Validar Tipo de documento
							const docTypeId = parseInt(selectDocType.value, 10);
							if (Number.isNaN(docTypeId) || docTypeId <= 0) {
								alert('Seleccione un tipo de documento válido.');
								return;
							}

							// Si el usuario seleccionó imagen, súbela primero
					let uploadedImageId = null;
					if (inputImageFile && inputImageFile.files && inputImageFile.files[0]) {
						const uploaded = await uploadImage(inputImageFile.files[0], `${userName || 'perfil'}-${Date.now()}`);
						uploadedImageId = uploaded.id;
					}

					const payload = {
				Profile_name: inputName.value.trim(),
				Profile_lastname: inputLastName.value.trim(),
				Profile_phone: inputPhone.value.trim(),
				Profile_number_document: inputNumberDoc.value.trim(),
								User_fk: Number(uid),
					image_fk: uploadedImageId ? Number(uploadedImageId) : null,
							Type_document_fk: docTypeId,
				Address_fk: null
			};
				console.debug('Crear perfil payload:', payload);
			const res = await fetch(HOST + URL_PROFILE, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
				if (!res.ok) {
					let errMsg = 'No se pudo crear el perfil';
					try {
						const data = await res.json();
						if (data) {
							if (res.status === 409 && data.error) {
								errMsg = data.error;
							} else if (data.error || data.message) {
								errMsg = data.error || data.message;
							}
							console.error('Error crear perfil (JSON):', data);
						}
					} catch (_) {
						const text = await res.text();
						console.error('Error crear perfil (TEXT):', text);
					}
					throw new Error(errMsg);
				}
			const created = await res.json();
			// Vuelve a cargar datos
			const profile = await findCurrentUserProfile();
			if (profile) showProfile(profile);
			} catch (e) {
				console.error('Error guardando perfil:', e);
				alert(`Error guardando perfil: ${e.message || e}`);
		}
	});

	// Cambiar Imagen (abrir modal)
		editImageBtn.addEventListener('click', async () => {
			try {
				changeImageModal && changeImageModal.show();
			} catch (e) {
				console.error(e);
			}
		});

	// Actualizar imagen seleccionada
		changeImageForm.addEventListener('submit', async (ev) => {
		ev.preventDefault();
		try {
				if (!newImageFile || !newImageFile.files || !newImageFile.files[0]) return;
				const uploaded = await uploadImage(newImageFile.files[0], `${userName || 'perfil'}-${Date.now()}`);
				const imageId = uploaded.id;
			// Buscar perfil actual nuevamente para obtener su ID
			const profile = await findCurrentUserProfile();
			if (!profile) {
				alert('No hay perfil para actualizar');
				return;
			}
					const payload = {
				Profile_name: profile.Profile_name,
				Profile_lastname: profile.Profile_lastname,
				Profile_phone: profile.Profile_phone,
				Profile_number_document: profile.Profile_number_document,
						User_fk: Number(profile.User_fk),
						image_fk: Number(imageId),
						Type_document_fk: Number(profile.Type_document_fk),
				Address_fk: profile.Address_fk || null
			};
					const res = await fetch(`${HOST + URL_PROFILE}/${profile.Profile_id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (!res.ok) throw new Error('No se pudo actualizar la imagen');
			changeImageModal && changeImageModal.hide();
			const updated = await findCurrentUserProfile();
			if (updated) showProfile(updated);
		} catch (e) {
			console.error(e);
			alert('Error actualizando imagen');
		}
	});
});

