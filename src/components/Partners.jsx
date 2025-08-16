import React from "react";
import { FaHandshake } from "react-icons/fa";
import { FiExternalLink, FiUsers, FiAward, FiTrendingUp } from "react-icons/fi";
import { MdBusiness, MdSchool, MdVerified } from "react-icons/md";

export const Partners = () => {
  const partners = [
    {
      id: 1,
      name: "TechCorp Solutions",
      logo: "TC",
      description:
        "Leading technology partner providing cutting-edge learning management systems and educational software solutions.",
      partnership: "Technology Partnership",
      icon: MdBusiness,
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Global University Network",
      logo: "GUN",
      description:
        "International consortium of universities offering accredited courses and certification programs.",
      partnership: "Academic Partnership",
      icon: MdSchool,
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "SkillForge Institute",
      logo: "SF",
      description:
        "Premier skill development institute specializing in professional training and career advancement programs.",
      partnership: "Training Partnership",
      icon: FiAward,
      color: "bg-orange-500",
    },
    {
      id: 4,
      name: "InnovateLab",
      logo: "IL",
      description:
        "Innovation hub connecting students with industry mentors and real-world project opportunities.",
      partnership: "Innovation Partnership",
      icon: FiTrendingUp,
      color: "bg-purple-500",
    },
    {
      id: 5,
      name: "CertifyPro",
      logo: "CP",
      description:
        "Industry-recognized certification body ensuring quality standards and professional accreditation.",
      partnership: "Certification Partnership",
      icon: MdVerified,
      color: "bg-indigo-500",
    },
    {
      id: 6,
      name: "CareerConnect",
      logo: "CC",
      description:
        "Employment platform bridging the gap between skilled graduates and top-tier companies worldwide.",
      partnership: "Career Partnership",
      icon: FiUsers,
      color: "bg-teal-500",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
            <FaHandshake className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Trusted Partners
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            We collaborate with industry leaders, educational institutions, and
            innovative companies to provide the best learning experience and
            career opportunities for our students.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner) => {
            const IconComponent = partner.icon;
            return (
              <div
                key={partner.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                {/* Partner Logo Section */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 ${partner.color} rounded-xl flex items-center justify-center text-white font-bold text-xl`}
                    >
                      {partner.logo}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#5D5CDE] transition-colors duration-200">
                        {partner.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <IconComponent className="w-4 h-4" />
                        <span>{partner.partnership}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partner Description */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {partner.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
