import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <div className="navbar bg-base-100">
      <div className="container mx-auto max-w-7xl">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/">
            <span className="ri-chat-smile-2-fill text-primary text-4xl"></span>
            KevChat
          </a>
        </div>
        <div className="flex-none pr-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
