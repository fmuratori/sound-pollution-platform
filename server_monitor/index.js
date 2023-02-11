import express from 'express';
import http from 'http';

import setupSocket from "./socketio.js";
// import './mongo.js';

import {MongoClient} from 'mongodb';

const app = express();
const server = http.createServer();
const PORT = 3000;

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);// , { useNewUrlParser: true, useUnifiedTopology: true }
client.connect().then(() => {
  console.log('Connected to MongoDB');
  
  const db = client.db('sound_pollution');
  const collection = db.collection('meters');   

  setupSocket(server, collection);
});

// import bodyParser from "body-parser";
// app.use(bodyParser.json());
import cors from 'cors';
app.use(cors({
  origin: '*'
}))
// import router from './routes.js';
// app.use(router);

server.listen(PORT, () => {
  console.log(`Server is ready`);
});