const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { MongoClient } = require('mongodb');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const mongodbUri = process.env.MONGODB_URI;
const databaseName = 'sample_mflix';

function validarMongoUri() {
    if (!mongodbUri) {
        throw new Error('Falta la variable de entorno MONGODB_URI. Defínela antes de iniciar el servidor.');
    }
}

function crearUriMongoDBParaLogin(username, password) {
    if (!username || !password) {
        throw new Error('Usuario y contraseña son obligatorios');
    }

    validarMongoUri();
    const uri = new URL(mongodbUri);
    uri.username = username;
    uri.password = password;

    return uri.toString();
}

async function conectarMongoDB() {
    validarMongoUri();
    const client = new MongoClient(mongodbUri);

    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        return { client, db: client.db(databaseName) };
    } catch (error) {
        console.error("Error en la conexión a MongoDB:", error.message);
        await client.close();
        throw error;
    }
}

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

let db;

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let client;

    try {
        const loginClient = new MongoClient(crearUriMongoDBParaLogin(username, password));
        client = loginClient;
        await client.connect();
        await client.db(databaseName).command({ ping: 1 });

        res.status(200).json({
            authenticated: true,
            token: 'login-valido'
        });
    } catch (error) {
        console.error('Error en el login de MongoDB:', error.message);

        if (error.code === 18 || error.code === 8000 || error.codeName === 'AuthenticationFailed') {
            return res.status(401).json({
                message: 'Usuario o contraseña de MongoDB incorrectos'
            });
        }

        res.status(500).json({
            message: 'No se pudo conectar con MongoDB Atlas'
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

app.get("/movies", async (req, res) => {
    try{
        const movies = await db.collection("movies").find(
            {},{projection: {
                poster: 1,
                title: 1,
                fullplot: 1,
                year: 1,
                runtime: 1,
                rated: 1,
                genres: 1,
                directors: 1,
                cast: 1,
                countries: 1
            }}
        ).limit(50).toArray();
        res.json(movies);
    }catch (error){
        res.status(500).json({error: "Error al obtener los datos de la colección"});
    }
});

conectarMongoDB()
    .then(({ db: database }) => {
        db = database;
        console.log("Base de datos lista");
        app.listen(port, () => {
            console.log("Servidor en http://localhost:4000");
        });
    })
    .catch((error) => {
        console.error(error.message);
        process.exit(1);
    });