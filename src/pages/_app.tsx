import "@/pages/globals.css";
import type { AppProps } from "next/app";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${oswald.variable} ${oswald.className}`}>
      <Component {...pageProps} />
    </div>
  );
}
