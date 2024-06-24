import express from 'express';
import cors from 'cors';
import routes from './routes';

// App
const app = express();
const host = process.env.HOST ?? 'localhost';
const port = 8080;

app.use(cors());
app.use(express.json());
app.use('/v1', routes);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
