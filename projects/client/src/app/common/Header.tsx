import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  isAuthenticated: boolean;
};

export default function Header(props: HeaderProps) {
  return (
    <div className="navbar px-7 bg-base-100">
      <div className="container mx-auto max-w-7xl">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl border-0" href="/">
            <span className="ri-chat-smile-2-fill text-primary text-4xl"></span>
            KevChat
          </a>
        </div>
        <div className="flex-none">
          {!props.isAuthenticated && <ThemeToggle />}
          {props.isAuthenticated && (
            <div className="dropdown">
              <div
                tabIndex={0}
                className="btn bg-transparent hover:bg-transparent border-0 hover:border-0 flex content-center"
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full border-base-content">
                    <Image
                      alt="Kevin McCartney avatar"
                      src="https://ui-avatars.com/api/?name=Kevin+McCartney"
                      width={60} // width of the image
                      height={60}
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
                  <a href="/settings">Settings</a>
                </li>
                <li className="mb-2">
                  <a href="/profile">Profile</a>
                </li>
                <li className="mb-2">
                  <a href={process.env.KEVCHAT_CLIENT_LOGOUT_URL}>Log out</a>
                </li>
                <li className="">
                  <ThemeToggle />
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
