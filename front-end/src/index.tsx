import React from 'react';
import ReactDOM from 'react-dom';
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
// import 'react-perfect-scrollbar/dist/css/styles.css';
import "./styles/index.css";

import App from './components/App';
import GlobalProvider from './components/containers/GlobalProvider';
import MissingDataHandlerMethodsProvider from './components/containers/MissingDataHandlerMethodsProvider';
import CountriesProvider from './components/containers/CountriesProvider';
import FormDataProvider from './components/containers/FormDataProvider';
import ResultsProvider from './components/containers/ResultsProvider';
import DatasetsProvider from './components/containers/DatasetsProvider';
import CategoriesProvider from "./components/containers/CategoriesProvider";
import { Integrations } from "@sentry/tracing";
import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from "@sentry/react";

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
    <GlobalProvider>
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
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

