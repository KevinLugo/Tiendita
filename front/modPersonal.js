const params = new URLSearchParams(window.location.search);
const idUser = params.get("id");

async function cargarPersonal() {
  if (!idUser) return;

  try {
    const res = await fetch(`http://localhost:3000/api/getUser/${idUser}`);
    const data = await res.json();

    document.getElementById("rfc").value = data.rfc;
    document.getElementById("user").value = data.user;
    document.getElementById("psw").value = data.psw;
    document.getElementById("nom").value = data.nom;
    document.getElementById("apPat").value = data.apPat;
    document.getElementById("apMat").value = data.apMat;
    document.getElementById("tel").value = data.tel;
    document.getElementById("email").value = data.email;
    document.getElementById("salario").value = data.salario;
    document.getElementById("turno").value = data.turno;
    document.getElementById("idRol").value = data.idRol;
  } catch (error) {
    console.error("Error cargando usuario:", error);
  }
}

//constante pal rfc
const rfcSi = [
  //numeros
  ...Array.from({ length: 10 }, (_, i) => 48 + i),
  //mayusculas
  ...Array.from({ length: 26 }, (_, i) => 65 + i),
  //minusculas
  ...Array.from({ length: 26 }, (_, i) => 97 + i),
  209,241
];

//funcion paral rfc
function valRfc(e) {
  const codigo = e.keyCode || e.which;

  //borrar, tab y flechas
  if ([8, 9, 37, 38, 39, 40].includes(codigo)) return;

  if (!rfcSi.includes(codigo)) {
    e.preventDefault();
  }
}

//valido caracteres  del usuario
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

//valido caracteres  del correo y contra
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

//valido caracteres  del nombre y apellidos
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
document.getElementById("rfc").addEventListener("keypress", valRfc);
document.getElementById("user").addEventListener("keypress", validA);
document.getElementById("psw").addEventListener("keypress", validB);
document.getElementById("nom").addEventListener("keypress", validC);
document.getElementById("apPat").addEventListener("keypress", validC);
document.getElementById("apMat").addEventListener("keypress", validC);
document.getElementById("tel").addEventListener("keypress", validD);
document.getElementById("email").addEventListener("keypress", validB);
document.getElementById("salario").addEventListener("keypress", validD);


//magia
document.getElementById("boton1").addEventListener("click", async () => {
  let errorRFC=false;
  let errorUser=false;
  const extructRfc = /^[A-ZÑ]{4}[0-9]{6}[A-Z0-9]{2,3}$/i;
  
  let rfc=document.getElementById("rfc").value;
  let user= document.getElementById("user").value;
  let psw= document.getElementById("psw").value;
  let nom=document.getElementById("nom").value;
  let apPat=document.getElementById("apPat").value;
  let apMat= document.getElementById("apMat").value;
  let tel= document.getElementById("tel").value;
  let email= document.getElementById("email").value;
  let salario= document.getElementById("salario").value;
  let turno= document.getElementById("turno").value;
  let idRol= document.getElementById("idRol").value;

  if(rfc == "" ||  nom == "" || user == "" || apPat == "" || apMat == "" || tel == "" || email == ""
    || turno == "" || idRol=="") {
    alert("Dejo un campo sin contestar");
  } else if (!extructRfc.test(rfc) || rfc.length < 12) {
    alert("El RFC que ingreso no cuenta con la estructura corercta de un RFC");
  }else if(tel.length<10){
    alert("El telefono que escribio tiene menos de 10 digitos");
  }else{
    //busco k noaya algien con ese rfc
    try {
      const resRfc = await fetch("http://localhost:3000/api/buscarRFC", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfc }),
      });
      const dataRfc = await resRfc.json();
      if (dataRfc.encontrado && dataRfc.datos.idUser!=idUser) {
        alert(dataRfc.mensaje);
        errorRFC = true;
        return; //si ya existe nos fuimos
      }
    } catch (err) {
      console.error("Error en la solicitud RFC:", err);
      alert("Error al consultar el RFC");
      return;
    }

    //busco k no aya nadie con ese nombre de usuario
    try {
      const resUser = await fetch("http://localhost:3000/api/buscarUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });
      const DNU = await resUser.json();
      if (DNU.encontrado && DNU.datos.idUser!=idUser) {
        alert(DNU.mensaje);
        errorUser = true;
        return; //si ya existe nos fuimos
      }
    } catch (err) {
      console.error("Error en buscar user:", err);
      alert("Error al consultar el user");
      return;
    }

    //comprubo k noexistan datos enel sistema
    if (errorRFC == true) {
      alert("Ya existe alguien con ese rfc en el sistema");
    } else if(errorUser==true){
      alert("Ya existe alguien con ese usuario en el sistema");
    } else{
      //nota: D es por datos, U de usuario
      //varuable para ingresar los datos en json a usuarios
      let DU={user,psw,nom,apPat,apMat,tel,email,rfc,salario,turno,idRol}
      //aca ingreso los datos del personal
      try {
        const res = await fetch(`http://localhost:3000/api/actuUser/${idUser}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DU)
        });

        const respuesta = await res.json();

        alert("Usuario actualizado");
        window.location.href = "personal.html";

      } catch (error) {
        console.error(error);
        alert("Error al actualizar");
      }
    }
  }   
});

window.addEventListener("DOMContentLoaded", cargarPersonal);