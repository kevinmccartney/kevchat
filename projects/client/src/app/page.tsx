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
      <Chat />
      <div className="px-11 flex flex-col">
        <textarea
          className="textarea textarea-bordered w-full mt-6"
          placeholder="Type your message here"
        ></textarea>
        <button className="btn btn-accent self-end mt-4">
          Send <span className="ri-send-plane-fill"></span>
        </button>
      </div>

      <Footer />
      <ApiHealth />
    </section>
  );
}
