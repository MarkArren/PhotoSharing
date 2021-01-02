import './App.scss';
import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Feed from './scenes/Feed/Feed';
import Messages from './scenes/Messages/Messages';
import Profile from './scenes/Profile/Profile';
import Login from './scenes/Authentication/Login';
import Signup from './scenes/Authentication/Signup';
import ResetPassword from './scenes/Authentication/ResetPassword';
import Logout from './scenes/Authentication/Logout';
import Upload from './scenes/Upload/Upload';
import EditProfile from './scenes/Profile/EditProfile/EditProfile';

import { AuthProvider } from './context/AuthConext';

import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <div className='App'>
                <Router>
                    <Switch>
                        <PrivateRoute exact path='/' component={Feed} />
                        <PrivateRoute path='/messages' component={Messages} />
                        <PrivateRoute path='/profile' component={Profile} />
                        <Route path='/login' component={Login} />
                        <Route path='/signup' component={Signup} />
                        <Route path='/password-reset' component={ResetPassword} />
                        <PrivateRoute path='/logout' component={Logout} />
                        <PrivateRoute path='/upload' component={Upload} />
                        <PrivateRoute path='/edit' component={EditProfile} />
                    </Switch>
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;
