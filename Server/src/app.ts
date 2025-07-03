import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/config';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler - Fixed the route pattern
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


const PORT = config.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;