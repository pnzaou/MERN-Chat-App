import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react"; 
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
    const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeToMessages} = useChatStore()
    const { authUser } = useAuthStore()
    const messageEndRef = useRef(null)

    useEffect(() => {
        getMessages(selectedUser._id)

        subscribeToMessages()

        return () => unsubscribeToMessages()

    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeToMessages]);

    useEffect(() => {
        if(messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({behavior: "smooth"})
        }
    },[messages])

    if(isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader/>
                <MessageSkeleton/>
                <MessageInput/>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                     key={message._id}
                     className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                     ref={messageEndRef}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                 src={message.senderId === authUser._id 
                                    ? authUser.profilPic || "/avatar.png" 
                                    : selectedUser.profilPic || "/avatar.png"
                                 }
                                 alt={message.senderId === authUser._id 
                                    ? `Photo de profil de ${authUser.fullName}` 
                                    : `Photo de profil de ${selectedUser.fullName}
                                `}
                                 />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                    {new Date(message.createdAt).toLocaleTimeString("fr-FR",{
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                            </time>
                        </div>
                        <div className={`chat-bubble flex flex-col ${message.senderId === authUser._id ? "bg-primary" : "bg-base-200"}`}>
                             {message.image && (
                                <img
                                 src={message.image}
                                 alt="Image du message"
                                 className="sm:max-w-[200px] rounded-md mb-2"
                                />
                             )} 
                             {message.text && <p className={`break-words ${message.senderId === authUser._id ? "text-primary-content" : "text-base-content"}`}>{message.text}</p>}      
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput/>
        </div>
    );
}

export default ChatContainer;
