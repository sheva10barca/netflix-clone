import React, { useEffect } from 'react';
import './App.css';
import HomeScreen from './components/HomeScreen/HomeScreen';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginScreen from './components/LoginScreen/LoginScreen';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import ProfileScreen from './components/ProfileScreen/ProfileScreen';

function App() {
   const user = useSelector(selectUser);
   const dispatch = useDispatch();

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((userAuth) => {
         if (userAuth) {
            // Loged in
            dispatch(
               login({
                  uid: userAuth.uid,
                  email: userAuth.email,
               }),
            );
         } else {
            // Loged out
            dispatch(logout());
         }
      });
      return unsubscribe;
   }, [dispatch]);

   return (
      <div className='app'>
         <Router>
            {!user ? (
               <LoginScreen />
            ) : (
               <Routes>
                  <Route path='/profile' element={<ProfileScreen />} />
                  <Route exact path='/' element={<HomeScreen />} />
               </Routes>
            )}
         </Router>
      </div>
   );
}

export default App;
