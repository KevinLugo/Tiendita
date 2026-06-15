const params = new URLSearchParams(window.location.search);
const idProducto = params.get("id");

async function cargarProducto() {
  if (!idProducto) return;

  try {
    const res = await fetch(`http://localhost:3000/api/getProd/${idProducto}`);
    const data = await res.json();

    document.getElementById("cb").value = data.codBar;
    document.getElementById("nomProd").value = data.nomProd;
    document.getElementById("cad").value = data.fechaCad.split("T")[0];
    document.getElementById("cat").value = data.idCat;
    document.getElementById("prov").value = data.idProv;
    document.getElementById("pCompra").value = data.pCompra;
    document.getElementById("pVenta").value = data.pVenta;
    document.getElementById("sActual").value = data.sActual;
    document.getElementById("sMin").value = data.sMin;

  } catch (error) {
    console.error("Error cargando producto:", error);
  }
}

//valido caracteres  del nombre del producto
function validA(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //caracteres
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ@0-9\s]$/;

  //asscii
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres de los stocks y codigo de barras
function validB(e) {
  const letra = e.key;

  //puro numero
  const asies = /^[0-9]$/;
  if (!asies.test(letra)) {
    e.preventDefault();
  }
}

//valido caracteres de los presios
function validC(e) {
  const letra = e.key;

  //numero y punto nomas
  const asies = /^[0-9.]$/;

  //otro otro otro ascii
  if (!asies.test(letra)) {
    e.preventDefault();
  }
}

//se lo aplico validasiones a todos los testos
document.getElementById("cb").addEventListener("keypress", validB);
document.getElementById("nomProd").addEventListener("keypress", validA);
document.getElementById("pCompra").addEventListener("keypress", validC);
document.getElementById("pVenta").addEventListener("keypress", validC);
document.getElementById("sActual").addEventListener("keypress", validB);
document.getElementById("sMin").addEventListener("keypress", validB);

//magia
document.getElementById("boton1").addEventListener("click", async () => {
  let errorCB;
  let codBar=document.getElementById("cb").value;
  let nomProd=document.getElementById("nomProd").value;
  let fechaCad= document.getElementById("cad").value;
  let idCat=document.getElementById("cat").value;
  let idProv= document.getElementById("prov").value;
  let pCompra= document.getElementById("pCompra").value;
  let pVenta= document.getElementById("pVenta").value;
  let sActual= document.getElementById("sActual").value;
  let sMin= document.getElementById("sMin").value;
  const idUsuario = sessionStorage.getItem("idUsuario");

  if(!codBar || !nomProd || !fechaCad || !idCat || !idProv || !pCompra || !pVenta || !sActual || !sMin) {
    alert("Dejo un campo sin contestar");
  } else {
    try {
      const resCB = await fetch("http://localhost:3000/api/buscarCB", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codBar }),
      });
      const dataCB = await resCB.json();
      if (dataCB.encontrado && dataCB.datos.idProd!=idProducto) {
        alert(dataCB.mensaje);
        errorCB =true;
        return; //si ya existe nos fuimos
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      alert("Error al consultar el codigo de barras");
      return;
    }

    //comprubo k noexistan datos enel sistema
    if (errorCB == true) {
      alert("Ya existe un producto con este codigo de barras en el sistema");
    } else{
      //nota: D es por datos, p de productos
      //varuable para ingresar los datos en json a productos
      let datos = { codBar, nomProd, idCat, idProv, pCompra, pVenta, sActual, sMin, fechaCad };

      try {
        let url = idProducto
          ? `http://localhost:3000/api/actuProd/${idProducto}`
          : `http://localhost:3000/api/regProd`;

        let metodo = idProducto ? "PUT" : "POST";

        const res = await fetch(url, {
          method: metodo,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });

        const respuesta = await res.json();

        alert(idProducto ? "Producto actualizado" : "Producto registrado");

        window.location.href = "productos.html";

      } catch (error) {
        console.error(error);
        alert("Error al guardar");
      }
    }
  }   
});

//aqui pongo que la fecha maxima sea a partir de hoy
const hoy = new Date();
const fechaLocal = hoy.getFullYear() + '-' +
  String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
  String(hoy.getDate()).padStart(2, '0');

document.getElementById("cad").setAttribute("min", fechaLocal);

async function cargarProv() {
  try {
    const res = await fetch("http://localhost:3000/api/proveedores");
    const data = await res.json();

    const select = document.getElementById("prov");

    data.forEach(p => {
      const option = document.createElement("option");
      option.value = p.idProv;
      option.textContent = `${p.nomEmp} ${p.nomProv}`;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error cargando proveedores:", error);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await cargarProv();   //primero llena el selek
  await cargarProducto(); //luego selecciona el balor correcto
});