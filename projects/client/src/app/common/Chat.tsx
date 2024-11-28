import Image from "next/image";
import { User } from "../models/User";
import { ChatMessage } from "../models/ChatMessage";

export default function Chat() {
  const users: { [key: string]: User } = {
    "1": {
      name: "Kevin McCartney",
      avatarUrl:
        "https://media.licdn.com/dms/image/v2/C4E03AQFrt4YBflbtvQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1548424677629?e=1732147200&v=beta&t=cXdCRyz68zuGHXZnCL8l8wiim3patnhz31NFv87HYjo",
    },
    "2": {
      name: "Kevin Costner",
      avatarUrl:
        "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRpidMUfLJZGc7i6zb3Kf_duvr9seWH1gR5qbbSnGkjEtZGEWmz",
    },
  };

  const chatMessages: ChatMessage[] = [
    {
      user: users["2"],
      seenAt: "12:00pm",
      sentAt: "12:45pm",
      message: "what up kev?",
      type: "incoming",
    },
    {
      user: users["1"],
      seenAt: "12:46pm",
      sentAt: "12:45pm",
      message: "kevvv my guy",
      type: "outgoing",
    },
    {
      user: users["2"],
      seenAt: "12:00pm",
      sentAt: "12:45pm",
      message: "what up kev?",
      type: "incoming",
    },
    {
      user: users["1"],
      seenAt: "12:46pm",
      sentAt: "12:45pm",
      message: "kevvv my guy",
      type: "outgoing",
    },
    {
      user: users["2"],
      seenAt: "12:00pm",
      sentAt: "12:45pm",
      message: "what up kev?",
      type: "incoming",
    },
    {
      user: users["1"],
      seenAt: "12:46pm",
      sentAt: "12:45pm",
      message: "kevvv my guy",
      type: "outgoing",
    },
    {
      user: users["2"],
      seenAt: "12:00pm",
      sentAt: "12:45pm",
      message: "what up kev?",
      type: "incoming",
    },
    {
      user: users["1"],
      seenAt: "12:46pm",
      sentAt: "12:45pm",
      message: "kevvv my guy",
      type: "outgoing",
    },
    {
      user: users["2"],
      seenAt: "12:00pm",
      sentAt: "12:45pm",
      message: "what up kev?",
      type: "incoming",
    },
    {
      user: users["1"],
      seenAt: "12:46pm",
      sentAt: "12:45pm",
      message: "kevvv my guy",
      type: "outgoing",
    },
  ];

  return (
    <div className="bg-base-300 flex-grow flex items-end kc-content-wrapper">
      <div className="container mx-auto max-w-7xl py-6 flex flex-col">
        <div className="flex-grow">
          {chatMessages.map((message: ChatMessage, index: number) => (
            <div
              className={`chat ${message.type === "incoming" ? "chat-start" : "chat-end"}`}
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
              <div className="chat-header">
                {message.user.name}
                <time className="text-xs opacity-50">{message.sentAt}</time>
              </div>
              <div
                className={`chat-bubble ${message.type === "outgoing" ? "chat-bubble-primary" : "chat-bubble-secondary"}`}
              >
                {message.message}
              </div>
              {message.type === "outgoing" && (
                <div className="chat-footer opacity-50">{message.seenAt}</div>
              )}
            </div>
          ))}
        </div>
        <textarea
          className="textarea textarea-bordered w-full mt-6"
          placeholder="Type your message here"
        ></textarea>
        <button className="btn btn-accent self-end mt-4">
          Send <span className="ri-send-plane-fill"></span>
        </button>
      </div>
    </div>
  );
}
