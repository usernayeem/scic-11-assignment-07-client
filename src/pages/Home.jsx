import React from "react";
import { Banner } from "../components/Banner";
import { Partners } from "../components/Partners";
import { TeacherCTA } from "../components/TeacherCTA";
import { HowItWorks } from "../components/HowItWorks";
import { FAQ } from "../components/FAQ";
import { PopularClasses } from "../components/PopularClasses";
import { Feedback } from "../components/Feedback";
import { Statistics } from "../components/Statistics";

export const Home = () => {
  return (
    <div>
      <Banner />
      <Partners />
      <PopularClasses />
      <Feedback />
      <Statistics />
      <TeacherCTA />
      <HowItWorks />
      <FAQ />
    </div>
  );
};
