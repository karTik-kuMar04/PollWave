import React from 'react';
import { NavLink } from 'react-router-dom';
import { CiBellOn, CiUser } from 'react-icons/ci';

const Header = () => {
  return (
    <header className="flex justify-between items-center border-b border-[#1c1e32] p-4">
      <div>
        <span className="text-white text-xl font-bold px-10 cursor-pointer">
          PollWave
        </span>
      </div>

      <div className="flex items-center space-x-8 px-10">
        <NavLink
          to="/participant/dashboard"
          className={({ isActive }) =>
            `text-sm text-center transition-all duration-150 ${
              isActive ? 'text-cyan-400 font-semibold' : 'text-white hover:text-cyan-300'
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/join"
          className={({ isActive }) =>
            `text-sm text-center transition-all duration-150 ${
              isActive ? 'text-cyan-400 font-semibold' : 'text-white hover:text-cyan-300'
            }`
          }
        >
          Join
        </NavLink>

        <NavLink
          to="/participant/upcoming-events"
          className={({ isActive }) =>
            `text-sm text-center transition-all duration-150 ${
              isActive ? 'text-cyan-400 font-semibold' : 'text-white hover:text-cyan-300'
            }`
          }
        >
          Upcoming Events
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `text-sm text-center transition-all duration-150 ${
              isActive ? 'text-cyan-400 font-semibold' : 'text-white hover:text-cyan-300'
            }`
          }
        >
          Explore
        </NavLink>

        <button className="text-white text-xl w-[40px] h-[40px] rounded-full bg-[#1c1e32] flex justify-center items-center hover:scale-105 transition-transform duration-150">
          <CiBellOn />
        </button>

        <button className="text-white text-xl w-[40px] h-[40px] rounded-full bg-[#1c1e32] flex justify-center items-center hover:scale-105 transition-transform duration-150">
          <CiUser />
        </button>
      </div>
    </header>
  );
};

export default Header;
