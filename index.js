import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/User.js'
import billRoutes from './routes/Bill.js'
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());  

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/Billingnew")
  .then(() => console.log("You! Connected to MongoDB..."))
  .catch((err) =>
    console.error("Could not connect to MongoDB... " + err.message)
  );
 

// Routes
app.use('/api/users', userRoutes);
app.use('/api/bills', billRoutes); 

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
