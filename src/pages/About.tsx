import React from 'react';
import { Users, Shield, Globe, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About LuxStay</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're on a mission to make luxury travel accessible and memorable for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          {
            icon: Users,
            title: '1M+ Users',
            description: 'Trusted by travelers worldwide',
          },
          {
            icon: Shield,
            title: 'Secure Booking',
            description: 'Protected payment systems',
          },
          {
            icon: Globe,
            title: 'Global Reach',
            description: 'Hotels in 190+ countries',
          },
          {
            icon: Award,
            title: 'Best Prices',
            description: 'Guaranteed lowest rates',
          },
        ].map((item) => (
          <div key={item.title} className="text-center p-6">
            <item.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
        <div className="max-w-3xl mx-auto text-gray-600 space-y-4">
          <p>
            Founded in 2020, LuxStay began with a simple idea: make luxury travel accessible to everyone.
            We believed that booking a perfect stay shouldn't be complicated or expensive.
          </p>
          <p>
            Today, we're proud to serve millions of travelers worldwide, connecting them with the best
            hotels and experiences across the globe. Our commitment to excellence and customer
            satisfaction remains at the heart of everything we do.
          </p>
        </div>
      </div>
    </div>
  );
}