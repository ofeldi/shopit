import React from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header'
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from './components/product/ProductDetails'


import {useCookies} from 'react-cookie';

function App() {

    const [cookies, setCookie] = useCookies(['user']);
    setCookie('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzYyMDExNTIsImV4cCI6MTYzNjUyMTE1Mn0.7uQnpDu1uMKivJSUi5o5BR1UN7vg3RNLVg2LXWwoO0U', {path: '/'});


    return (
        <Router>
            <div className="App">
                <Header/>
                <div className="container container-fluid">
                    <Route path="/" component={Home} exact/>
                    <Route path="/product/:id" component={ProductDetails} exact/>
                </div>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
