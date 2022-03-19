import { useState, Fragment } from "react";
import "./App.css";
import AuthScreen from "./pages/AuthScreen";
import HomeScreen from "./pages/HomeScreen";

function App() {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("jwt") ? true : false
  );

  return (
    <Fragment>
      {authenticated ? (
        <HomeScreen setAuthenticated={setAuthenticated} />
      ) : (
        <AuthScreen setAuthenticated={setAuthenticated} />
      )}
    </Fragment>
  );
}

export default App;
