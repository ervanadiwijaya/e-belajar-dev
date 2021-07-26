import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import App from "./App";
import ListUsers from "./components/ListUsers";
import ListVideo from "./components/ListVideo";
import Login from "./components/Login";

const Middleware = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" render={() => <App />} />
                <Route exact path="/login" render={() => <Login />} />
                <Route exact path="/list-video" render={() => <ListVideo />} />
                <Route exact path="/list-user" render={() => <ListUsers />} />
            </Switch>
        </Router>
    )
}

export default Middleware;