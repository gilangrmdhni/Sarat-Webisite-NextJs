// components/Layout.js
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="mx-auto max-w-custom">
      {children}
    </div>
  );
};

export default Layout;
