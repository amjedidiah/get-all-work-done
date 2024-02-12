import express from 'express';
import cors from 'cors';
import routes from './v1/routes';

// Process Env
const { HOST, PORT } = process.env;
const host = HOST ?? 'localhost';
const port = PORT ? Number(PORT) : 8008;

// App
const app = express();

app.use(cors());
app.use(express.json());
app.use('/v1', routes);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
