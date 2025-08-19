import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// page imports
import Landing from './Webpage/web.landing';
import Registration from './Authentication/Registration/Registration';
import LoginPage from './Authentication/Login/Login';
import HostDashboard from './Host/Host.dashboard';
import CreatePoll from './Host/Host.PollCreation';
import CreateQuiz from './Host/Host.QuizCreation';
import MyEvents from './Participant/Pages/MyEvents';
import UpcomingEvents from './Participant/Pages/UpcomingEvents';
import PollCard from './Features/Polling/Polling';
import Quiz from './Features/Quizzes/Quizzes';
import NotFound from './Webpage/NotFound';
import JoinPage from './Participant/Pages/Join';

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route index element={<Landing />} />
      <Route path="registration" element={<Registration />} />
      <Route path="login" element={<LoginPage />} />

      {/* Host Protected Routes */}
      <Route
        path="host/dashboard"
        element={
          <ProtectedRoute allowedRole="host">
            <HostDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="host/create-poll"
        element={
          <ProtectedRoute allowedRole="host">
            <CreatePoll />
          </ProtectedRoute>
        }
      />
      <Route
        path="host/create-quiz"
        element={
          <ProtectedRoute allowedRole="host">
            <CreateQuiz />
          </ProtectedRoute>
        }
      />

      {/* Participant Protected Routes */}
      <Route
        path="/participant/dashboard"
        element={
          <ProtectedRoute allowedRole="participant">
            <MyEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/participant/upcoming-events"
        element={
          <ProtectedRoute allowedRole="participant">
            <UpcomingEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/participant/join"
        element={
          <ProtectedRoute allowedRole="participant">
            <JoinPage />
          </ProtectedRoute>
        }
      />

      {/* Public Features */}
      <Route path="poll/:pollId" element={<PollCard />} />
      <Route path="quiz/:quizId" element={<Quiz />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
