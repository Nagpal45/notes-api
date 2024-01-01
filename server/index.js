import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import basicAuth from 'express-basic-auth';
import noteRoutes from './noteRoutes.js';


dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

//Connect to MongoDB 
//env file contains confidential connection string 
//change database according to your need
mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:27017/notes')
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));


app.use(basicAuth({
    users: { 'admin': '12345678' },
    challenge: true,
    unauthorizedResponse:'Unauthorized Access!'
}));


app.use(noteRoutes);
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;