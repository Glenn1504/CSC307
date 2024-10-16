import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userModel from "./user.js";
import userService from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Root route
app.get("/", (req, res) => {
  res.send("Hello World from backend.js!");
});

// Get users with filtering logic
app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  try {
    let users;

    // Check if both name and job are provided
    if (name && job) {
      users = await userService.findUsersByNameAndJob(name, job); // Find users by both name and job
    }
    // Check if only name is provided
    else if (name) {
      users = await userService.findUserByName(name);
    }
    // Check if only job is provided
    else if (job) {
      users = await userService.findUserByJob(job);
    }
    // If no filters, fetch all users
    else {
      users = await userService.getUsers();
    }

    res.send({ users_list: users });
  } catch (error) {
    res.status(500).send("Error fetching users.");
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await userModel.findById(id); // Use Mongoose to find the user
    if (!user) {
      return res.status(404).send("Resource not found.");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching user.");
  }
});

// Add a new user
app.post("/users", async (req, res) => {
  const userToAdd = req.body;

  // Ensure the user has a name and job
  if (!userToAdd.name || !userToAdd.job) {
    return res.status(400).send("Invalid user data. Please provide name and job.");
  }

  try {
    const addedUser = await userService.addUser(userToAdd);
    res.status(201).send(addedUser);
  } catch (error) {
    res.status(500).send("Error adding user.");
  }
});

// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedUser = await userModel.findByIdAndDelete(id); // Use Mongoose to delete the user
    if (!deletedUser) {
      return res.status(404).send("Resource not found.");
    }
    return res.status(204).send(); // 204 No Content response
  } catch (error) {
    res.status(500).send("Error deleting user.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
