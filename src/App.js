import './App.scss';
import Feed from './scenes/Feed/Feed.js';
import Messages from './scenes/Messages/Messages.js';
import Profile from './scenes/Profile/Profile.js';

import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Feed />
          </Route>
          <Route path="/messages">
            <Messages />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
