import Navbar from "@/components/navbar";
import { Geist, Geist_Mono } from "next/font/google";
import Banner from "@/components/banner";
import Footer from "@/components/footer";
import About from "@/components/about";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <About/>
      <Footer />
    </>
  );
}
