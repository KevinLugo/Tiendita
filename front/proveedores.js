const API_URL = "http://localhost:3000/api/proveedores"; // ajusta si cambia tu ruta

let proveedores = [];

//kargamos a los probedores
document.addEventListener("DOMContentLoaded", async () => {
    await cargarProv();
});

//sekuestramos a los probedores del baken
async function cargarProv() {
    try {
        const res = await fetch(API_URL);
        proveedores = await res.json();

        renderTabla(proveedores);
    } catch (error) {
        console.error("Error al cargar proveedores:", error);
    }
}

//asemos magia en la tabla
function renderTabla(proveedores) {
    const tbody = document.getElementById("cuerpoTabla");
    tbody.innerHTML = "";

    proveedores.forEach(prov => {
    const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${prov.nomEmp}</td>
            <td>${prov.nomProv}</td>
            <td>${prov.telProv}</td>
            <td>${prov.emailProv}</td>
            <td>
                <button style="background:#3b82f6;" onclick="editarProveedor(${prov.idProv})">Editar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

//aka puede buskar al probedor
function buscarProveedor() {
    const texto = document.getElementById("buscar").value.toLowerCase();

    const filtrados = proveedores.filter(prov =>
        prov.nomEmp.toLowerCase().includes(texto) ||
        prov.nomProv.toLowerCase().includes(texto)
    );

    renderTabla(filtrados);
}

//aka editamos al probedor
function editarProveedor(id) {
    window.location.href = `modProv.html?id=${id}`;
}
