const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Database connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Database connected successfully at:', result.rows[0].now);
    });
});

// Endpoint to receive truck location data
app.post('/location', async (req, res) => {
    const { truckId, latitude, longitude, timestamp } = req.body;

    if (!truckId || !latitude || !longitude || !timestamp) {
        return res.status(400).json({ error: 'Missing required fields: truckId, latitude, longitude, timestamp' });
    }

    try {
        const query = `
            INSERT INTO truck_locations(truck_id, latitude, longitude, timestamp)
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [truckId, latitude, longitude, timestamp];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting location data:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('Location Service is healthy');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Location Service listening on port ${PORT}`);
});