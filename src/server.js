import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // ✅ import CORS

import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));

// ✅ Allow frontend to talk to backend
// app.use(cors({
//   origin: 'http://localhost:3000', // your frontend origin
//   credentials: true
// }));

app.use(cors({
  origin: 'https://www.bharatpilots.com/', // your frontend origin
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);

const PORT = process.env.PORT || 5000; // set this to 5000 if you want
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
