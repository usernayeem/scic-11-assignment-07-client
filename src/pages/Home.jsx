import React from "react";
import { Banner } from "../components/Banner";
import { Partners } from "../components/Partners";
import { TeacherCTA } from "../components/TeacherCTA";
import { HowItWorks } from "../components/HowItWorks";
import { FAQ } from "../components/FAQ";
import { PopularClasses } from "../components/PopularClasses";
import { Feedback } from "../components/Feedback";

export const Home = () => {
  return (
    <div>
      <Banner />
      <Partners />
      <PopularClasses />
      <Feedback />
      <TeacherCTA />
      <HowItWorks />
      <FAQ />
    </div>
  );
};
