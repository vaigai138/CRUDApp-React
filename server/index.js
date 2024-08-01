const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

let users = require("./sample.json");

const app = express();
const port =process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));

// Get all users
app.get("/users", (req, res) => {
    return res.json(users);
});

// Delete a user
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    users = users.filter(user => user.id !== id);

    fs.writeFile(path.join(__dirname, "sample.json"), JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "Error writing file" });
        }
        return res.json(users);
    });
});

// Add a new user
app.post("/users", (req, res) => {
    const { name, age, city } = req.body;

    if (!name || !age || !city) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const id = Date.now();
    users.push({ id, name, age, city });

    fs.writeFile(path.join(__dirname, "sample.json"), JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "Error writing file" });
        }
        return res.json(users);
    });
});

// Update a user
app.patch("/users/:id", (req, res) => {
    const { name, age, city } = req.body;

    if (!name || !age || !city) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "User not found." });
    }

    users[index] = { id, name, age, city };

    fs.writeFile(path.join(__dirname, "sample.json"), JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "Error writing file" });
        }
        return res.json(users);  // Return the updated list of users
    });
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
