import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import store from './store'

import { CookiesProvider } from "react-cookie";

import { positions, transitions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import { template } from 'lodash';

const options = {
    timeout: 2000,
    position: positions.BOTTOM_CENTER,
    transition: transitions.SCALE
}

ReactDOM.render(
    <CookiesProvider>
        <Provider store={store}>
            <AlertProvider template={AlertTemplate} {...options}>
                <App />
            </AlertProvider>
        </Provider>
    </CookiesProvider>,
    document.getElementById('root')
);


//reportWebVitals();
