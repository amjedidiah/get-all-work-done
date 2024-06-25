import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { isDev } from './constants';
import helmet from 'helmet';
import expressWinston from 'express-winston';
import { handleResponseError } from './utils';
import logger from './config/logger';
import webhookRoute from './routes/webhook.route';

const host = isDev ? 'localhost' : '0.0.0.0';
const port = isDev ? 8080 : 3000;

const app = express();

// Helmet to set secure HTTP headers
app.use(helmet());

app.use(cors()); // Cross Origin Site requests
app.use(express.urlencoded({ extended: true }));

// Webhook
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoute);

// Use Winston logger with Express Winston
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true, // Log metadata (e.g., request headers, response status)
    msg: 'HTTP {{req.method}} {{req.url}}', // Customize the log message format
  })
);

app.use(express.json()); // Configure to accept JSON request body
app.use(routes);

// Error handling middleware
app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  handleResponseError(res, error);
  next();
});

app.listen(port, host, () => logger.info(`[ ready ] http://${host}:${port}`));
