function sesion() {
  const rol = sessionStorage.getItem("idRol");

  if (!rol) {
    alert("Inicie sesion");
    window.location.href = "login.html";

  }
}

//valido caracteres  del nombre de la empresa
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

//valido caracteres  del correo
function validB(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //otros caracteres
  const asies = /^[a-zA-ZñÑ@0-9]$/;

  //otros ascii
  const codSi = [43, 45, 46, 95];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres  del nombre
function validC(e) {
  const letra = e.key;
  const codigo = e.keyCode || e.which;

  //otros otros caracteres
  const asies = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]$/;

  //otros ascii
  const codSi = [130, 144, 160, 161, 162, 163, 164, 165, 181, 214, 224, 233];

  if (!asies.test(letra) && !codSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres namas telefono
function validD(e) {
  const letra = e.key;

  //puro numero
  const asies = /^[0-9]$/;
  if (!asies.test(letra)) {
    e.preventDefault();
  }
}

//se lo aplico validasiones a todos los testos
document.getElementById("nomEmp").addEventListener("keypress", validA);
document.getElementById("nomProv").addEventListener("keypress", validC);
document.getElementById("telProv").addEventListener("keypress", validD);
document.getElementById("emailProv").addEventListener("keypress", validB);


//magia
document.getElementById("boton1").addEventListener("click", async () => {
  let nomEmp=document.getElementById("nomEmp").value;
  let nomProv=document.getElementById("nomProv").value;
  let telProv= document.getElementById("telProv").value;
  let emailProv= document.getElementById("emailProv").value;

  if(nomEmp == "" ||  nomProv == "" || telProv == "" || emailProv == "") {
    alert("Dejo un campo sin contestar");
  } else if(telProv.length<10){
    alert("El telefono que escribio tiene menos de 10 digitos");
  }else{
      //nota: D es por datos, Pr de proveedor
      //varuable para ingresar los datos en json a probedor
      let DPr={nomEmp,nomProv,telProv,emailProv}
      //aca ingreso los datos del probedor
      try {
        const res = await fetch("http://localhost:3000/api/regProv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DPr),
        });
        const respuesta = await res.json();
      } catch (err) {
        alert("Error al registrar al proveedor");
        console.error(err);
      }
      alert("Datos guardados exitosamente");
      window.location.href = "inicio.html";
    
  }   
});

window.addEventListener("DOMContentLoaded", () => {
  sesion();
});