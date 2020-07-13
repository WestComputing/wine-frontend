import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage.js';
import WinePage from './pages/WinePage.js';
import AddWinePage from "./pages/AddWinePage";


class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route exact path="/" component={HomePage}/>
            <Route exact path="/wines/:wineID" component={WinePage}/>
            <Route exact path="/add-wine" component={AddWinePage}/>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
