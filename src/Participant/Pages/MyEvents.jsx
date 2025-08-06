import React from 'react';
import MyEventsTabs from '../Component/MyEventsTabs';
import { NavLink } from 'react-router-dom';
import { CiBellOn, CiUser } from "react-icons/ci";

const MyEvents = () => {
  return (
    <div className="min-h-screen bg-[#0f1123] text-white">
        <header className='flex justify-between items-center border-b-1 border-[#1c1e32] p-4'>
            <div>
                
                <span className='text-xl font-bold px-10'>PollWave</span>
            </div>
            <div className='flex items-center space-x-8 px-10'>
                <NavLink className="text-sm text-center hover:-translate-y-0.5 transition-transform duration-100">Home</NavLink>
                <NavLink className="text-sm text-center hover:-translate-y-0.5 transition-transform duration-100">Join</NavLink>
                <NavLink to="/my-events/upcoming-events" className="text-sm text-center hover:-translate-y-0.5 transition-transform duration-100">upcoming events</NavLink>
                <NavLink className="text-sm text-center hover:-translate-y-0.5 transition-transform duration-100">Explore</NavLink>
                <button className='text-xl w-[40px] h-[40px] rounded-full bg-[#1c1e32] flex justify-center items-center'><CiBellOn /></button>
                <button className='text-xl w-[40px] h-[40px] rounded-full bg-[#1c1e32] flex justify-center items-center'><CiUser /></button>
            </div>
        </header>
      <div className="max-w-5xl mx-auto pt-10 px-4">
        <h1 className="text-3xl font-bold mb-8">My Events</h1>
        <MyEventsTabs />
      </div>
    </div>
  );
};

export default MyEvents;
