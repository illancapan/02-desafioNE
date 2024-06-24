const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = 5000;
const app = express();

app.use(express.json());

// ruta del archivo json para utilizar en el codigo
const repertorioPath = path.join(__dirname, "../data/repertorio.json");

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send("algo se ha roto 😒😒😒");
});

//RUTAS
//ruta html principal
app.get("/", (req, res) => {
  // res.send("Hola soy get");
  res.sendFile(path.join(__dirname, "../index.html"));
});

//ruta obtengo todas las canciones del json
app.get("/canciones", (req, res) => {
  try {
    const repertorio = JSON.parse(
      //   fs.readFileSync(path.join(__dirname, "/../data/repertorio.json"), "utf-8")
      fs.readFileSync(repertorioPath, "utf-8")
    );
    res.status(200).json(repertorio);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el repertorio" }); // Error 500)
  }
});

//POST -CREAR

//ruta creo una nueva cancion, agrego al repertorio
app.post("/canciones", (req, res) => {
  //   res.send("Hola soy post");
  try {
    repertorios = req.body; // id,cancion,artista,tono
    // const repertorio = JSON.parse(
    //   fs.readFileSync(path.join(__dirname, "/../data/repertorio.json"), "utf-8")
    // );
    const repertorio = JSON.parse(fs.readFileSync(repertorioPath, "utf-8"));

    const nuevaCancion = {
      id: repertorio.length + 1, //genero id automatico
      titulo: req.body.titulo,
      artista: req.body.artista,
      tono: req.body.tono,
    };

    repertorio.push(nuevaCancion);
    // console.log(repertorio,"repertorios creados informacion")
    fs.writeFileSync(repertorioPath, JSON.stringify(repertorio, null, 2));

    res.status(201).send("Cancion agregada al repertorio con exito");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el repertorio auuuch " + error }); // Error 500))
  }
});

// codigo 404

// PUT
// ruta acutalizo cancion en el repertorio por su id
app.put("/canciones/:id", (req, res) => {
  const id = req.params.id;
  try {
    const repertorio = JSON.parse(fs.readFileSync(repertorioPath, "utf-8"));

    const index = repertorio.findIndex(
      (cancion) => cancion.id === parseInt(id)
    );
    if (index === -1) {
      return res.status(404).json({ error: "Cancion no encontrada" });
    }
    repertorio[index] = {
      id: parseInt(id),
      titulo: req.body.titulo,
      artista: req.body.artista,
      tono: req.body.tono,
    };
    fs.writeFileSync(repertorioPath, JSON.stringify(repertorio, null, 2));
    res.status(200).send("Cancion actualizada con exito");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la cancion " + error }); // Error 500)
  }
});

// DELETE
// elimino la cancion del repertorio por el id
app.delete("/canciones/:id", (req, res) => {
  //   res.send("Hola soy delete");
  const id = req.params.id;
  try {
    const repertorio = JSON.parse(fs.readFileSync(repertorioPath, "utf-8"));
    const id = parseInt(req.params.id);
    const index = repertorio.findIndex((cancion) => cancion &&  cancion.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Cancion no encontrada" });
    }
    repertorio.splice(index, 1);

    fs.writeFileSync(repertorioPath, JSON.stringify(repertorio, null, 2));

    res.status(200).send("Cancion eliminada con exito");
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la cancion " + error }); // Error 500))
  }
});

// ruta 404 manejo cualquier error de solicitud no definida
app.all("*", (req, res) => {
  res.status(404).send("Pagina no encontrada😒😒😒");
});


// iniicio el servidor
app.listen(PORT, () => {
  console.log(`🔥🔥Servidor corriendo en el puerto ${PORT}`);
});
