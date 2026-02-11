import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full">

      {/* ================= HERO SECTION ================= */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
        <h1 className="text-[10rem] md:text-[14rem] font-extrabold tracking-tight text-gray-200 leading-none">
          nepal
        </h1>

        <p className="mt-4 text-gray-500 italic">
          Official Website of
        </p>
        <p className="text-xl font-medium text-gray-700">
          Nepal Tourism Board
        </p>
      </section>

      {/* ================= LATEST STORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-semibold italic">Latest Stories</h2>
          <button className="text-sm text-yellow-600 hover:underline">
            View More
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card */}
          <div className="rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1544735716-6b7f37f0b8ae"
              className="h-64 w-full object-cover"
            />
            <p className="p-4 font-medium">Maghe Sankranti</p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
              className="h-64 w-full object-cover"
            />
            <p className="p-4 font-medium">
              Butterflies vital indicators of a healthy ecosystem
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1604917869287-3ae73c77e227"
              className="h-64 w-full object-cover"
            />
            <p className="p-4 font-medium">Tamu Lhosar</p>
          </div>
        </div>
      </section>

      {/* ================= THINGS TO DO ================= */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-12 text-center">
            Things to do
          </h2>

          <div className="grid md:grid-cols-5 gap-8">

            {/* CATEGORY */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Adventure</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Trekking</li>
                <li>• Zip Flying</li>
                <li>• Sky Diving</li>
                <li>• Bungee Jumping</li>
                <li>• Rafting & Kayaking</li>
                <li>• Paragliding</li>
                <li>• Hiking</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Nature</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Bird Watching</li>
                <li>• Mountain Viewing</li>
                <li>• Jungle Discovery</li>
                <li>• Butterfly Watching</li>
                <li>• Wetlands</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Culture</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Traditional Crafts</li>
                <li>• Meet the People</li>
                <li>• Village Tours</li>
                <li>• Cultural Tours</li>
                <li>• Heritage Walk</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Wellness</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Meditation</li>
                <li>• Ayurveda</li>
                <li>• Faith Healing</li>
                <li>• Natural Hot Water</li>
                <li>• Pilgrimage Tours</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Others</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Destination Wedding</li>
                <li>• MICE</li>
                <li>• Golf</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER TAG ================= */}
      <section className="text-center py-20 text-gray-500 italic">
        Official Website of
        <p className="text-lg font-medium text-gray-700 not-italic">
          Nepal Tourism Board
        </p>
      </section>

    </div>
  );
};

export default Home;
