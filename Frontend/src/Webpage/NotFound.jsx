// src/NotFound.jsx (or put it inside src/Pages if you're organizing)
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '100px 20px',
      height: '100vh'
    }}>
      <h1 style={{ fontSize: '80px' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you’re looking for doesn’t exist.</p>
      <Link to="/" style={{
        marginTop: '20px',
        display: 'inline-block',
        textDecoration: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px'
      }}>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
