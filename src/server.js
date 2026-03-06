const express = require('express');
const { getDbConnection } = require('./database/db');
const orderRoutes = require('./routes/order.routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
app.use(express.json());

// Routes
app.use('/', orderRoutes);

// Config Swagger UI
try {
    const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
    console.warn('Swagger YAML file not found or malformed: Swagger documentation disabled.');
}

const PORT = process.env.PORT || 3000;

// Initialize Database before listening
getDbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
}).catch(err => {
    console.error('Failed to initialize local database:', err);
    process.exit(1);
});
