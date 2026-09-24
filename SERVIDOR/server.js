const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { MongoClient } = require('mongodb');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const cluster = process.env.MONGODB_CLUSTER;
const databaseName = 'sample_mflix';

function crearUriMongoDB(username, password) {
    if (!cluster || !username || !password) {
        throw new Error('Faltan variables de entorno de MongoDB');
    }

    const normalizedCluster = cluster
        .replace(/^mongodb\+srv:\/\//, '')
        .replace(/\/$/, '');

    return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${normalizedCluster}/${databaseName}?authSource=admin&retryWrites=true&w=majority`;
}

async function conectarMongoDB() {
    const client = new MongoClient(crearUriMongoDB(
        process.env.MONGODB_USERNAME,
        process.env.MONGODB_PASSWORD
    ));

    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        return { client, db: client.db(databaseName) };
    } catch (error) {
        console.error("Error en la conexión a MongoDB:", error);
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
        const loginClient = new MongoClient(crearUriMongoDB(username, password));
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
    .catch(() => {
        process.exit(1);
    });