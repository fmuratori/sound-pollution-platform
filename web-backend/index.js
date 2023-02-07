import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from "body-parser";

import setupSocket from "./socketio.js";
import router from './routes.js';
import './mongo.js';


const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(router);
setupSocket(server);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});