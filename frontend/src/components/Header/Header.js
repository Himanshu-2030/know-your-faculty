import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div>
      <header className="header">
        <div className="logo">
          <h1>Know Your Faculty</h1>
        </div>
        <button className="nav-toggle" onClick={toggleNav}>
          ☰
        </button>
        <nav className={`nav ${isNavOpen ? "active" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                }}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/all-professors"
                style={{
                  textDecoration: "none",
                }}
              >
                Professors
              </Link>
            </li>

            {/* Clerk Authentication */}
            <li className="nav-item">
              <SignedOut>
                <Link
                  to="/sign-in"
                  className="cta-button"
                  style={{
                    textDecoration: "none",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    borderRadius: "4px",
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  Login
                </Link>
              </SignedOut>
            </li>
            <li className="nav-item">
              <SignedIn>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserButton />
                </div>
              </SignedIn>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
