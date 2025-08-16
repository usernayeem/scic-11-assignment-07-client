import React from "react";
import {
  FiUsers,
  FiDollarSign,
  FiClock,
  FiTrendingUp,
  FiArrowRight,
  FiStar,
  FiAward,
  FiGlobe,
} from "react-icons/fi";
import { MdSchool, MdVerified } from "react-icons/md";
import { Link } from "react-router";

export const TeacherCTA = () => {
  const benefits = [
    {
      icon: FiUsers,
      title: "Reach Global Students",
      description: "Connect with thousands of eager learners worldwide",
      color: "bg-blue-500",
    },
    {
      icon: FiDollarSign,
      title: "Earn Competitive Income",
      description: "Set your own rates and build a sustainable income stream",
      color: "bg-green-500",
    },
    {
      icon: FiClock,
      title: "Flexible Schedule",
      description: "Teach when it works for you, from anywhere in the world",
      color: "bg-orange-500",
    },
    {
      icon: FiTrendingUp,
      title: "Grow Your Career",
      description: "Build your reputation and expand your professional network",
      color: "bg-purple-500",
    },
    {
      icon: MdVerified,
      title: "Professional Support",
      description: "Get dedicated support and resources to succeed",
      color: "bg-indigo-500",
    },
    {
      icon: FiAward,
      title: "Recognition & Rewards",
      description: "Earn badges, certifications, and top teacher recognition",
      color: "bg-teal-500",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#5D5CDE] rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-[#5D5CDE] rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-[#5D5CDE] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#5D5CDE] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
            <MdSchool className="text-white text-2xl" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Inspire the Next Generation
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            Join thousands of passionate educators who are shaping the future
            through online teaching. Share your expertise, inspire learners, and
            build a rewarding career on EduManage.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div
                  className={`w-14 h-14 ${benefit.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[#5D5CDE] transition-colors duration-200">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 left-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute top-20 right-16 w-12 h-12 bg-white rounded-full"></div>
            <div className="absolute bottom-10 left-1/4 w-8 h-8 bg-white rounded-full"></div>
            <div className="absolute bottom-5 right-8 w-16 h-16 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Teaching?
            </h3>
            <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
              Join our community of expert instructors and start making a
              difference in students' lives while building your teaching career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/teach"
                className="bg-white text-[#5D5CDE] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <span>Apply to Teach</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-white text-opacity-75 mt-6 text-sm">
              * Free to apply • No teaching experience required • Full support
              provided
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
