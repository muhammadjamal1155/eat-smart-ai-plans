import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Reminders = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navigation />
      <main className="flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Reminders Page</h1>
        <p className="text-xl text-gray-600">This page is under construction. Reminder functionality coming soon!</p>
      </main>
      <Footer />
    </div>
  );
};

export default Reminders;
