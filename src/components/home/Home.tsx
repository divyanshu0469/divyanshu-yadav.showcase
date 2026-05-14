import gsap from "gsap";
import { Quintessential } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";

const quintessential = Quintessential({
  variable: "--font-home-quintessential",
  subsets: ["latin"],
  weight: "400",
});

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const slot = root.querySelector<HTMLElement>("[data-hero-slot]");
    const hero = root.querySelector<HTMLElement>("[data-hero]");
    const reveals = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!slot || !hero) return;

    const slotInset = () => {
      const rect = slot.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return `inset(${rect.top}px ${vw - rect.right}px ${vh - rect.bottom}px ${rect.left}px)`;
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      tl.set(reveals, { opacity: 0 })
        .set(hero, { clipPath: "inset(0px 0px 0px 0px)" })
        .to(hero, { clipPath: slotInset(), duration: 1.6, delay: 0.2 })
        .to(reveals, { opacity: 1, duration: 0.6, stagger: 0.08 }, "-=0.7");
    }, root);

    const onResize = () => gsap.set(hero, { clipPath: slotInset() });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Divyanshu Yadav</title>
        <meta
          name="description"
          content="Animations brought to you by Divyanshu Yadav"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        ref={rootRef}
        className={`${quintessential.variable} min-h-screen bg-home-white text-home-blue p-5 flex flex-col items-center justify-center`}
      >
        {/* fullscreen video, clipped via mask to hero slot */}
        <video
          data-hero
          src="/header.mov"
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 w-screen h-screen object-cover z-50 pointer-events-none"
        />
        <div
          data-reveal
          className="flex w-full flex-row justify-between items-center"
        >
          <div>{new Date().toLocaleDateString()}</div>
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-5xl font-bold font-home-quintessential">
              Divyanshu Yadav
            </h1>
            <div className="size-9">
              <Image src={"logo.svg"} width={36} height={36} alt="logo-image" />
            </div>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div>|</div>
            <button>Socials</button>
            <div>|</div>
            <button>Get in touch</button>
          </div>
        </div>
        <div className="relative w-full flex flex-1 flex-row items-center justify-center gap-5">
          {/* left section */}
          <div className="flex flex-1 flex-col items-end">
            <div className="w-1/2 flex justify-end">
              <div className="flex flex-col items-center">
                {/* hero slot — placeholder, video clip-mask resolves here */}
                <div
                  data-hero-slot
                  style={{ width: 513.37, height: 370.85 }}
                />
                {/* about section */}
                <div data-reveal className="w-8/10 flex flex-col">
                  <h3 className="w-full pl-0.5 pt-3 pb-2 text-2xl font-medium">
                    ABOUT
                  </h3>
                  <div className="h-0.5 w-1/3 bg-home-blue" />
                  <span className="w-full pl-0.5 py-3 text-lg">
                    This is a space where I showcase my recent ideas which
                    turned into refined pages with motion in mind. My passion
                    for design drives the need to put up a gallery for display
                  </span>
                  <div className="w-full flex justify-end">
                    <div className="h-0.5 w-1/3 bg-home-blue" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* right section */}
          <div className="flex flex-1 gap-8 flex-col">
            {/* header */}
            <div data-reveal className="w-2/3 text-right">
              <h1 className="font-semibold text-8xl font-home-quintessential tracking-wider">
                Gallery
                <span className="align-super text-5xl font-oswald tracking-normal">
                  (01)
                </span>
              </h1>
            </div>
            {/* table of content */}
            <ul
              data-reveal
              className="pl-5 w-2/3 h-[30vh] flex flex-col text-xl gap-2"
            >
              <li className="flex flex-row gap-2">
                <span className="w-2/10 font-semibold">DATE</span>
                <span className="w-8/10 font-semibold">TITLE</span>
              </li>
              <li className="flex flex-row gap-2">
                <span className="w-2/10">27 Apr 2026</span>
                <span className="w-8/10">This machine is a statement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
