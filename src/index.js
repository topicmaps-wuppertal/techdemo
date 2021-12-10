import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import LibreMap from "./LibreMap";
import Landing from "./Landing";
import "antd/dist/antd.css";
import SensorMap from "./SensorMap";
import Klima from "./klima/App";
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Landing></Landing>}></Route>

          <Route path='/turnableTopicMap' element={<LibreMap />}></Route>

          <Route path='/topicmapWithNewLocator' element={<App />}></Route>

          <Route path='/sensorDemo' element={<SensorMap />}></Route>
          <Route path='/qrklima' element={<Klima />}></Route>
        </Routes>
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
