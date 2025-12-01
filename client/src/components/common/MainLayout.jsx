import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx'; // FIX: Explicitly adding .jsx extension for compilation stability

const MainLayout = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* --- 1. Background Visual Enhancements (Floating Blobs) --- */}
      {/* These elements add soft, moving light sources behind the content */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '-4s' }}></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-fuchsia-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>

      {/* Custom CSS for blob animation (usually in index.css, but defined inline for one-file context) */}
      <style>
        {`
        @keyframes blob {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        `}
      </style>

      {/* --- 2. Main Content Wrapper (z-10 ensures content is above blobs) --- */}
      <div className="relative z-10">
        <Navbar />
        <main className="pt-4 md:pt-8 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          {/* The content for each page will be rendered here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
