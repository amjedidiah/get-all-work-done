import express from 'express';
import cors from 'cors';
import { getWorld } from '@get-all-work-done/shared/utils';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 8008;

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send({ message: `Hello ${getWorld()}` });
});

app.get('/list', (req, res) => {
  res.send({ message: 'list' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
