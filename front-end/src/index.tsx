import { Machine, interpret, assign } from "xstate";
import { inspect } from "@xstate/inspect";
import {service} from './core/state-machines/App/machine';


import React from 'react';
import ReactDOM from 'react-dom';
import './styles/bootstrap.css';
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
// import 'react-perfect-scrollbar/dist/css/styles.css';
// import "./styles/index.css";
import ErrorBoundary from './components/ErrorBoundary';
import App from './components/App';
import GlobalProvider from './components/containers/GlobalProvider';
import MissingDataHandlerMethodsProvider from './components/containers/MissingDataHandlerMethodsProvider';
import CountriesProvider from './components/containers/CountriesProvider';
import FormDataProvider from './components/containers/AnswersProvider';
import ResultsProvider from './components/containers/ResultsProvider';
import DatasetsProvider from './components/containers/DatasetsProvider';
import CategoriesProvider from "./components/containers/CategoriesProvider";
import { Integrations } from "@sentry/tracing";
import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from "@sentry/react";
import APIProvider from './components/containers/APIProvider';
inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});

service.start();

service.send("TOGGLE");
service.send("TOGGLE");

Sentry.init({
  dsn: "https://3db5c5a2202f43728777df0cabb5923c@o481327.ingest.sentry.io/5529747",
  integrations: [
    new Integrations.BrowserTracing(),
    new CaptureConsole({
      levels: ['error']
    })
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.2,
});




ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
    <GlobalProvider>
      <APIProvider>
      <DatasetsProvider>
        <CategoriesProvider>
        <MissingDataHandlerMethodsProvider>
          <CountriesProvider>
            <FormDataProvider>
              <ResultsProvider>
                <App />
              </ResultsProvider>
            </FormDataProvider>
          </CountriesProvider>
        </MissingDataHandlerMethodsProvider>
        </CategoriesProvider>
      </DatasetsProvider>
    </APIProvider>
    </GlobalProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

