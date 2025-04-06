import Footer from "@/app/common/Footer";
import Header from "@/app/common/Header";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "KevChat | Unauthorized",
};

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("kevchat_access_token");
  return (
    <section className="flex flex-col h-full">
      <Header isAuthenticated={isLoggedIn} />
      <div className="flex-grow flex-col bg-base-300 flex items-center justify-center prose min-w-full p-4">
        <h1>Unauthorized</h1>
        <p className="mt-0">You are not authorized to see this page.</p>
        <a
          href={process.env.KEVCHAT_CLIENT_LOGIN_URL}
          className="btn btn-primary"
        >
          Login
        </a>
        <a href={process.env.KEVCHAT_CLIENT_URL} className="text-accent mt-4">
          Go back to Home
        </a>
      </div>
      <Footer />
    </section>
  );
}
