import React from 'react';
import ReactDOM from 'react-dom';
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
import 'react-perfect-scrollbar/dist/css/styles.css';
import "./styles/index.css";

import App from './components/App';
import GlobalProvider from './components/containers/GlobalProvider';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <GlobalProvider>

    <App />
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
