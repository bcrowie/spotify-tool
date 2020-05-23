import React, { useState, createContext } from "react";
import Search from "./Components/Search";
import "./App.css";

export const AuthContext = createContext();

function App() {
  const getHashParams = () => {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  };

  const [auth] = useState(getHashParams());

  if (!auth.access_token) {
    return (window.location.href = "http://localhost:8888");
  } else {
    return (
      <div className="App">
        <Search auth={auth} />
      </div>
    );
  }
}

export default App;
