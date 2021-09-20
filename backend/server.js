const app = require ('./app.js');
const connectDatabase = require ('./config/database')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const db = require('./config/database').mongoURI;

// Handle Uncaught exceptions
process.on('uncaughtException',err =>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1);
})

//Handle Uncaught exceptions
process.on('uncaughtException', err =>{
    console.log(`error: ${err.message}`);
    console.log("Shutting down server due to uncaught exceptions");
    process.exit(1);
})

//Setting up config file
dotenv.config({ path: 'backend/config/config.env'})

// Connect to MongoDB
connectDatabase();



//Connecting to database
const server = app.listen(process.env.port,() =>{
    console.log(`Server started on PORT:${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})

//Handle Unhandled Promise rejections
process.on("unhandledRejection", err =>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close (()=>{
        process.exit(1);
    })
})





/*
mongoose
    .connect(db, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true,useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));*/
