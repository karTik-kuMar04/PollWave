import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MyEvents from './Participant/Pages/MyEvents';
import UpcomingEvents from './Participant/Pages/UpcomingEvents';
import PollCard from './Features/Polling/Polling';
import Quiz from './Features/Quizzes/Quizzes';
import CreatePoll from './Host/Host.PollCreation';
import CreateQuiz from './Host/Host.QuizCreation';

const App = () => {
  return (
    <CreateQuiz />
  );
};

export default App;
