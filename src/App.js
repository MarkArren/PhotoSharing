import './App.scss';
import Feed from './scenes/Feed/Feed';
import Messages from './scenes/Messages/Messages';
import Profile from './scenes/Profile/Profile';
import Login from './scenes/Authentication/Login';
import Signup from './scenes/Authentication/Signup';
import ResetPassword from './scenes/Authentication/ResetPassword';
import Logout from './scenes/Authentication/Logout';

import { AuthProvider} from './context/AuthConext';

import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <AuthProvider>
      <div className="App">
        
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={Feed} />
            <PrivateRoute path="/messages" component={Messages} />
            <PrivateRoute path="/profile" component={Profile} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/password-reset" component={ResetPassword} />
            <PrivateRoute path="/logout" component={Logout} />
          </Switch>
        </Router>
        
      </div>
    </AuthProvider>
  );
}

export default App;
