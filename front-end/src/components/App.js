import React from 'react';
import '../App.css';
import Header from './Header';
import Questionaire from './Questionaire';
import Results from './Results';
import GlobalProvider from './containers/GlobalProvider';

function App() {
  return (
    <div className="app">
      <GlobalProvider>
        <Header/>
        <Questionaire/>
        <Results/>
      </GlobalProvider>
      
    </div>
    
  );
}

export default App;
