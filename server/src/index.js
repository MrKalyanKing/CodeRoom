import express from 'express';
import cors from 'cors';
import connectDB from './Config/db.js';
import roomRoutes from './modules/Room/routes/room.routes.js';
import authRoutes from './modules/Auth/routes/auth.routes.js';

const app = express();
const port = process.env.PORT || 4600;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});
