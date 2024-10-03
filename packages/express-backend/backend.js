import express from "express";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

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

// Function to find users by name
const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"].toLowerCase() === name.toLowerCase()
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

// Define the /users/:id route to return a specific user by id
app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

// Add a new user to the list
const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

console.log("Server is running and listening on port", port);

app.get("/users/search", (req, res) => {
  console.log("Received request to /users/search");
  const { name, job } = req.query;
  console.log(`Searching with name: ${name} and job: ${job}`);

  if (!name || !job) {
    return res.status(400).send("Both name and job must be provided.");
  }

  const result = users["users_list"].filter((user) => {
    const matchName = name ? user.name.toLowerCase() === name.toLowerCase() : true;
    const matchJob = job ? user.job.toLowerCase() === job.toLowerCase() : true;
    return matchName && matchJob;
  });

  console.log(`Search result:`, result);

  if (result.length === 0) {
    res.status(404).send("No users found.");
  } else {
    res.send(result);
  }
});


app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const index = users["users_list"].findIndex((user) => user.id === id);

  if (index === -1) {
    res.status(404).send("User not found.");
  } else {
    users["users_list"].splice(index, 1);
    res.status(200).send("User deleted successfully.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
