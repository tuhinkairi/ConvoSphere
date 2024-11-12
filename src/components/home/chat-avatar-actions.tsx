import { useMutation } from "convex/react";
import { Ban, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import React from "react";
import { IMessage, useConversationStore, useKickMessageStore } from "@/app/_store/chatStore";
import { api } from "../../../convex/_generated/api";

type ChatAvatarActionsProps = {
	message: IMessage;
	me: any;
};

const ChatAvatarActions = ({ me, message }: ChatAvatarActionsProps) => {
	const { selectedConversation, setSelectedConversation } = useConversationStore();
	const {setSelectedCondition}=useKickMessageStore()

	const isMember = selectedConversation?.participants.includes(message.sender._id);
	const kickUser = useMutation(api.conversations.kickUser);

	const isGroup = selectedConversation?.isGroup;

	const handleKickUser = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!selectedConversation) return;
		try {
			await kickUser({
				conversationId: selectedConversation._id,
				userId: message.sender._id,
			});

			setSelectedConversation({
				...selectedConversation,
				participants: selectedConversation.participants.filter((id) => id !== message.sender._id),
			});
			
		} catch (error) {
			toast.error("Failed to kick user");
		}
	};
	

	return (
		<div
			className='text-[11px] flex gap-4 justify-between font-bold cursor-pointer group'
			
		>

			{!isMember && isGroup && (<>
				<Ban size={16} className='text-red-500' />
			</>
		)}
			{isMember && selectedConversation?.admin === me._id && (
				<LogOut size={16} className='text-red-500 opacity-0 group-hover:opacity-100' onClick={handleKickUser} />
			)}
		</div>
	);
};
export default ChatAvatarActions;