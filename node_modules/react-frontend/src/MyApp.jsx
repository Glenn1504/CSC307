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
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  
  function updateList(person) { 
  postUser(person)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to add user");
      }
      return res.json(); // Get the new user object from the backend (with id)
    })
    .then((newUser) => {
      setCharacters([...characters, newUser]); // Update state with the new user from the backend
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