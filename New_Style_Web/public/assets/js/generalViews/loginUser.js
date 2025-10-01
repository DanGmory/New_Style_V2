import { HOST, URL_USERS } from '../system/system.js';

// Función para iniciar sesión
export const loginUser = async (userEmail, userPassword) => {
    try {
        console.log('Iniciando solicitud de inicio de sesión...');
        console.log('Datos enviados:', { userEmail, userPassword });

        const getData = {
            User_mail: userEmail,
            User_password: userPassword
        };

        const response = await fetch(`${HOST}${URL_USERS}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(getData)
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (!response.ok) {
            console.error('Error en la respuesta del servidor:', data);
            return {
                success: false,
                message: data.error || 'Error en la solicitud al servidor'
            };
        }

        if (data.error) {
            console.error('Error:', data.error);
            return { success: false, message: data.error };
        }

        console.log('Inicio de sesión exitoso:', data.user);

        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUserId', data.user.User_id);
        localStorage.setItem('currentUserRole', data.user.Role_name);
        localStorage.setItem('currentUserName', data.user.User_name);
        localStorage.setItem('currentUserEmail', data.user.User_mail);

        return { success: true, user: data.user, token: data.token };

    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { success: false, message: 'Error en la solicitud al servidor' };
    }
};

// Manejo del formulario de inicio de sesión
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessageElement = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita envío del formulario

        const userEmail = document.getElementById('email').value;
        const userPassword = document.getElementById('password').value;

        const result = await loginUser(userEmail, userPassword);

        if (result.success) {
            console.log('Usuario autenticado:', result.user);

            switch (result.user.Role_name) {
                case "Admin":
                    window.location.href = '/dashboard/dashboard';
                    break;
                case "Cliente":
                    window.location.href = '/generalViews/home';
                    break;
                default:
                    console.error('Rol desconocido:', result.user.Role_name);
                    errorMessageElement.style.display = 'block';
                    errorMessageElement.textContent = 'Rol de usuario desconocido';
            }
        } else {
            console.error('Error de autenticación:', result.message);
            errorMessageElement.style.display = 'block';
            errorMessageElement.textContent = result.message;
        }
    });
});
