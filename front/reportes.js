function sesion() {
  const rol = sessionStorage.getItem("idRol");

  if (!rol) {
    alert("Inicie sesion");
    window.location.href = "login.html";

  }
}

let ventasGuardadas = [];
async function cargarVentas() {
    const res = await fetch('http://localhost:3000/api/reportes');
    ventasGuardadas = await res.json();

    filtrarReportes('hoy', document.querySelector('.btn-filtro'));
}
//funsion para obtener fecha
function obtenerFechaHace(dias) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - dias);
    return fecha.toISOString().split('T')[0];
}

function filtrarReportes(periodo, boton) {
    //asemos botones bonitos y funsionales
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('activo'));
    if(boton) boton.classList.add('activo');

    const hoy = new Date().toISOString().split('T')[0];
    let ventasFiltradas = [];

    if (periodo === 'hoy') {
        ventasFiltradas = ventasGuardadas.filter(v => v.fecha === hoy);
    } else if (periodo === 'semana') {
        const hace7Dias = obtenerFechaHace(7);
        ventasFiltradas = ventasGuardadas.filter(v => v.fecha >= hace7Dias);
    } else if (periodo === 'mes') {
        const mesActual = hoy.substring(0, 7); // Ej: "2023-10"
        ventasFiltradas = ventasGuardadas.filter(v => v.fecha.startsWith(mesActual));
    } else {
        ventasFiltradas = [...ventasGuardadas]; // Todo
    }

    renderizarTabla(ventasFiltradas);
}

function renderizarTabla(ventas) {
    const tbody = document.getElementById('cuerpoTablaReportes');
    tbody.innerHTML = '';
    
    let ingresosTotales = 0;

    if (ventas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding:20px; color:#666;">No hay ventas registradas en este período.</td></tr>';
    } else {
        //mostramos la bentana mas resiente primero
        const ventasInvertidas = [...ventas].reverse();
        
        ventasInvertidas.forEach(venta => {
            ingresosTotales += parseFloat(venta.total);
            
            let detallesHTML = '<ul style="margin:0; padding-left:20px; font-size:13px; text-align:left;">';
            venta.detalles.forEach(item => {
                detallesHTML += `<li>${item.cantidad} x ${item.nombre} ($${item.subtotal.toFixed(2)})</li>`;
            });
            detallesHTML += '</ul>';

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>#${venta.folio}</td>
                <td>${venta.fecha}</td>
                <td>${detallesHTML}</td>
                <td style="font-weight:bold; color:#2E7D32;">$${parseFloat(venta.total).toFixed(2)}</td>
                <td>${venta.nombreVend}</td>
            `;
            tbody.appendChild(fila);
        });
    }

    document.getElementById('totalTransacciones').textContent = ventas.length;
    document.getElementById('ingresosTotales').textContent = '$' + ingresosTotales.toFixed(2);
}

//por defekto karga el reporte de oi
document.addEventListener('DOMContentLoaded', cargarVentas);

window.addEventListener("DOMContentLoaded", () => {
  sesion();
});