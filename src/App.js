import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MealSearch from './components/MealSearch';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Logout from './components/Logout';
import { auth } from './firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MealSearch user={user} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;