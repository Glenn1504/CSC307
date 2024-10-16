// src/Form.jsx
import React, { useState } from "react";

function Form(props) {
  const [person, setPerson] = useState({
    name: "",
    job: ""
  });

  // Update person data on input change
  function handleChange(event) {
    const { name, value } = event.target;

    // Update name or job based on the input field
    if (name === "job") {
      setPerson({ name: person.name, job: value });
    } else {
      setPerson({ name: value, job: person.job });
    }
  }

  // Submit form data
  function submitForm(event) {
    event.preventDefault(); // Prevent default form submission
    props.updateList(person); // Call the parent's handleSubmit
    setPerson({ name: "", job: "" }); // Reset form after submission
  }

  // Render the form
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={person.name}
        onChange={handleChange}
      />
      
      <label htmlFor="job">Job</label>
      <input
        type="text"
        name="job"
        id="job"
        value={person.job}
        onChange={handleChange}
      />
      
      <input type="button" value="Submit" onClick={submitForm} />
    </form>
  );
}

export default Form;
