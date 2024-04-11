const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  //hacer un fetch
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status === 200) {
      window.location.replace("/products");
    }else {
        document.getElementById("errorMessage").innerText = "Error en las credenciales. Inténtalo de nuevo.";
        document.getElementById("errorMessage").style.display = "block";
      }
  });
});