import Link from 'next/link';

export default function ChatHeader() {
  return (
    <div className="navbar bg-base-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1 flex items-center">
          <Link className="btn btn-ghost text-xl border-0" href="/">
            <span className="ri-arrow-drop-left-line text-primary text-4xl"></span>
          </Link>
          <h1 className='text-xl'>Kevin Costner</h1>
        </div>
      </div>
    </div>
  );
}
