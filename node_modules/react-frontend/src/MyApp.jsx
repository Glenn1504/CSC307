// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

const characters = [
  {
    name: "Charlie",
    job: "Janitor"
  },
  {
    name: "Mac",
    job: "Bouncer"
  },
  {
    name: "Dee",
    job: "Aspring actress"
  },
  {
    name: "Dennis",
    job: "Bartender"
  }
];

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  // useEffect to fetch users when the component mounts
  useEffect(() => {
    fetchUsers()
      .then((res) => {
        // Check if the response is ok (status in the range 200-299)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        setCharacters(json["users_list"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // Empty dependency array ensures this runs once on mount	

  function removeOneCharacter(index) {
  const characterToDelete = characters[index];
  
  // Make sure we have an ID to delete the user by
  if (!characterToDelete.id) {
    console.error("No ID found for character");
    return;
  }

  fetch(`http://localhost:8000/users/${characterToDelete.id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 204) {
        console.log(`Deleted user with ID: ${characterToDelete.id}`);
        // Only remove from the state after a successful backend deletion
        const updatedCharacters = characters.filter((_, i) => i !== index);
        setCharacters(updatedCharacters);
      } else if (res.status === 404) {
        console.error("User not found");
      } else {
        console.error("Failed to delete user");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        // Ensure the response has a status of 201
        if (res.status === 201) {
          return res.json(); // Parse the JSON from the response
        } else {
          throw new Error("Failed to create user");
        }
      })
      .then((newUser) => {
        // Update the state with the newly created user that includes the ID
        setCharacters([...characters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

	
  return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form updateList={updateList} /> {/* Pass updateList to Form */}
  </div>
  );
}

export default MyApp;