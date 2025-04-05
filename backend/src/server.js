import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.js';
import miningPlanRoutes from './routes/miningPlan.js';
import legalAdviceRoutes from './routes/legalAdvice.js';
import ebookRoutes from './routes/ebook.js';
import subscriptionRoutes from './routes/subscription.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mining-plans', miningPlanRoutes);
app.use('/api/legal-advice', legalAdviceRoutes);
app.use('/api/ebooks', ebookRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// MongoDB Configuration
mongoose.set('strictQuery', true);

// Connect to MongoDB with enhanced options
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
})
.then(() => {
  console.log('Connected to MongoDB');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  console.log('Connection Status:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');

  // Monitor for disconnection events
  mongoose.connection.on('disconnected', () => {
    console.log('Lost MongoDB connection...');
  });

  // Monitor for reconnection events
  mongoose.connection.on('reconnected', () => {
    console.log('Reconnected to MongoDB...');
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  console.error('Connection string:', process.env.MONGODB_URI);
  process.exit(1); // Exit if unable to connect to database
  process.exit(1);
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Mining Consultancy API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});