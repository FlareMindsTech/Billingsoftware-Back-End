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

// mongoose.set("strictQuery", false);
// mongoose.connect("mongodb://127.0.0.1:27017/Billingnew")
//   .then(() => console.log("You! Connected to MongoDB..."))
//   .catch((err) =>
//     console.error("Could not connect to MongoDB... " + err.message)
//   );
 mongoose.connect('mongodb+srv://flaremindstech:flareminds%401308@cluster0.12wutsc.mongodb.net/Billingnew?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Connected to MongoDB Atlas...'))
.catch(err => console.error('Could not connect to MongoDB...'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/bills', billRoutes); 

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
