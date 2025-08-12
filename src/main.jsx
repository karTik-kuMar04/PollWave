import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App'; // your main App component


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <App />

    
  </BrowserRouter>
);
