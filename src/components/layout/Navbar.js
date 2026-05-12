import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="w-full"
      style={{
        background: "linear-gradient(135deg, #1a2a5e 0%, #0f1d45 100%)",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            <img
              src="https://kmc.up.nic.in/images/logo.png"
              className="w-[300px]"
              alt="##"
            />
          </div>
          {/* <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center overflow-hidden border-2 border-amber-300">
            <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
              <circle cx="24" cy="24" r="22" fill="#b45309" />
              <circle cx="24" cy="24" r="18" fill="#d97706" />
              <text
                x="24"
                y="30"
                textAnchor="middle"
                fontSize="14"
                fill="white"
                fontWeight="bold"
              >
                KMC
              </text>
            </svg>
          </div>
          <div>
            <div
              className="text-amber-400 font-bold text-sm"
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            >
              कानपुर नगर निगम
            </div>
            <div className="text-blue-200 text-xs">
              Kanpur Municipal Corporation
            </div>
          </div> */}
        </div>

        {/* Title */}
        <div className="text-center">
          <div
            className="text-white font-bold text-xl"
            style={{ fontFamily: "Arial" }}
          >
            PENSIONER PORTAL
          </div>
          <div className="text-blue-300 text-xs tracking-wider">
            Department of Citizen Services
          </div>
        </div>

        {/* User info */}
        <div className="text-right">
          <div className="text-amber-400 font-semibold text-lg"><span>{user?.role}</span> Operator</div>
          <div className="text-blue-200 text-xs">
            Kanpur Municipal Corporation
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div className="px-6 py-2 border-t border-blue-700">
        {/* <nav className="flex justify-between gap-0">
          <div>
            <Link
              to="/dashboard"
              className={`px-4 py-2 text-lg font-medium transition-colors ${
                location.pathname === "/dashboard"
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/applicants"
              className={`px-4 py-2 text-lg font-medium transition-colors ${
                location.pathname.startsWith("/applicant")
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              Applicants
            </Link>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="text-amber-400 text-xs hover:text-white transition-colors mt-1 flex items-center gap-1 ml-auto"
            >
              <span></span> Logout
            </button>
          </div>
        </nav> */}

        <nav className="flex justify-between gap-0">
          <div className="flex items-center gap-12">
            {/* Dashboard */}
            <Link
              to="/dashboard"
              className={`px-4 py-3 text-lg font-medium transition-all duration-300 ${
                location.pathname === "/dashboard"
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              Dashboard
            </Link>

            {/* Employee Dropdown */}
            <div className="relative group">
              <button
                className={`px-4 py-3 text-lg font-medium transition-all duration-300 ${
                  location.pathname.startsWith("/employee")
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-blue-200 hover:text-white"
                }`}
              >
                Employee
              </button>

              <div
                className="
          absolute left-0 top-full
          w-56
          bg-slate-900
          border border-slate-700
          rounded-b-2xl
          shadow-2xl
          overflow-hidden
          origin-top
          scale-y-0
          opacity-0
          invisible
          group-hover:scale-y-100
          group-hover:opacity-100
          group-hover:visible
          transition-all duration-300 ease-out
          z-50
        "
              >
                <Link
                  to="/applicants/add"
                  className="
            block px-5 py-4
            text-blue-100
            border-b border-slate-700
            hover:bg-amber-500
            hover:text-black
            transition-all duration-300
            hover:pl-7
          "
                >
                  Add Applicant
                </Link>

                <Link
                  to="/Dashboard"
                  className="
            block px-5 py-4
            text-blue-100
            hover:bg-amber-500
            hover:text-black
            transition-all duration-300
            hover:pl-7
          "
                >
                  Employee List
                </Link>
              </div>
            </div>

            {/* Pension Dropdown */}
            <div className="relative group">
              <button
                className={`px-4 py-3 text-lg font-medium transition-all duration-300 ${
                  location.pathname.startsWith("/dashoabrd")
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-blue-200 hover:text-white"
                }`}
              >
                Pension
              </button>

              <div
                className="
          absolute left-0 top-full
          w-60
          bg-slate-900
          border border-slate-700
          rounded-b-2xl
          shadow-2xl
          overflow-hidden
          origin-top
          scale-y-0
          opacity-0
          invisible
          group-hover:scale-y-100
          group-hover:opacity-100
          group-hover:visible
          transition-all duration-300 ease-out
          z-50
        "
              >
                <Link
                  to="/dashboard"
                  className="
            block px-5 py-4
            text-blue-100
            border-b border-slate-700
            hover:bg-amber-500
            hover:text-black
            transition-all duration-300
            hover:pl-7
          "
                >
                  Start Pension
                </Link>

                <Link
                  to="/dashboard"
                  className="
            block px-5 py-4
            text-blue-100
            border-b border-slate-700
            hover:bg-amber-500
            hover:text-black
            transition-all duration-300
            hover:pl-7
          "
                >
                  Stop Pension
                </Link>

                <Link
                  to="/dashboard"
                  className="
            block px-5 py-4
            text-blue-100
            hover:bg-amber-500
            hover:text-black
            transition-all duration-300
            hover:pl-7
          "
                >
                  Close Pension
                </Link>
              </div>
            </div>

            {/* Arrea */}
            <Link
              to="/dashboard"
              className={`px-4 py-3 text-lg font-medium transition-all duration-300 ${
                location.pathname.startsWith("/arrea")
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              Arrear
            </Link>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="text-amber-400 text-lg hover:text-white transition-colors mt-1 flex items-center gap-1 ml-auto"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
