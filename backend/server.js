const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const workoutRoutes = require("./routes/workoutRoutes");
const cors = require("cors");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/workouts", workoutRoutes);
// Pehle se majood routes ke neeche ye line add karo:
app.use("/api/nutrition", require("./routes/nutritionRoutes"));

// Home Route
app.get("/", (req, res) => {
    res.send("Fitness Tracker API Running");
});

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});