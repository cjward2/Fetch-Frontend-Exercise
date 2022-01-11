import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/Header";
import Form from './components/Form';

const App = () => {
  return (
    <div>
      <Header />
      <Form />
    </div>
  )
  

};

export default App;
