import { Metadata } from "next";
import Footer from "./common/Footer";
import Header from "./common/Header";

export const metadata: Metadata = {
  title: "KevChat | A chat for Kevins!",
};

export default function Home() {
  return (
    <section className="flex flex-col h-full">
      <Header />
      <div className="bg-base-300 flex-grow flex items-center">
        <div className="container mx-auto max-w-7xl py-6 flex flex-col justify-center items-center prose">
          <h1 className="mb-8">
            Welcome to <span className="text-primary">KevChat</span>!
          </h1>
          <h2 className="mt-0">
            The world&apos;s first chat for{' '}
            <span className="text-primary">Kevins</span> only.
          </h2>
          <a
            href={process.env.KEVCHAT_FRONT_DOOR_GET_STARTED_URL}
            className="btn btn-accent"
          >
            Get Started
          </a>
        </div>
      </div>
      <Footer />
    </section>
  );
}
