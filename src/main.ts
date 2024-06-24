import express from 'express';
import cors from 'cors';
import routes from './routes';
import { isDev } from './constants';

// App
const app = express();
const host = isDev ? 'localhost' : '0.0.0.0';
const port = isDev ? 8080 : 3000;

app.use(cors());
app.use(express.json());
app.use('/v1', routes);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
