import { Metadata } from 'next';

import ApiHealth from './common/ApiHealth';
import Header from './common/Header';
import Footer from './common/Footer';
import { isAuthenticated } from './utils/auth';
import Link from 'next/link';
import ClientRoot from '@/app/client-root';
import Chat from '@/app/common/Chat';

export const metadata: Metadata = {
  title: 'KevChat | A chat for Kevins!',
};

const MobileView = ({ conversations }: { conversations: JSX.Element[] }) => (
  <div className="w-full overflow-scroll">{conversations}</div>
);

const DesktopView = ({ conversations }: { conversations: JSX.Element[] }) => (
  <>
    <div className="overflow-scroll">{conversations}</div>
    <div className="flex-grow flex flex-col">
      <Chat websocketAddress={process.env.KEVCHAT_API_URL as string} />
    </div>
  </>
);

export default async function Home() {
  const isAuthed = await isAuthenticated();

  const conversations = Array.from({ length: 12 }, (_, i) => i + 1).map(
    (_, index) => (
      <div key={`conversation-${index}`}>
        <Link href={`/conversations/${index + 1}`}>
          <div
            className="flex items-center gap-4 p-4 hover:bg-base-200 cursor-pointer rounded-lg"
            key={`conversation-${index}`}
          >
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src="https://i.pravatar.cc/48" alt="Profile" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-base truncate">Jane Doe</h3>
                <div className="badge badge-primary text-xs">2 new</div>
              </div>
              <p className="text-sm text-gray-500 truncate">
                Hey! Just checking in about our plans for tomorrow.
              </p>
            </div>
          </div>
        </Link>
        {index + 1 !== 12 && <div className="divider"></div>}
      </div>
    ),
  );

  return (
    <section className="flex flex-col h-screen">
      <Header isAuthenticated={isAuthed} />
      <div className="bg-base-300 flex-grow overflow-hidden flex">
        <ClientRoot
          mobileComponent={<MobileView conversations={conversations} />}
          desktopComponent={<DesktopView conversations={conversations} />}
        />
      </div>
      <Footer />
      <ApiHealth />
    </section>
  );
}
