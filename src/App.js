import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserScreen from './components/telas/UserScreen';
import LoginScreen from './components/telas/LoginScreen';
import HomePage from './components/telas/HomePage';
import { getData } from '../src/components/config/storage';
import ShopkeeperAreaScreen from './components/telas/ShopkeeperAreaScreen';
import ClienteAreaScreen from './components/telas/ClienteAreaScreen';
import AdminScreen from './components/telas/AdminScreen';
import EditLojaScreen from './components/telas/EditLojaScreen';
import EditProductScreen from './components/telas/EditProductScreen';


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage currentUser={currentUser} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/edit-loja/:id" element={<EditLojaScreen />} />
        <Route path="/edit-product/:id" element={<EditProductScreen />} />
        <Route path="/user" element={<UserScreen />} />
        <Route path="/login" element={<LoginScreen setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser} />} />
        <Route path="/area-cliente" element={<ClienteAreaScreen />} />
        <Route path="/area-logista" element={<ShopkeeperAreaScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
