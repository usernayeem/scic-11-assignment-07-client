import React from "react";
import { Banner } from "../components/Banner";
import { Partners } from "../components/Partners";
import { TeacherCTA } from "../components/TeacherCTA";
import { HowItWorks } from "../components/HowItWorks";

export const Home = () => {
  return (
    <div>
      <Banner />
      <Partners />
      <TeacherCTA />
      <HowItWorks />
    </div>
  );
};
