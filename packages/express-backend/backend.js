import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspiring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.get("/", (req, res) => {
  res.send("Hello World from backend.js!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  // Filter by name and job
  if (name && job) {
    const result = users["users_list"].filter(
      (user) => user["name"] === name && user["job"] === job
    );
    res.send({ users_list: result });
  } 
  // Filter by name only
  else if (name) {
    const result = findUserByName(name);
    res.send({ users_list: result });
  } 
  // Return all users if no filters are applied
  else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {

  const userToAdd = req.body; 

  // Generate a unique ID if it's not provided
  userToAdd.id = userToAdd.id || Math.random().toString(36).substr(2, 9);

  // Ensure the user has an ID, name, and job
  if (!userToAdd.name || !userToAdd.job) {
    return res.status(400).send("Invalid user data. Please provide name, and job.");
  }

  const addedUser = addUser(userToAdd);
  res.status(201).send(addedUser); // Send back the added user with 201 status
});

// Delete a user by ID
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const userIndex = users["users_list"].findIndex((user) => user["id"] === id);

  if (userIndex === -1) {
    console.log(`User with ID ${id} not found`); // Debugging log
    return res.status(404).send("Resource not found.");
  } else {
    users["users_list"].splice(userIndex, 1); // Remove the user from the list
    return res.status(204).send(); // 204 No Content response
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
