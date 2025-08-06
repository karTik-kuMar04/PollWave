import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MyEvents from './Participant/Pages/MyEvents';
import UpcomingEvents from './Participant/Pages/UpcomingEvents';
import PollCard from './Features/Polling/Polling';
import Quiz from './Features/Quizzes/Quizzes';

const App = () => {
  return (
    <Quiz />
    

  );
};

export default App;
