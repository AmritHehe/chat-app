// import Image from "next/image";
"use client"
import {Button} from "@repo/ui/button"
import Link from "next/link";
// import { sign } from "crypto";
export default function Home() {
  return (
    <div>

      <section className="relative min-h-screen pt-20 flex flex-col justify-center overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="bg-blob absolute w-[40rem] h-[40rem] rounded-full bg-purple-200 dark:bg-purple-900/20 filter blur-3xl opacity-30 dark:opacity-20 top-[10%] -left-[10%]"></div>
        <div className="bg-blob absolute w-[30rem] h-[30rem] rounded-full bg-blue-200 dark:bg-blue-900/20 filter blur-3xl opacity-20 dark:opacity-10 bottom-[10%] -right-[10%]"></div>
      </div>

      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="hero-text text-5xl md:text-6xl lg:text-7xl font-bold italic mb-6 text-gray-900 dark:text-white">
            Create<span className="text-purple-600">.</span> <br />
            Collaborate<span className="text-purple-600">.</span> <br />
            Innovate<span className="text-purple-600">.</span>
          </h1>
          <p className="hero-text text-xl text-gray-700 dark:text-gray-300 mb-8">
            The most intuitive drawing tool for your creative journey.
            Bring your ideas to life with Artisctic.
          </p>
          <div className="hero-text flex space-x-4">
            <Link href={"/signup"}>
            <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl px-8 py-4 text-lg">
              <span className="italic">Get Started</span>
            </Button>
            </Link>
            <Link href={"/signup"}>
            <Button  className="px-8 py-4 rounded-xl text-lg border">
              Signin
            </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="hero-text relative rounded-xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-gray-200 dark:border-gray-700">
            <img
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1"
              alt="Artisctic App Interface"
              className="w-full rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
