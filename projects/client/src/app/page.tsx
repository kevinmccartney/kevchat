import Chat from "./common/Chat";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { Metadata } from "next";
import ApiHealth from "./common/ApiHealth";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "KevChat | A chat for Kevins!",
};

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get("kevchat_access_token");

  return (
    <section className="flex flex-col h-full">
      <Header isAuthenticated={isAuthenticated} />
      <Chat websocketAddress={process.env.KEVCHAT_API_URL as string} />
      <Footer />
      <ApiHealth />
    </section>
  );
}
