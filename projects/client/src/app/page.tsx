import Chat from "./common/Chat";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { Metadata } from "next";
import { CONFIG } from "./config";

export const metadata: Metadata = {
  title: "KevChat | A chat for Kevins!",
};

export default async function Home() {
  const apiHealth = await fetch(`${CONFIG.apiUrl}/healthz`);
  const apiIsHealthy = apiHealth.ok;

  return (
    <section className="flex flex-col h-full">
      <Header />
      <Chat />
      <Footer />
      {apiIsHealthy && (
        <div className="toast">
          <div className="alert alert-success">
            <span>KevChat API is up!</span>
          </div>
        </div>
      )}
    </section>
  );
}
