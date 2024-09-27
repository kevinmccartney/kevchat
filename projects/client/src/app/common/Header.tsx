import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <div className="navbar bg-base-100 fixed top-0 left-0">
      <div className="container mx-auto max-w-7xl">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/">
            <span className="ri-chat-smile-2-fill text-primary text-4xl"></span>
            KevChat
          </a>
        </div>
        <div className="flex-none pr-4">
          <div className="dropdown">
            <div
              tabIndex={0}
              className="btn m-1 bg-transparent hover:bg-transparent border-0 hover:border-0 flex content-center"
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full border-base-content">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://ui-avatars.com/api/?name=Kevin+McCartney"
                  />

                  <span className="ri-user-fill"></span>
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li className="my-2">
                <a href="/profile">Settings</a>
              </li>
              <li className="mb-2">
                <a href="/profile">Profile</a>
              </li>
              <li className="mb-2">
                <a href="/logout">Log out</a>
              </li>
              <li className="">
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
