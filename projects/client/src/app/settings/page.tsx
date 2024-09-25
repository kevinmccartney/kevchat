import Header from "../common/Header";
import Footer from "../common/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KevChat | Settings",
};

export default function Settings() {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-base-300 flex-grow flex items-center">
        <div className="container mx-auto max-w-7xl py-6 flex flex-col items-center">
          <div className="flex-grow prose">
            <h2>Coming soon!</h2>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
