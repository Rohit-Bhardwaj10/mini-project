import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import '../Styles/signUp.css'

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    if (username === "" || email === "" || password === "") {
      return toast.error("all fields must be filled correctly");
    }
    try {
      const users = await createUserWithEmailAndPassword(auth, email, password);
      const user = {
        name: username,
        email: email,
        uid: users.user.uid,
        time: Timestamp.now(),
      };
      const userref = collection(db, "users");
      await addDoc(userref, user);
      toast.success("signUp successfull !!");
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (error) {
      console.log(error);
      toast.error("signUp failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Please fill in your details</p>
        </div>
        
        <div className="form-group">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="name"
            className="input-field"
            placeholder="Full Name"
          />
        </div>
        
        <div className="form-group">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            className="input-field"
            placeholder="Email Address"
          />
        </div>
        
        <div className="form-group">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="input-field"
            placeholder="Password"
          />
        </div>
        
        <button 
          className="signup-button"
          onClick={signup}
        >
          Sign Up
        </button>
        
        <div className="login-link-container">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
