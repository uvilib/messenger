import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import "./App.scss";
import { SocketProvider } from "./context/SocketProvider";

const App = (props) => {
  const { token, login, logout, userId } = useAuth();
  const isAuth = !!token;

  return (
    <>
      {isAuth ? (
        <SocketProvider id={userId}>
          <AuthContext.Provider
            value={{
              token,
              login,
              logout,
              userId,
            }}
          >
            <Switch>
              <Route path="/messages" exact component={Dashboard} />
              <Redirect exact from="/" to="/messages" />
              <Redirect from="/auth" to="/messages" />
              <Redirect from="/register" to="/messages" />
            </Switch>
          </AuthContext.Provider>
        </SocketProvider>
      ) : (
        <AuthContext.Provider
          value={{
            token,
            login,
            logout,
            userId,
          }}
        >
          <Switch>
            <Route path="/auth" exact component={SignIn} />
            <Route path="/register" component={SignUp} />
            <Redirect from="/" to="/auth" />
          </Switch>
        </AuthContext.Provider>
      )}
    </>
  );
};

export default App;
