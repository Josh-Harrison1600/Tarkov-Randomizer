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
  console.log("")
  console.log("🌐 URLs:")
  console.log(`🔗 http://localhost:${PORT}/api/guns`);
  console.log(`🔗 http://localhost:${PORT}/api/helmets`);
  console.log(`🔗 http://localhost:${PORT}/api/armor`);
  console.log(`🔗 http://localhost:${PORT}/api/rigs`);
  console.log(`🔗 http://localhost:${PORT}/api/backpacks`);
  console.log("--------------------------------------");
  console.log("");
});
