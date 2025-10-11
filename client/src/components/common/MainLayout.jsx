import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        {/* The content for each page will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;