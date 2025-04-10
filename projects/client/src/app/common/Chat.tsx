'use client';

import Image from 'next/image';
import { User } from '../models/User';
import { ChatMessage } from '../models/ChatMessage';
import { useSocket } from '@/app/hooks';
import { useEffect, useRef, useState } from 'react';

const USERS: { [key: string]: User } = {
  '1': {
    name: 'Kevin McCartney',
    avatarUrl: 'https://ui-avatars.com/api/?name=Kevin+McCartney',
  },
  '2': {
    name: 'Kevin Costner',
    avatarUrl:
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRpidMUfLJZGc7i6zb3Kf_duvr9seWH1gR5qbbSnGkjEtZGEWmz',
  },
};

const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    user: USERS['2'],
    sentAt: '2025-04-07T20:00:00.000Z',
    message: 'what up kev?',
    type: 'incoming',
  },
  {
    user: USERS['1'],
    sentAt: '2025-04-07T20:00:00.000Z',
    message: 'kevvv my guy',
    type: 'outgoing',
  },
  {
    user: USERS['2'],
    sentAt: '2025-04-07T20:00:00.000Z',
    message: 'what up kev?',
    type: 'incoming',
  },
  {
    user: USERS['1'],
    sentAt: '2025-04-07T20:00:00.000Z',
    message: 'kevvv my guy',
    type: 'outgoing',
  },
  {
    user: USERS['2'],
    sentAt: '2025-04-07T20:00:00.000Z',
    message: 'what up kev?',
    type: 'incoming',
  },
  {
    user: USERS['1'],
    sentAt: '2025-04-07T20:00:00.000Z',
    message: 'kevvv my guy',
    type: 'outgoing',
  },
  {
    user: USERS['2'],
    sentAt: '2025-04-07T20:00:00.000Z',
    message: 'what up kev?',
    type: 'incoming',
  },
  {
    user: USERS['1'],
    sentAt: '2025-04-07T20:00:00.000Z',
    message: 'kevvv my guy',
    type: 'outgoing',
  },
  {
    user: USERS['2'],
    sentAt: '2025-04-07T20:00:00.000Z',
    message: 'what up kev?',
    type: 'incoming',
  },
  {
    user: USERS['1'],
    sentAt: '2025-04-07T20:00:00.000Z',
    message: 'kevvv my guy',
    type: 'outgoing',
  },
];

export default function Chat({
  websocketAddress,
  additionalClasses,
}: {
  websocketAddress: string;
  additionalClasses?: string;
}) {
  const { socket } = useSocket(websocketAddress);
  const [messages, setMessages] = useState(MOCK_CHAT_MESSAGES);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'instant',
    });

    if (!socket) return;

    // Example of sending a message
    socket.on('events', (data) => {
      console.log('📨 Received:', data);

      const newMessages = [
        ...messages,
        {
          ...data,
          type: 'incoming',
        },
      ];

      setMessages(newMessages);

      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    });

    return () => {
      socket.off('events');
    };
  }, [socket, messages]);

  const handleKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const message = (event.target as HTMLTextAreaElement).value.trim();
      if (!message) {
        return;
      }
      if (socket) {
        const newMessages = [
          ...messages,
          {
            user: USERS['1'],
            sentAt: new Date().toISOString(),
            message: message,
            type: 'outgoing',
          } as ChatMessage,
        ];

        setMessages(newMessages);
        socket.emit('events', { message });
        (event.target as HTMLTextAreaElement).value = '';
      }
    }
  };

  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const msInDay = 24 * 60 * 60 * 1000;

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const timeStr = date
      .toLocaleTimeString(undefined, timeOptions)
      .toLowerCase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((now as any) - (date as any) < msInDay) {
      return timeStr; // less than a day ago
    } else {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}-${day}-${year} ${timeStr}`;
    }
  }

  return (
    <div className={`h-full flex flex-col ${additionalClasses}`}>
      <div className="p-6 flex flex-col gap-3 overflow-scroll">
        {messages.map((message: ChatMessage, index: number) => (
          <div
            className={`chat ${message.type === 'incoming' ? 'chat-start' : 'chat-end'}`}
            key={index}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image
                  src={message.user.avatarUrl}
                  alt={`Profile pic for ${message.user.name}`}
                  width={60}
                  height={60}
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              {/* {message.user.name} */}
              <time
                suppressHydrationWarning={true}
                className="ml-1 text-xs opacity-50"
              >
                {formatDate(message.sentAt)}
              </time>
            </div>
            <div
              className={`chat-bubble ${message.type === 'outgoing' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}
            >
              {message.message}
            </div>
          </div>
        ))}
        <div id="scroll-anchor" className="h-0" ref={bottomRef}></div>
      </div>
      <textarea
        onKeyDown={handleKeydown}
        className="textarea textarea-bordered w-full mt-6"
        placeholder="Type your message here"
      ></textarea>
    </div>
  );
}
