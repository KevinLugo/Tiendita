document.getElementById("boton1").addEventListener("click", async () => {
  const usr = document.getElementById("usuario").value;
  const psw = document.getElementById("password").value;
  if (usr == "" || psw == "") {
    alert("Ingrese usuario y contraseña");
  } else {
    //aki ago consulta y si existe chido
    try {
      const tipoUsr = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usr, psw }), //variables que le envio a la funcion
      });
      const dataUsr = await tipoUsr.json();
      if (dataUsr.encontrado == false) {
        alert(dataUsr.mensaje);
        return;
      } else {
        const idUsuario = dataUsr.datos.idUser;
        tipoUs=dataUsr.datos.nomRol;
        idRol=dataUsr.datos.idRol;
        sessionStorage.setItem("idUsuario", idUsuario);
        sessionStorage.setItem("idRol", idRol);
        if (dataUsr.datos.activo==false) {
            alert("Ya lo dimos de baja don");
            } else if (tipoUs== "Administrador") {
            alert("Bienvendo dueño!");
            window.location.href = "inicio.html";
            } else if(tipoUs=="Vendedor"){
            alert("Bienvenido vendedor!");
            window.location.href = "inicio.html";
            }else{
            alert("Y ute kiene¿");
        }
      }
    } catch (err) {
      console.error("Error en la solicitud del usuario:", err);
      alert("Error al consultar el usuario.");
      return;
    }
  }
});