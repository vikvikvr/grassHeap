import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Navbar from '../NavBar/NavBar';
import PlantList from '../Plants/PlantList/PlantList';
import PlantDetails from '../Plants/PlantDetails/PlantDetails';
import Loader from '../Loader/Loader';
import { MyPlant, Plant } from '../../common/types';
import { useGetPlantsQuery } from '../../services/GrowStuffApiServices';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import {
  getMyPlants,
  removeFromMyPlants,
  saveToMyPlants,
} from '../../services/ServerApiServices';
import './App.css';

interface AppCtxt {
  myPlants: MyPlant[];
  plants: Plant[];
  removePlant: (_plantID: number) => void;
  savePlant: (_plant: Plant) => void;
}

export const plantsContext = createContext<AppCtxt>({
  myPlants: [],
  plants: [],
  removePlant: (_plantID: number) => null,
  savePlant: (_plant: Plant) => null,
});

function App(): JSX.Element {
  const [myPlants, setMyPlants] = useState<MyPlant[]>([]);
  const [loadStatus, setLoadStatus] = useState<boolean>(false);

  function savePlant(plant: Plant): void {
    const newPlant: MyPlant = { name: plant.slug, plantID: parseInt(plant.id) };
    try {
      saveToMyPlants(newPlant);
      setMyPlants((oldList: MyPlant[]) => [...oldList, newPlant]);
    } catch (err) {
      console.log(err);
    }
  }

  function removePlant(plantID: number): void {
    removeFromMyPlants(plantID);
    // const myPlantsCopy = myPlants.filter((plant) => plant.plantID !== plantID);
    setMyPlants((oldPlants: MyPlant[]) =>
      oldPlants.filter((plant: MyPlant) => plant.plantID !== plantID),
    );
  }
  const { data, error, isLoading, isSuccess, isError } = useGetPlantsQuery();
  const plants = data && data.filter((plant: Plant) => !!plant.details);

  useEffect(() => {
    getMyPlants().then((myplants: MyPlant[]) => setMyPlants(myplants));
  }, []);

  useEffect(() => {
    if (plants) {
      setLoadStatus(true);
    }
  }, [myPlants, plants]);

  return loadStatus && plants ? (
    <div className="App">
      <plantsContext.Provider
        value={{ myPlants, plants, removePlant, savePlant }}>
        <Router>
          <Navbar />
          <div className="content">
            <Switch>
              <Route path="/plants/:name" component={PlantDetails} />
              <Route exact path="/plants" component={PlantList} />
              <Route exact path="/" component={Dashboard} />
            </Switch>
          </div>
        </Router>
      </plantsContext.Provider>
    </div>
  ) : (
    <Loader />
  );
}

export default App;
