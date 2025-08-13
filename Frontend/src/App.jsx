import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// page's imports
import Landing from './Webpage/web.landing';
import Registration from './Authentication/Registration/registration';
import LoginPage from './Authentication/Login/Login';
import HostDashboard from './Host/Host.dashboard';
import CreatePoll from './Host/Host.PollCreation';
import CreateQuiz from './Host/Host.QuizCreation';
import MyEvents from './Participant/Pages/MyEvents';
import UpcomingEvents from './Participant/Pages/UpcomingEvents';
import PollCard from './Features/Polling/Polling';
import Quiz from './Features/Quizzes/Quizzes';
import NotFound from './Webpage/NotFound';


const App = () => {
  return (
    <Routes>
      <Route index element={<Landing />}></Route>

      <Route path="registration" element={<Registration />} />
      <Route path="login" element={<LoginPage />} />

      <Route path="host/dashboard" element={<HostDashboard/>} />
      <Route path="host/create-poll"  element={ <CreatePoll/> }/>
      <Route path="host/create-quiz"  element={ <CreateQuiz/> }/>

      <Route path="/participant/dashboard" element={<MyEvents/>} />
      <Route path="/participant/upcoming-events" element={<UpcomingEvents/>} />

      <Route path="poll" element={<PollCard />}/>
      <Route path="quiz" element={<Quiz />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
