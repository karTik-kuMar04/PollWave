import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CiBellOn, CiUser } from "react-icons/ci";
import axios from "axios";
import { API_BASE_URL } from "../../api.js";

const Header = () => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        { withCredentials: true } // must include this!
      );

      // Remove client-side stored user data
      localStorage.removeItem("user");

      // Use replace so back button doesn’t go back to dashboard
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#1c1e32] bg-[#0f1123]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => navigate("/participant/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">PW</div>
          <span className="text-white text-xl font-semibold tracking-tight">
            PollWave
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { to: "/participant/dashboard", label: "Home" },
            { to: "/participant/join", label: "Join" },
            { to: "/work/progress", label: "Explore" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive
                    ? "text-cyan-400 font-semibold"
                    : "text-gray-200 hover:text-cyan-300"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* notifications
            <button
              className="relative text-white text-xl w-10 h-10 rounded-full bg-[#1c1e32] flex justify-center items-center hover:ring-2 hover:ring-cyan-500/40 transition"
              aria-label="Notifications"
            >
              <CiBellOn />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full" />
            </button> 
          */}

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu((s) => !s)}
              className="text-white text-xl w-10 h-10 rounded-full bg-[#1c1e32] flex justify-center items-center hover:ring-2 hover:ring-cyan-500/40 transition"
              aria-label="Profile"
            >
              <CiUser />
            </button>

            {openMenu && (
              <div
                onMouseLeave={() => setOpenMenu(false)}
                className="absolute right-0 mt-2 w-44 rounded-lg border border-[#1c1e32] bg-[#151735] shadow-xl"
              >
                <NavLink
                  to="/participant/dashboard"
                  className="block px-3 py-2 text-sm text-gray-200 hover:bg-[#1c1e32]"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="work/progress"
                  className="block px-3 py-2 text-sm text-gray-200 hover:bg-[#1c1e32]"
                >
                  My Events
                </NavLink>
                <NavLink
                  to="/work/progress"
                  className="block px-3 py-2 text-sm text-gray-200 hover:bg-[#1c1e32]"
                >
                  Settings
                </NavLink>
                <button
                  onClick={handleLogOut}
                  className="w-full text-left px-3 py-2 text-sm text-rose-300 hover:bg-[#2a1320]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
