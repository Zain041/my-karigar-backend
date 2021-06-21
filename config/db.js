const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')
const cloudDb= config.get('mongoCloud')

const connectDB = async () => {
    
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        mongoose.connection.on('error', function(error) {
            console.error('Database connection error:', error);
          });

        console.log('MongoDB Connected.')
       
    }
    catch(err) {
        console.log(err.message);
        //Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;