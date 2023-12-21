import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Logout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged - User:", user);
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const userBeforeSignOut = auth.currentUser;
    console.log("User before sign out:", userBeforeSignOut);

    try {
      await signOut(auth);
      console.log("Sign out successful");
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  console.log("Render - User:", user);

  return (
    <div>
      {user && (
        <button onClick={handleSignOut} className="logout-button">
          Sign Out
        </button>
      )}
    </div>
  );
};

export default Logout;
