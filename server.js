const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

require('./routes/index.js')(app, fs);

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'PRODUCTS API',
            version: '1.0.0',
            Tag: 'products'
        },
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'x-access-token',
                in: 'header'
            }
        }
    },
    apis: ['./routes/**/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});