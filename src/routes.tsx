import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import Recomendations from './pages/Home/Home';
import Users from './pages/Users/Users';
import Footer from './pages/Footer/Footer';
import Header from './pages/Header/Header';
import InsertClient from './pages/Clients/InsertClient';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import HeaderNotLogin from './pages/Header/HeaderNotLogin';
import Clients from './pages/Clients/Clients';

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                {/* <Route path="/recomendations" render={() => (<div><Header/><Recomendations/><Footer/></div>)}/> */}
                <Route path="/home" render={() => (<div><Header/><Recomendations/><Footer/></div>)}/>
                <Route path="/users" render={() => (<div><Header/><Users/><Footer/></div>)}/>
                <Route path="/clients/create" render={() => (<div><Header/><InsertClient/><Footer/></div>)}/>
                <Route path="/clients" render={() => (<div><Header/><Clients/><Footer/></div>)}/>
                
                <Route path="/" render={() => (<div><HeaderNotLogin/><Login/><Footer/></div>)} exact/>
                <Route path="/signup" render={() => (<div><HeaderNotLogin/><Signup/><Footer/></div>)}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;