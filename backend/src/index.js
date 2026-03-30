require("dotenv").config();
const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorHandler");

// Routes
const boardRoutes = require("./routes/boards");
const listRoutes = require("./routes/lists");
const cardRoutes = require("./routes/cards");

const app = express();

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing");
    process.exit(1);
}

app.use(cors());
app.use(express.json());

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
