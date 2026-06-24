function sesion() {
  const rol = sessionStorage.getItem("idRol");

  if (!rol) {
    alert("Inicie sesion");
    window.location.href = "login.html";

  }
}

let productos = [];
let carrito = [];

// kargamos los produktos
window.onload = async () => {
    await cargarProductos();

    document.getElementById("buscador")
        .addEventListener("input", filtrarProductos);
};

async function cargarProductos() {
    const res = await fetch("http://localhost:3000/api/productosVenta");
    productos = await res.json();

    renderProductos(productos);
}

//asemos magia a la tabla
function renderProductos(lista) {
    const tbody = document.getElementById("cuerpoProductos");
    tbody.innerHTML = "";

    lista.forEach(p => {
        const fila = `
        <tr style="${p.sActual === 0 
              ? 'background:#f8d7da;'   //rojo yabalio
              : p.sActual <= p.sMin 
                ? 'background:#fff3cd;' //amariyo yakasi bale
                : ''}">
                <td>${p.codBar}</td>
                <td>${p.nomProd}</td>
                <td>${p.nomCat}</td>
                <td>${p.nomEmp}</td>
                <td>$${p.pVenta}</td>
                <td>${p.sActual}</td>
                <td>${p.sMin}</td>
                <td>${p.fechaCad}</td>
                <td>${
                        p.sActual > 0
                        ? `<button onclick="agregarAlCarrito(${p.idProd})">Agregar</button>`
                        : `<button disabled>Sin stock</button>`
                    }
                </td>
                
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

//mientras eskribe okurre magia
function filtrarProductos() {
    const texto = document.getElementById("buscador").value.toLowerCase();

    const filtrados = productos.filter(p =>
        p.nomProd.toLowerCase().includes(texto) ||
        (p.codBar && p.codBar.toLowerCase().includes(texto))
    );

    renderProductos(filtrados);
}

//funsion para agregar al karrito
function agregarAlCarrito(idProd) {
    const producto = productos.find(p => p.idProd === idProd);

    if (!producto) {
        alert("Producto no encontrado");
        return;
    }

    //pedimos kantidad d merka
    let cantidad = prompt(`¿Cuántos "${producto.nomProd}" quieres agregar?`, "1");

    if (cantidad === null) return; //nokiso merka

    cantidad = parseInt(cantidad);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad inválida");
        return;
    }

    if (cantidad > producto.sActual) {
        alert(`Solo hay ${producto.sActual} en stock`);
        return;
    }

    const existente = carrito.find(p => p.idProd === idProd);

    if (existente) {
        if (existente.cantidad + cantidad > producto.sActual) {
            alert("No hay suficiente stock");
            return;
        }
        existente.cantidad += cantidad;
    } else {
        carrito.push({
            idProd: producto.idProd,
            nomProd: producto.nomProd,
            precio: producto.pVenta,
            cantidad: cantidad
        });
    }

    renderCarrito();
}

//magia ala tabla del karrito
function renderCarrito() {
    const tbody = document.getElementById("cuerpoCarrito");
    tbody.innerHTML = "";

    let total = 0;

    carrito.forEach((p, i) => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        const fila = `
            <tr>
                <td>${p.nomProd}</td>
                <td>$${p.precio}</td>
                <td>${p.cantidad}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button onclick="eliminar(${i})">❌</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });

    document.getElementById("totalVentaActual").innerText = total.toFixed(2);
}

function eliminar(i) {
    carrito.splice(i, 1);
    renderCarrito();
}

//bendimoz
async function finalizarVenta() {
    if (carrito.length === 0) {
        alert("Carrito vacío");
        return;
    }

    const idUsuario = sessionStorage.getItem("idUsuario");

    const res = await fetch("http://localhost:3000/api/ventas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            carrito,
            total: parseFloat(document.getElementById("totalVentaActual").innerText),
            idVendedor: idUsuario
        })
    });

    const data = await res.json();

    if (data.success) {
        alert("Venta guardada");

        carrito = [];
        renderCarrito();
        await cargarProductos(); //ase magia otrabes
    }
}

window.addEventListener("DOMContentLoaded", () => {
  sesion();
});