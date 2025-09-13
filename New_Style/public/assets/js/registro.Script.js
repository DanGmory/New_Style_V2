document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = {
      User_name: document.getElementById('userName').value,
      User_mail: document.getElementById('userEmail').value,
      User_password: document.getElementById('userPassword').value
    };

    try {
      const response = await fetch('http://localhost:3000/api_v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }

      const result = await response.json();
      alert('Usuario registrado con ID: ' + result.data.id);
    } catch (error) {
      alert(error.message);
    }
  });
});
