const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    mongoose.set('strictQuery', true);
   const uri= await mongoose.connect(process.env.MONGODB_URI);
   console.log("URI is:", uri); // add this
    //|| 'mongodb://localhost:27017/honeyDB'
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDatabase;
