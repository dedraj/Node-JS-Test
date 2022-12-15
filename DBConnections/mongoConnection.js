const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME
}).then(() => {
    console.log("Db is conencted!")
}).catch((err) => {
    console.log("Error occured in Mongoose connection!");
})

mongoose.connection.on('connected', () => {
    console.log("Mongoose connected to DB")
});
mongoose.connection.on('error', (err) => {
    console.log("Error in Mongoose connection - ", err);
});
mongoose.connection.on('disconnected', () => {
    console.log("Mongoose connection is disconnected");
});

process.on('SIGINT', async () => { 
    await mongoose.connection.close();
    process.exit(0);
})