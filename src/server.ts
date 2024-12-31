import express from 'express';
import cors from 'cors';
import gunsRoutes from './routes/guns';
import helmetsRoutes from './routes/helmets';
import armorRoutes from './routes/armor';
import rigRoutes from './routes/rigs'
import backpackRoutes from './routes/backpacks';

const app = express();
const PORT = 3001;

app.use(cors());
app.use('/api', gunsRoutes);
app.use('/api', helmetsRoutes);
app.use('/api', armorRoutes);
app.use('/api', rigRoutes);
app.use('/api', backpackRoutes);

app.listen(PORT, () => {
  const now = new Date();
  console.log("");
  console.log("--------------------------------------");
  console.log("🚀 Backend Started");
  console.log(`📅 Date: ${now.toLocaleDateString()}`);
  console.log(`⏰ Time: ${now.toLocaleTimeString()}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log("--------------------------------------");
  console.log("");
});
