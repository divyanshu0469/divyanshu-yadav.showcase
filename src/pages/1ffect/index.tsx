import { useState, ReactElement } from "react";
import { Anton, Inter } from "next/font/google";
import AnimatedRedLines from "@/components/1ffect/AnimatedRedLines";
import AnimatedHeader from "@/components/1ffect/AnimatedHeader";
import Preloader from "@/components/1ffect/Preloader";
import styles from "./1ffect.module.css";
import ToolBar from "@/components/common/ToolBar";
import type { NextPageWithLayout } from "@/pages/_app";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const Effect1: NextPageWithLayout = () => {
  const [animationsStarted, setAnimationsStarted] = useState(false);

  const handlePreloaderComplete = () => {
    setAnimationsStarted(true);
  };

  return (
    <div className={styles.container}>
      <Preloader onComplete={handlePreloaderComplete} />
      <AnimatedRedLines
        className={styles.redLines}
        startAnimation={animationsStarted}
      />
      <AnimatedHeader startAnimation={animationsStarted} />
      <ToolBar
        foreground="var(--foreground)"
        position={{ bottom: "2rem", right: "2rem" }}
      />
    </div>
  );
};

Effect1.getLayout = (page: ReactElement) => {
  return (
    <div className={`${anton.variable} ${inter.variable}`}>
      {page}
    </div>
  );
};

export default Effect1;
