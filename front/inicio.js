async function cargarDashboard() {
  try {
    const res = await fetch("http://localhost:3000/api/dashboard");
    const data = await res.json();

    //kards
    document.querySelectorAll(".card p")[0].textContent = data.productos;
    document.querySelectorAll(".card p")[1].textContent = data.ventas;
    document.querySelectorAll(".card p")[2].textContent = data.stock;
    document.querySelectorAll(".card p")[3].textContent = data.proveedores;

    //tablas
    const tbody = document.querySelector(".tabla tbody");
    tbody.innerHTML = "";

    data.tabla.forEach(prod => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${prod.nomProd}</td>
        <td>${prod.sActual}</td>
        <td>${prod.sMin}</td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error dashboard:", error);
  }
}

function aplicarPermisos() {
  const rol = sessionStorage.getItem("idRol");

  if (rol == "2") {
    //okultamos menu lateral
    ocultarMenu("productos.html");
    ocultarMenu("proveedores.html");
    ocultarMenu("personal.html");

    //okutlamos accesos rapidoz
    ocultarAcceso("productos.html");
    ocultarAcceso("proveedores.html");
  }
}

function ocultarMenu(href) {
  const links = document.querySelectorAll(".sidebar a");

  links.forEach(link => {
    if (link.getAttribute("href") === href) {
      link.parentElement.style.display = "none";
    }
  });
}

function ocultarAcceso(href) {
  const links = document.querySelectorAll(".accesos a");

  links.forEach(link => {
    if (link.getAttribute("href") === href) {
      link.style.display = "none";
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  cargarDashboard();
  aplicarPermisos();
});

