require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");

const errorHandler = require("./middleware/errorHandler");

// Routes
const boardRoutes = require("./routes/boards");
const listRoutes = require("./routes/lists");
const cardRoutes = require("./routes/cards");

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing");
    process.exit(1);
}

// Production middlewares
app.use(compression());
app.use(cors({
    origin: corsOrigin,
}));
app.use(express.json());

// Request logging (only in development or when DEBUG=true)
if (process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
        });
        next();
    });
}

app.get('/ok', (req, res) => {
    res.json({ message: 'Server is fine !' });
});

app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
