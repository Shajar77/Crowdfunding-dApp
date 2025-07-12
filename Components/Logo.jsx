import React from "react";

const NavBar = () => {
  return (
    <nav>
      <div className="logo">
        {/* Logo path will be /images/logo.png */}
        <img src="/images/logo.png" alt="Logo" className="w-15 h-15" />
        <span className="brand-name"></span>
      </div>
    </nav>
  );
};

export default NavBar;

