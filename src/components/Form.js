import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import './Form.css'

const Form = () => {
  //Initial state of my form, with each input set to empty string. In my opinion its easier/cleaner to set a variable to pass into my useState when its something this large
  const formInitialState = {
    name: "",
    email: "",
    password: "",
    occupation: "",
    state: "",
  };

  const messageInitialState = { err: false, msg: ''  };

  const [occupations, setOccupations] = useState([]); //initialize states to empty array so .map() does not throw an error
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState(formInitialState);
  const [message, setMessage] = useState(messageInitialState); //I want to use state to diplay either an error message or success message to the user. So I want a message key for a customizable message an an err whhich will be a boolean so I can set color of alert

  //When component first mounts, make a call to endpoint for data
  useEffect(() => {
    fetch("https://frontend-take-home.fetchrewards.com/form")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Bad Endpoint`); //check response coming back, if it contains error code, throw error to catch block
        }
        return res.json(); //Otherwise, parse the json into a usuable javaScript object
      })
      .then((data) => {
        //If I sucessfully get my data back, set my state, so that I can cycle through it to display in my dropdowns
        setOccupations(data.occupations);
        setStates(data.states);
      })
      .catch((err) => {
        setMessage({err: true, msg: `I'm sorry, it looks like we were unable to load the form correctly. Please refresh, or try again later`});
      });
  }, []);

  const handleSubmit = event => {  //This is where I am going to make my post request
    event.preventDefault(); //I dont want a form submission refreshing the page.

    const { name, email, password, occupation, state } = formData; //Destructure everything out of formdata state object so its easier to check each value

    if(!name || !email || !password || !occupation || !state) {
      console.log('nope');
      setMessage({ err: true, msg: 'Please fill out all fields of this form' });  //If any form fields are empty, display message to user upon submit
      return;  //Make sure to return from submit function so we dont post to backend
    }
    

    fetch("https://frontend-take-home.fetchrewards.com/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error posting data`);
        }
        return res.data;
      })
      .then((data) => {
        setFormData(formInitialState); //If I sucessfully post the data to the endpoint, clear out the form
        setMessage({ err: false, msg: 'Thanks, we have recieved your information! We will be in touch!' }); //Display success message to user if post request is successfull
      })
      .catch((err) => {
        console.log("Error block", err);
        setMessage({ err: true, msg: 'Uh oh, it looks like we are having trouble. Please try again later' }); //If post request fails for some reason, notify the user
      });


  };

  const handleChange = event => {
    setFormData({
      ...formData, //Spread operator here in order to maintain previous data
      [event.target.name]: event.target.value  //take advantage of event.target and event.value to easily set the values to their respective keys in my state object
    })
  }

  return (
    <div className="form-container">
      <h4 className="form__subscribe-text">Subscribe here</h4>
      
      <form onSubmit={ handleSubmit } className="form">
        {/* Conditionally display message to user. Depending on err value in state I will either display it in green for non-error messages or yellow for error messages */}
      { message.msg &&  <div className={`alert ${ message.err ? 'alert-warning' : 'alert-success' } alert-dismissible fade show`} role="alert">
      { message.msg }
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={ () => setMessage(messageInitialState) }></button>
      </div>
      }
      
        <div className="my-3">
          <label htmlFor="name" className="form-label">
            Enter your name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Please enter your name"
            name="name"
            onChange={ handleChange }
            value= { formData.name }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Please enter your email"
            name="email"
            onChange={ handleChange }
            value={ formData.email }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input 
            type="password" 
            className="form-control"
            placeholder="Please enter your password"
            id="password"
            name="password"
            onChange={ handleChange }
            value={ formData.password }
            />
        </div>
        <label className="form-label" htmlFor="occupation">
          Please select your occupation:
        </label>
        <select
          name="occupation"
          id="occupation"
          className="form-select mb-3"
          aria-label="Select your occupation"
          name="occupation"
          onChange={ handleChange }
          value={ formData.occupation }
        >
          <option defaultValue>Select your occupation</option>
          {/* cycle through my state and for each element within it, display an option tag with a value and content at that index. Also use second argument given with map to set a key to each element created */}
          {occupations.map((occupation, index) => (
            <option key={index} value={occupation}>
              {occupation}
            </option>
          ))}
        </select>

        <label className="form-label" htmlFor="state">
          Please select your state:
        </label>
        <select
          name="state"
          id="state"
          className="form-select"
          aria-label="Select your state"
          name="state"
          onChange={ handleChange }
          value={ formData.state }
        >
          <option defaultValue>Select a state</option>
          {/* Cycle through states array. Destructure name and abbreviation so i dont need to reference state.name (doesn't really matter in this case, but I usually do it where I can). Keys should be unique in React so instead of using index as I did above, Im using the abbreviation for each state so every key in my app is unique. */}
          {states.map(({ name, abbreviation }) => (
            <option key={abbreviation} value={abbreviation}>
              {name}
            </option>
          ))}
        </select>
        <input type="Submit" className="btn-purple" />
      </form>
    </div>
  );
};

export default Form;
