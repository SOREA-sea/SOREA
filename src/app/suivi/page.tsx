"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import StreakTracker from "../../components/StreakTracker";
import MenstrualCalendar from "../../components/MenstrualCalendar";
import { notFound } from 'next/navigation';

// 1. Il faut déclarer le composant ici :
export default function MyPage() {
  return (
    <div
      className="relative min-h-screen flex flex-col text-gray-800"
      style={{
        background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)",
        fontFamily: "'Inria Sans', sans-serif",
      }}
    >
      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pb-[24px] gap-[50px] pt-8">
        <Navbar />
      </div>

      <div className="fixed right-3 sm:right-6 lg:right-[56px] top-[132px] z-30 w-[340px] max-w-[calc(100vw-24px)] origin-top-right scale-[0.62] sm:scale-[0.68] lg:scale-75">
        <StreakTracker floating joursConsecutifs={5} />
      </div>

      <section className="w-full flex justify-center">
        <MenstrualCalendar />
      </section>

      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>
    </div>
  );
}