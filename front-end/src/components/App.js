import React from 'react';
import '../App.css';
import Header from './Header';
import Questionaire from './Questionaire';
import Results from './Results';
import GlobalProvider from './containers/GlobalProvider';
import TestEndpoint from './TestEndpoint';

function App() {
  return (
    <div className="app">
      <GlobalProvider>
      <a href="http://localhost:8080/login/facebook">Log In with Facebook</a>
      <a href="http://localhost:8080/login/google"> Log In with Google</a>
      <a href="http://localhost:8080/login/github">Log in with GitHub</a>
      <a href="http://localhost:8080/restricted"><button>Make Restricted Request</button></a>
      <a href='http://localhost:8080/logout'><button>Logout</button></a>
        <Header/>
        <TestEndpoint/>
        <Questionaire/>
        <Results/>
      </GlobalProvider>
      
    </div>
    
  );
}

export default App;
