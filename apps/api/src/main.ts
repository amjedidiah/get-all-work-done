import express from 'express';
import { getWorld } from '@get-all-work-done/shared/utils';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 8008;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: `Hello ${getWorld()}` });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
