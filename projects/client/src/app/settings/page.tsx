import Header from "../common/Header";
import Footer from "../common/Footer";
import { Metadata } from "next";
import { isAuthenticated } from "@/app/utils/auth";

export const metadata: Metadata = {
  title: "KevChat | Settings",
};

export default async function Settings() {
  const isAuthed = await isAuthenticated();
  return (
    <section className="flex flex-col min-h-screen">
      <Header isAuthenticated={isAuthed}/>
      <div className="bg-base-300 flex-grow flex items-center">
        <div className="container mx-auto max-w-7xl py-6 flex flex-col items-center">
          <div className="flex-grow">
            <h1 className="text-3xl">Coming soon!</h1>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
