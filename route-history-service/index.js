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

// Endpoint to get historical truck location data
app.get('/history/:truckId', async (req, res) => {
    const { truckId } = req.params;
    const { startDate, endDate } = req.query; // Optional date range

    try {
        let query = `
            SELECT truck_id, latitude, longitude, timestamp
            FROM truck_locations
            WHERE truck_id = $1
        `;
        const values = [truckId];

        if (startDate && endDate) {
            query += ` AND timestamp BETWEEN $2 AND $3`;
            values.push(startDate, endDate);
        } else if (startDate) {
            query += ` AND timestamp >= $2`;
            values.push(startDate);
        } else if (endDate) {
            query += ` AND timestamp <= $2`;
            values.push(endDate);
        }

        query += ` ORDER BY timestamp ASC;`;

        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching historical data:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('Route History Service is healthy');
});

const PORT = process.env.PORT || 3002; // Different port than location-service
app.listen(PORT, () => {
    console.log(`Route History Service listening on port ${PORT}`);
});