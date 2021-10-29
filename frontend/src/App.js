import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header'
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import React from "react";


import {useCookies} from 'react-cookie';

function App() {

    const [cookies, setCookie] = useCookies(['user']);
    setCookie('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzU0NDI2NDQsImV4cCI6MTYzNTc2MjY0NH0.u4ogFexEeEQI9ZcvRV2Y_jeViZ7mMYbbJWh5Zc-WlCw', {path: '/'});


    return (
        <Router>
            <div className="App">
                <Header/>
                <div className="container container-fluid">
                    <Route path="/" component={Home} exact/>
                </div>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
