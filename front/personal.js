const API_URL = "http://localhost:3000/api/personal"; // ajusta si cambia tu ruta

let personal = [];

//karga chanbelanes al inisiar
document.addEventListener("DOMContentLoaded", async () => {
    await cargarPersonal();
});

//obtiene personal del bakend
async function cargarPersonal() {
    try {
        const res = await fetch(API_URL);
        personal = await res.json();

        renderTabla(personal);
    } catch (error) {
        console.error("Error al cargar al personal:", error);
    }
}

//ase magia a la tabla
function renderTabla(personal) {
    const tbody = document.getElementById("cuerpoTabla");
    tbody.innerHTML = "";

    personal.forEach(per => {

        const tr = document.createElement("tr");
        //personal k eliminamos y no del sistema
        if (!per.activo) {
            tr.style.opacity = "0.5";
        }
        tr.innerHTML = `
            <td>${per.rfc}</td>
            <td>${per.user}</td>
            <td>${per.psw}</td>
            <td>${per.nom}</td>
            <td>${per.apPat}</td>
            <td>${per.apMat}</td>
            <td>${per.tel}</td>
            <td>${per.email}</td>
            <td>${per.salario}</td>
            <td>${per.activo ? "Activo" : "Inactivo"}</td>
            <td>${per.turno}</td>
            <td>${per.nomRol}</td>
            <td>
                <button style="background:#3b82f6;" onclick="editarPersonal(${per.idUser})">Editar</button>
                ${
                    per.activo
                    ? `<button style="background:#ef4444;" onclick="eliminar(${per.idUser})">Desactivar</button>`
                    : `<button style="background:#22c55e;" onclick="activar(${per.idUser})">Activar</button>`
                }
            </td>
        `;

        tbody.appendChild(tr);
    });
}

//aka buskamos a los chanbelanes
function buscarPersonal() {
    const texto = document.getElementById("buscar").value.toLowerCase();

    const filtrados = personal.filter(per =>
        per.rfc.toLowerCase().includes(texto) ||
        per.nom.toLowerCase().includes(texto) ||
        per.apPat.toLowerCase().includes(texto) ||
        per.apMat.toLowerCase().includes(texto) 
    );

    renderTabla(filtrados);
}

//editamos a los chanbelanes
function editarPersonal(id) {
    window.location.href = `modPersonal.html?id=${id}`;
}


async function eliminar(id) {
    const confirmar = confirm("¿Seguro que quieres dar de baja a este elemento?");
    if (!confirmar) return;
    await fetch(`http://localhost:3000/api/personal/${id}`, {
        method: "DELETE"
    });
    alert("Personal dado de baja");
    cargarPersonal();
}

async function activar(id) {
    const confirmar = confirm("¿Seguro que quieres restaurar este elemento?");
    if (!confirmar) return;
    await fetch(`http://localhost:3000/api/personal/activar/${id}`, {
        method: "PUT"
    });
    alert("Personal restaurado");
    cargarPersonal();
}