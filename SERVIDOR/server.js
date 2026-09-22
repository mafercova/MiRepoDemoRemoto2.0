const express = require('express');
const cors = require('cors');
const dns = require('dns');
const {MongoClient} = require('mongodb');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const uri = "mongodb+srv://mafer:mafer@cluster0.wcfnh6g.mongodb.net/sample_mflix?appName=Cluster0";

const client = new MongoClient(uri);

async function conectarMongoDB() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        return client.db("sample_mflix");
    } catch (error) {
        console.error("Error en la conexión a MongoDB:", error);
        throw error;
    }
}

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

let db;

app.get("/movies", async (req, res) => {
    try{
        const movies = await db.collection("movies").find(
            {},{projection: {poster: 1, title: 1, fullplot: 1}}
        ).limit(50).toArray();
        res.json(movies);
    }catch (error){
        res.status(500).json({error: "Error al obtener los datos de la colección"});
    }
});

conectarMongoDB()
    .then(database => {
        db = database;
        console.log("Base de datos lista");
        app.listen(port, () => {
            console.log("Servidor en http://localhost:4000");
        });
    })
    .catch(() => {
        process.exit(1);
    });