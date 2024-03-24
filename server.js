const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

const app = require('./app');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log('Unhandled Exception!! Shutting down...');
    console.log(err.name);
    console.log(err.message);
    console.log(err);
    process.exit(1);
});

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
    console.log('Database is successfully connected!!');
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejections Error!! Shutting down...');
    console.log(err.name);
    console.log(err.message);
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});
