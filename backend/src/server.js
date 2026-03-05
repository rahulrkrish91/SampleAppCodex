import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running at http://localhost:${port}`);
});

process.on('unhandledRejection', (error) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled rejection:', error);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught exception:', error);
  process.exit(1);
});
