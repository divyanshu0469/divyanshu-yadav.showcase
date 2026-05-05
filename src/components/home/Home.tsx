import { Quintessential } from "next/font/google";
import Head from "next/head";
import Image from "next/image";

const quintessential = Quintessential({
  variable: "--font-home-quintessential",
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
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
        className={`${quintessential.variable} min-h-screen bg-home-white text-home-blue p-5 flex flex-col items-center justify-center`}
      >
        <div className="flex w-full flex-row justify-between items-center">
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
          <div className="flex flex-1 flex-col items-end">
            <div className="w-1/2 flex justify-end">
              <div className="flex flex-col items-center">
                <div className="">
                  <Image
                    src={"/image-main.png"}
                    width={513.37}
                    height={370.85}
                    alt="hero-image"
                  />
                </div>
                <div className="w-2/3 flex flex-col">
                  <h3 className="w-full pl-0.5 text-2xl">About</h3>
                  <div className="h-0.5 w-1/3 bg-home-blue" />
                  <span className="w-full pl-0.5">
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
          <div className="flex flex-1 flex-col">
            <div className="w-2/3 text-right">
              <h1 className="font-semibold text-8xl">
                Gallery <span className=" align-super">(01)</span>
              </h1>
            </div>
            <ul className="w-2/3 h-[30vh] flex flex-col">
              <li className="flex flex-row justify-between">
                <span>27 Apr 2026</span>
                <span>This machine is a statement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
