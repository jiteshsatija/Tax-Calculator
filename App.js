import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import IncomeTaxCalculator from './components/calculator/IncomeTaxCalculator';
import './assets/styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navigation />
        <Switch>
          <Route path="/calculator" component={IncomeTaxCalculator} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
