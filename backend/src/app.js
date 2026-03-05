import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
