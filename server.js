const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: `${__dirname}/config.env` });

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
