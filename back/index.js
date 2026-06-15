//librerias
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

//inisia serbidor chido
app.listen(3000, () => console.log("El serbidor ta bibo en http://localhost:3000"));
app.use(express.static("public"));

//kueris de la base
import { inLog } from "./consultas.js";
import { obtenerProductos } from "./consultas.js";
import { obtenerProductosVenta } from "./consultas.js";
import { obtenerProductosFull } from "./consultas.js";
import { guardarVenta } from "./consultas.js";
import { eliminarProducto } from "./consultas.js";
import { activarProducto } from "./consultas.js";
import { obtenerReportes } from "./consultas.js";
import { obtenerProv } from "./consultas.js";
import { obtenerPersonal } from "./consultas.js";
import { eliminarPersonal } from "./consultas.js";
import { activarPersonal } from "./consultas.js";
import { buscaCB } from "./consultas.js";
import { regProd } from "./consultas.js";
import { buscaRFC } from "./consultas.js";
import { buscaUser } from "./consultas.js";
import { regUser } from "./consultas.js";
import { regProv } from "./consultas.js";
import { getProd } from "./consultas.js";
import { actuProd } from "./consultas.js";
import { getUser } from "./consultas.js";
import { actuUser } from "./consultas.js";
import { getProv } from "./consultas.js";
import { actuProv } from "./consultas.js";
import { dashboard } from "./consultas.js";

//api login
app.post("/api/login", async (req, res) => {
  const { usr, psw } = req.body;
  try {
    const resultado = await inLog(usr, psw);
    if (resultado.length === 0) {
      res.json({
        encontrado: false,
        mensaje: "No se encontró al usuario o contraseña que ingresó",
        datos: ""
      });
    } else {
      res.json({
        encontrado: true,
        mensaje: "Login exitoso",
        datos: resultado[0]
      });
    }
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    res.status(500).json({ error: "Error al buscar el usuario en la base de datos" });
  }
});

//api buska productos
app.get("/api/productos", async (req, res) => {
    const data = await obtenerProductos();
    res.json(data);
});

//api bende
app.post("/api/ventas", async (req, res) => {
    const { carrito, total, idVendedor } = req.body;

    try {
        await guardarVenta(carrito, total, idVendedor);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

app.get("/api/productosVenta", async (req, res) => {
    const data = await obtenerProductosVenta();
    res.json(data);
});

app.get("/api/productosFull", async (req, res) => {
    const data = await obtenerProductosFull();
    res.json(data);
});

app.delete("/api/productos/:id", async (req, res) => {
    try {
        await eliminarProducto(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.put("/api/productos/activar/:id", async (req, res) => {
    try {
        await activarProducto(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get('/api/reportes', async (req, res) => {
    const data = await obtenerReportes();
    res.json(data);
});

app.get("/api/proveedores", async (req, res) => {
    const data = await obtenerProv();
    res.json(data);
});

app.get('/api/personal', async (req, res) => {
    try {
        const data = await obtenerPersonal();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message }); // 🔥 importante
    }
});

app.delete("/api/personal/:id", async (req, res) => {
    try {
        await eliminarPersonal(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.put("/api/personal/activar/:id", async (req, res) => {
    try {
        await activarPersonal(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

//api codigo de barras
app.post("/api/buscarCB", async (req, res) => {
  const { codBar } = req.body;
  try {
    const resultado = await buscaCB(codBar);
    if (resultado.length>0) {
      res.json({
        encontrado: true,
        mensaje: `Ya existe un producto con ese codigo de barras en el sistema`,
        datos: resultado[0],
      });
    } else {
      res.json({
        encontrado: false,
      });
    }
  } catch (error) {
    console.error("Error al buscar el codigo de barras:", error);
    res.status(500).json({ error: "Error al buscar el codigo de barras en la base de datos" });
  }
});

app.post("/api/regProd", async (req, res) => {
  try {
    const resultado = await regProd(req.body);

    res.json({
      mensaje: "Producto registrado correctamente",
      id: resultado.insertId
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al registrar producto"
    });
  }
});

//api rfc
app.post("/api/buscarRFC", async (req, res) => {
  const { rfc } = req.body;
  try {
    const resultado = await buscaRFC(rfc);
    if (resultado.length>0) {
      res.json({
        encontrado: true,
        mensaje: `Ya existe un usuario con ese rfc en el sistema`,
        datos: resultado[0],
      });
    } else {
      res.json({
        encontrado: false,
      });
    }
  } catch (error) {
    console.error("Error al buscar el rfc:", error);
    res.status(500).json({ error: "Error al buscar el rfc en la base de datos" });
  }
});

//api codigo de barras
app.post("/api/buscarUser", async (req, res) => {
  const { user } = req.body;
  try {
    const resultado = await buscaUser(user);
    if (resultado.length>0) {
      res.json({
        encontrado: true,
        mensaje: `Ya existe un usuario con ese nombre en el sistema`,
        datos: resultado[0],
      });
    } else {
      res.json({
        encontrado: false,
      });
    }
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    res.status(500).json({ error: "Error al buscar el usuario en la base de datos" });
  }
});

app.post("/api/regUser", async (req, res) => {
  try {
    const resultado = await regUser(req.body);

    res.json({
      mensaje: "Personal registrado correctamente",
      id: resultado.insertId
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al registrar al personal"
    });
  }
});

app.post("/api/regProv", async (req, res) => {
  try {
    const resultado = await regProv(req.body);

    res.json({
      mensaje: "Proveedor registrado correctamente",
      id: resultado.insertId
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al registrar al proveedor"
    });
  }
});

app.get("/api/getProd/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await getProd(id);

    if (resultado.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json(resultado[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener producto"
    });
  }
});

app.put("/api/actuProd/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await actuProd(id, req.body);

    res.json({
      mensaje: "Producto actualizado correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al actualizar producto"
    });
  }
});

app.get("/api/getUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await getUser(id);

    if (resultado.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    res.json(resultado[0]);

  } catch (error) {
    res.status(500).json({
      error: "Error al obtener usuario"
    });
  }
});

app.put("/api/actuUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await actuUser(id, req.body);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: "No se actualizó nada"
      });
    }

    res.json({
      mensaje: "Usuario actualizado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar usuario"
    });
  }
});

app.get("/api/getProv/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await getProv(id);

    if (resultado.length === 0) {
      return res.status(404).json({
        error: "Proveedor no encontrado"
      });
    }

    res.json(resultado[0]);

  } catch (error) {
    res.status(500).json({
      error: "Error al obtener proveedor"
    });
  }
});

app.put("/api/actuProv/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await actuProv(id, req.body);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: "No se actualizó nada"
      });
    }

    res.json({
      mensaje: "Proveedor actualizado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar proveedor"
    });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const datos = await dashboard();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: "Error en dashboard" });
  }
});