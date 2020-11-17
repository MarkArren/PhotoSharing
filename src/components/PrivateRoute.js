import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthConext';

const PrivateRoute = ({component: Component, ...rest}) => {
    const { currentUser } = useAuth();

    return (
        // If user is not logged in redirect to login page
        <Route {...rest} render={props => (
            currentUser ?
                <Component {...props} />
                : <Redirect to="/login" />
        )} />
    );
};

export default PrivateRoute;