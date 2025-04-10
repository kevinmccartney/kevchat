import { Metadata } from 'next';

import ApiHealth from '../../common/ApiHealth';
import Chat from '../../common/Chat';
import Footer from '../../common/Footer';
import ChatHeader from '@/app/common/ChatHeader';

export const metadata: Metadata = {
  title: 'KevChat | Conversation with someone',
};

export default async function Conversation() {
  return (
    <section className="flex flex-col h-screen w-screen">
      <ChatHeader />
      <Chat
        websocketAddress={process.env.KEVCHAT_API_URL as string}
        additionalClasses="overflow-hidden"
      />
      <Footer />
      <ApiHealth />
    </section>
  );
}
