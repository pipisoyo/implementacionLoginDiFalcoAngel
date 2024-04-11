export function logout() {
    fetch('/api/sessions/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = "/login"; // Redirigir a la página de inicio de sesión
      } else {
        console.error('Error al cerrar sesión');
      }
    })
    .catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }
  