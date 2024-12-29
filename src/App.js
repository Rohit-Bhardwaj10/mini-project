import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Legal from "./Pages/Legal";
import NotFound from "./Pages/NotFound";
import Appointment from "./Pages/Appointment";
import ChatBot from "./Components/ChatBot";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";

function App() {
  return (
    <div className="App">
      <Router basename="/Health-Plus">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/legal" element={<Legal />} />
          <Route 
            path="/appointment" 
            element={
              <ProtectedRouteForUser>
                <Appointment />
              </ProtectedRouteForUser>
            } 
          />
          <Route path="*" element={<NotFound />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRouteForUser>
                <ChatBot />
              </ProtectedRouteForUser>
            }
          />
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<SignUp />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;


// protected routes
export const ProtectedRouteForUser = ({children}) => {
  const user = localStorage.getItem('user')
  if(user){
    return children
  }
  return <Navigate to="/login"/>
}
