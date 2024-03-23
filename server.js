const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

const app = require('./app');
const mongoose = require('mongoose');
const tourRoutes = require('./routes/tourRoutes');

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

app.use('/api/v1/tours', tourRoutes);

mongoose.connect(DB).then(() => {
    console.log('Database is successfully connected!!');
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
