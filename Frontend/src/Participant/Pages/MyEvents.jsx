import React from 'react';
import MyEventsTabs from '../Component/MyEventsTabs';
import { NavLink } from 'react-router-dom';
import { CiBellOn, CiUser } from "react-icons/ci";
import Header from '../Component/Header';

const MyEvents = () => {
  return (
    <div className="min-h-screen bg-[#0f1123] text-white">

        <Header />
        
      <div className="max-w-5xl mx-auto pt-10 px-4">
        <h1 className="text-3xl font-bold mb-8">My Events</h1>
        <MyEventsTabs />
      </div>
    </div>
  );
};

export default MyEvents;
