const API_URL = "http://localhost:3000/api/productosFull"; // ajusta si cambia tu ruta

let productos = [];

//asemos k kargen los productoz
document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();
});

//jalamos los productos del baken
async function cargarProductos() {
    try {
        const res = await fetch(API_URL);
        productos = await res.json();

        renderTabla(productos);
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

//asemos magia en la tabla
function renderTabla(productos) {
    const tbody = document.getElementById("cuerpoTabla");
    tbody.innerHTML = "";

    productos.forEach(prod => {

        const tr = document.createElement("tr");
        //si ai bajo stok esta en amariyo
        if (prod.sActual <= prod.sMin) {
            tr.style.backgroundColor = "#fff3cd";
        }
        //si noai nada ta en rojo
        if (prod.sActual == 0) {
            tr.style.backgroundColor = "#f8d7da";
        }

        //si lo dimos d baja aparese en gris
        if (!prod.estatus) {
            tr.style.opacity = "0.5";
        }

        tr.innerHTML = `
            <td>${prod.codBar}</td>
            <td>${prod.nomProd}</td>
            <td>${prod.nomCat}</td>
            <td>${prod.nomEmp}</td>
            <td>${prod.nomProv}</td>
            <td>${prod.pCompra}</td>
            <td>${prod.pVenta}</td>
            <td>${prod.sActual}</td>
            <td>${prod.sMin}</td>
            <td>${formatearFecha(prod.fechaCad)}</td>
            <td>${prod.estatus ? "Activo" : "Inactivo"}</td>
            <td>${prod.creadoPor}</td>
            <td>
                <button style="background:#3b82f6;" onclick="editarProducto(${prod.idProd})">Editar</button>
                ${
                    prod.estatus
                    ? `<button style="background:#ef4444;" onclick="eliminar(${prod.idProd})">Desactivar</button>`
                    : `<button style="background:#22c55e;" onclick="activar(${prod.idProd})">Activar</button>`
                }
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function formatearFecha(fecha) {
    const f = new Date(fecha);
    return f.toLocaleDateString();
}

//aka funsion para buskar produkto
function buscarProducto() {
    const texto = document.getElementById("buscar").value.toLowerCase();

    const filtrados = productos.filter(prod =>
        prod.nomProd.toLowerCase().includes(texto) ||
        prod.nomCat.toLowerCase().includes(texto) ||
        prod.nomEmp.toLowerCase().includes(texto) ||
        prod.nomProv.toLowerCase().includes(texto) 
    );

    renderTabla(filtrados);
}

//aka editamos el produkto
function editarProducto(id) {
    window.location.href = `modProd.html?id=${id}`;
}


async function eliminar(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmar) return;
    await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: "DELETE"
    });
    alert("Producto eliminado");
    cargarProductos();
}

async function activar(id) {
    const confirmar = confirm("¿Seguro que quieres restaurar este producto?");
    if (!confirmar) return;
    await fetch(`http://localhost:3000/api/productos/activar/${id}`, {
        method: "PUT"
    });
    alert("Producto restaurado");
    cargarProductos();
}