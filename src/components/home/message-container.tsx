
import { messages } from "@/app/dummy-data/db";
import ChatBubble from "./chat-bubble";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/app/_store/chatStore";
import { useEffect, useRef } from "react";

const MessageContainer = () => {
	const { selectedConversation } = useConversationStore();
	const messages = useQuery(api.messages.getMessages, {
		conversation: selectedConversation!._id
	})
	const me = useQuery(api.users.getMe)
	// console.log(messages)
	// auto scroll
	const lastscroll = useRef<HTMLDivElement>(null)
	useEffect(() => {
		setTimeout(() => {
			lastscroll.current?.scrollIntoView({ behavior: "smooth" })
		}, 100);
	}, [messages])
	return (
		<div className='relative p-3 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark'>
			<div className='mx-2 md:mx-14 flex flex-col gap-3 h-full '>
				{messages?.map((msg, idx) => (
					<div key={msg._id} ref={lastscroll}>
						<ChatBubble
							message={msg}
							activeuser={me}
							previousMessage={idx > 0 ? messages[idx - 1] : undefined}
						/>

					</div>
				))}
				<div className="min-h-[0.1px]"></div>
			</div>
		</div>
	);
};
export default MessageContainer;