import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import User from './models/User';
import Event from './models/Event';
import Attendance from './models/Attendance';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import userRoutes from './routes/userRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';

app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);


// Basic route to test the server
app.get('/', (req, res) => {
  res.send('API Cr4Pro is running...');
});

const startServer = async () => {
  try {
    // Sync models with DB
    await sequelize.authenticate();
    console.log('Connection to DB has been established successfully.');
    
    // Basic route to test the server
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Backend is running' });
    });

    // Sync database and start server
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  
    // Seed first leader if no leaders exist
    const leaderCount = await User.count({ where: { role: 'Lideres' } });
    if (leaderCount === 0) {
      await User.create({
        fullName: 'Admin General',
        age: 30,
        motorcycleModel: 'Cr4',
        cylinderCapacity: 150,
        documentId: '0000000000',
        licensePlate: 'ADMIN1',
        role: 'Lideres',
        password: 'admin'
      });
      console.log('Seeded default leader (Placa: ADMIN1, Pass: admin)');
    }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
