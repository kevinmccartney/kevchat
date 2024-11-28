import Chat from "./common/Chat";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { Metadata } from "next";
import ApiHealth from "./common/ApiHealth";

export const metadata: Metadata = {
  title: "KevChat | A chat for Kevins!",
};

export default function Home() {
  debugger;

  console.log("Home");

  return (
    <section className="flex flex-col h-full">
      <Header />
      <Chat />
      <Footer />
      <ApiHealth />
    </section>
  );
}
