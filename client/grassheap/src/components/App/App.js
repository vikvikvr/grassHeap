import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from '../Dashboard/Dashboard'
import PlantList from '../Plants/PlantList/PlantList';
import Navbar from '../NavBar/NavBar';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Switch>
          <Route path='/' component={Dashboard} exact/>
          <Route path='/plants' component={PlantList}/>
      </Switch>
    </div>
  );
}

export default App;