import mysql from "mysql2/promise";

//koneksion dela base d datos
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "tiendita"
});

//funsion para el login
export async function inLog(usr, psw) {
  try {
    const [rows] = await db.execute(
      `SELECT roles.nomRol, usuarios.idUser, usuarios.activo, usuarios.idRol FROM usuarios INNER JOIN roles ON 
      usuarios.idRol = roles.idRol WHERE usuarios.user = ? AND BINARY usuarios.psw = ?`, [usr, psw]);
    return rows;
  } catch (error) {
    console.error("Error en buscar al usuario:", error);
    throw error;
  }
}

//funsion para obtener productos en la benta
export async function obtenerProductos() {
    const [rows] = await db.execute("SELECT idProd, nomProd, pVenta FROM productos");
    return rows;
}

//funsion para obtener produktos para la benta 2
export async function obtenerProductosVenta() {
    const [rows] = await db.execute(`
        SELECT p.idProd, p.codBar, p.nomProd, c.nomCat, pr.nomEmp, p.pVenta, p.sActual, p.sMin, p.fechaCad
        FROM productos p INNER JOIN categorias c ON p.idCat = c.idCat INNER JOIN proveedores pr ON p.idProv = pr.idProv
        WHERE p.estatus = true ORDER BY p.nomProd`);
    return rows;
}

//funsion para guardar benta
export async function guardarVenta(carrito, total, idVendedor) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [venta] = await conn.execute(
            "INSERT INTO ventas (total, idVendedor) VALUES (?, ?)",
            [total, idVendedor]
        );

        const idVenta = venta.insertId;

        for (let item of carrito) {
            await conn.execute(
                `INSERT INTO detalle_ventas (idVenta, idProd, cantidad, precio)
                 VALUES (?, ?, ?, ?)`,
                [idVenta, item.idProd, item.cantidad, item.precio]
            );

            //aka restamos el stok
            await conn.execute(
                `UPDATE productos SET sActual = sActual - ? WHERE idProd = ?`,
                [item.cantidad, item.idProd]
            );
        }

        await conn.commit();
        return true;

    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

//funsion para la pagina productos
export async function obtenerProductosFull() {
    const [rows] = await db.execute(`
        SELECT p.idProd, p.codBar, p.nomProd, c.nomCat, pr.nomEmp, pr.nomProv, p.pCompra, p.pVenta, p.sActual,
        p.sMin, p.fechaCad, p.estatus, u.user AS creadoPor FROM productos p INNER JOIN categorias c ON p.idCat = c.idCat
        INNER JOIN proveedores pr ON p.idProv = pr.idProv INNER JOIN usuarios u ON p.creado_por = u.idUser
        ORDER BY p.estatus DESC, c.nomCat, p.nomProd`);
    return rows;
}

//no elimina namas kambia estatus
export async function eliminarProducto(id) {
    await db.execute("UPDATE productos SET estatus = false WHERE idProd = ?",[id]);
}

//lo mismo d arriba
export async function activarProducto(id) {
    await db.execute("UPDATE productos SET estatus = true WHERE idProd = ?",[id]);
}

//funsion para la pagina de reportes
export async function obtenerReportes() {
    const [rows] = await db.query(`
        SELECT v.idVenta, v.idVendedor, v.fechaVenta, v.total, u.nom, u.apPat, u.apMat, d.cantidad, d.precio, p.nomProd FROM 
        ventas v JOIN detalle_ventas d ON v.idVenta = d.idVenta JOIN productos p ON d.idProd = p.idProd JOIN usuarios u ON 
        v.idVendedor=u.idUser ORDER BY v.idVenta DESC`);

    const ventas = {};

    rows.forEach(r => {
        if (!ventas[r.idVenta]) {
            ventas[r.idVenta] = {
                folio: r.idVenta,
                fecha: r.fechaVenta.toISOString().split('T')[0],
                total: r.total,
                nombreVend:r.nom+' '+r.apPat+' '+r.apMat,
                detalles: []
            };
        }

        ventas[r.idVenta].detalles.push({
            nombre: r.nomProd,
            cantidad: r.cantidad,
            subtotal: r.precio * r.cantidad
        });
    });

    return Object.values(ventas);
}

//funsion para obtener datos d probedores
export async function obtenerProv() {
    const [rows] = await db.execute(`SELECT * FROM proveedores`);
    return rows;
}

//funsion para la pagina de personal
export async function obtenerPersonal() {
    const [rows] = await db.execute(`SELECT u.idUser, u.rfc, u.user, u.psw, u.nom, u.apPat, u.apMat, u.tel, u.email,
        u.salario, u.activo, u.turno, r.nomRol FROM usuarios as u INNER JOIN roles as r ON u.idRol=r.idRol`);
    return rows;
}

//es beit no elimina
export async function eliminarPersonal(id) {
    await db.execute("UPDATE usuarios SET activo = false WHERE idUser = ?",[id]);
}

//igual k arriba
export async function activarPersonal(id) {
    await db.execute("UPDATE usuarios SET activo = true WHERE idUser = ?",[id]);
}

//funsion para que no se repitan los codigos d barras
export async function buscaCB(codBar) {
  try {
    const [rows] = await db.execute(`SELECT * FROM productos WHERE codBar = ?`, [codBar]);
    return rows;
  } catch (error) {
    console.error("Error en buscar el codigo de barras backend:", error);
    throw error;
  }
}

//funsion para registrar productos
export async function regProd(datos) {
  try {
    const { codBar, nomProd, idCat, idProv, pCompra, pVenta, sActual, sMin, idUsuario, fechaCad } = datos;

    const [result] = await db.execute(
      `INSERT INTO productos 
      (codBar, nomProd, idCat, idProv, pCompra, pVenta, sActual, sMin, creado_por, fechaCad)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [codBar, nomProd, idCat, idProv, pCompra, pVenta, sActual, sMin, idUsuario, fechaCad]
    );

    return result;
  } catch (error) {
    console.error("Error al registrar producto:", error);
    throw error;
  }
}

//funsion para evitar repetir rfc's
export async function buscaRFC(rfc) {
  try {
    const [rows] = await db.execute(`SELECT * FROM usuarios WHERE rfc = ?`, [rfc]);
    return rows;
  } catch (error) {
    console.error("Error en buscar el rfc backend:", error);
    throw error;
  }
}

//funsion para ebitar repetir nombres de usuarios
export async function buscaUser(user) {
  try {
    const [rows] = await db.execute(`SELECT * FROM usuarios WHERE user = ?`, [user]);
    return rows;
  } catch (error) {
    console.error("Error en buscar el user backend:", error);
    throw error;
  }
}

//funsion para registrar chanbelanes
export async function regUser(datos) {
  try {
    const {user,psw,nom,apPat,apMat,tel,email,rfc,salario,turno,idRol} = datos;

    const [result] = await db.execute(
      `INSERT INTO usuarios 
      (user,psw,nom,apPat,apMat,tel,email,rfc,salario,turno,idRol)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user,psw,nom,apPat,apMat,tel,email,rfc,salario,turno,idRol]
    );

    return result;
  } catch (error) {
    console.error("Error al registrar el personal:", error);
    throw error;
  }
}

//funsion para registrar probedores
export async function regProv(datos) {
  try {
    const {nomEmp,nomProv,telProv,emailProv} = datos;

    const [result] = await db.execute(
      `INSERT INTO proveedores 
      (nomEmp,nomProv,telProv,emailProv)
      VALUES (?, ?, ?, ?)`,
      [nomEmp,nomProv,telProv,emailProv]
    );

    return result;
  } catch (error) {
    console.error("Error al registrar al proveedor:", error);
    throw error;
  }
}

//funsion para buscar infp para editar produktos
export async function getProd(id) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM productos WHERE idProd = ?",
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
}

//funsion para actualisar productos
export async function actuProd(id, datos) {
  try {
    const { codBar, nomProd, idCat, idProv, pCompra, pVenta, sActual, sMin, fechaCad } = datos;

    const [result] = await db.execute(`UPDATE productos SET codBar = ?, nomProd = ?, idCat = ?, idProv = ?, 
        pCompra = ?, pVenta = ?, sActual = ?, sMin = ?, fechaCad = ? WHERE idProd = ?`,
      [codBar, nomProd, idCat, idProv, pCompra, pVenta, sActual, sMin, fechaCad, id]);
    return result;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
}

//funsion para buscar info del chanbelan para actualisarlo
export async function getUser(id) {
  try {
    const [rows] = await db.execute(
      `SELECT u.*FROM usuarios u WHERE u.idUser = ?`,
      [id]
    );

    return rows;
  } catch (error) {
    console.error("Error al obtener personal:", error);
    throw error;
  }
}

//funsion para actualisar al chanbelan
export async function actuUser(id, datos) {
  try {
    const {rfc, user, psw, nom, apPat, apMat, tel, email, salario, turno, idRol } = datos;

    const [result] = await db.execute(`UPDATE usuarios SET  rfc = ?, user = ?, psw = ?, nom = ?, apPat = ?,
        apMat = ?, tel = ?, email = ?, salario = ?, turno = ?, idRol = ? WHERE idUser = ?`,
      [rfc, user, psw, nom, apPat, apMat, tel, email, salario, turno, idRol, id]);

    return result;

  } catch (error) {
    console.error("Error al actualizar personal:", error);
    throw error;
  }
}

//funsion para obtener datos del probedor para modifikarlo
export async function getProv(id) {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM proveedores WHERE idProv = ?`,
      [id]
    );

    return rows;

  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    throw error;
  }
}

//funsion para actualisar al probedor
export async function actuProv(id, datos) {
  try {
    const { nomEmp, nomProv, telProv, emailProv } = datos;

    const [result] = await db.execute(`UPDATE proveedores SET nomEmp = ?, nomProv = ?, telProv = ?,
        emailProv = ? WHERE idProv = ?`,
      [nomEmp, nomProv, telProv, emailProv, id]);

    return result;

  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    throw error;
  }
}

//funsion para k jale la pagina del inisio
export async function dashboard() {
  try {

    //total produktos
    const [productos] = await db.execute(`SELECT COUNT(*) AS totalProductos FROM productos WHERE estatus = 1`);

    //bentas d oi
    const [ventas] = await db.execute(`SELECT COUNT(*) AS ventasHoy FROM ventas WHERE DATE(fechaVenta) = CURDATE()`);

    //stok bajo
    const [stock] = await db.execute(`SELECT COUNT(*) AS stockBajo FROM productos WHERE sActual <= sMin AND estatus = 1`);

    //probedores
    const [proveedores] = await db.execute(`SELECT COUNT(*) AS totalProveedores FROM proveedores`);

    //tabla kon produktos con bajo stok
    const [tabla] = await db.execute(`SELECT nomProd, sActual, sMin FROM productos WHERE sActual <= sMin AND estatus = 1`);

    return {
      productos: productos[0].totalProductos,
      ventas: ventas[0].ventasHoy,
      stock: stock[0].stockBajo,
      proveedores: proveedores[0].totalProveedores,
      tabla
    };

  } catch (error) {
    console.error("Error en dashboard:", error);
    throw error;
  }
}