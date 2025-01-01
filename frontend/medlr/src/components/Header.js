import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Wrap the PharmaCompare heading with Link to navigate to the home page */}
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:underline">
            PharmaCompare
          </Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            {/* Conditionally render Login and Signup if no token */}
            {!token ? (
              <>
                <li>
                  <Link to="/login" className="hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:underline">
                    Signup
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
