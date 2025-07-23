import React from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiUser,
  FiBookOpen,
  FiPlay,
  FiAward,
} from "react-icons/fi";

export const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: FiUser,
      title: "Join the Community",
      description:
        "Create your free account and join thousands of learners worldwide.",
      highlight: "100% Free",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      number: 2,
      icon: FiBookOpen,
      title: "Explore Courses",
      description:
        "Discover courses tailored to your interests and career goals.",
      highlight: "15,000+ Courses",
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      number: 3,
      icon: FiPlay,
      title: "Learn & Practice",
      description: "Engage with interactive content and hands-on projects.",
      highlight: "Interactive Learning",
      gradient: "from-orange-400 to-orange-600",
    },
    {
      number: 4,
      icon: FiAward,
      title: "Earn Recognition",
      description:
        "Complete courses and showcase your achievements with certificates.",
      highlight: "Industry Recognized",
      gradient: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-[#5D5CDE] bg-opacity-10 text-white font-semibold rounded-full text-sm mb-4">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Your Learning Path
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Follow these simple steps to transform your skills and advance your
            career
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;

              return (
                <div key={index} className="relative group">
                  {/* Mobile Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute left-1/2 top-full w-0.5 h-8 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2 z-0"></div>
                  )}

                  {/* Step Card */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative border border-gray-100 dark:border-gray-700">
                    {/* Step Number Circle */}
                    <div
                      className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-6 mt-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="text-white text-2xl" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full mb-3">
                        {step.highlight}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[#5D5CDE] transition-colors duration-200">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow for desktop */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                        <div className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-md">
                          <FiArrowRight className="text-[#5D5CDE] text-sm" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
