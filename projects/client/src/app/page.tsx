import Chat from "./common/Chat";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { Metadata } from "next";
import { CONFIG } from "./config";
import { logger } from "./logger";

export const metadata: Metadata = {
  title: "KevChat | A chat for Kevins!",
};

export default async function Home() {
  let apiIsHealthy: boolean = false;
  try {
    const apiHealth = await fetch(`${CONFIG.apiUrl}/healthz`);
    apiIsHealthy = apiHealth.ok;
  } catch (e: unknown) {
    logger.error(e);
    apiIsHealthy = false;
  }

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
      {!apiIsHealthy && (
        <div className="toast">
          <div className="alert alert-error">
            <span>KevChat API is down!</span>
          </div>
        </div>
      )}
    </section>
  );
}
