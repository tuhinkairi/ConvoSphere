import { IMessage,useConversationStore } from "@/app/_store/chatStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";

type ChatBubbleAvatarProps = {
	message: IMessage;
	isMember: boolean;
	isGroup: boolean | undefined;
	me:any;
	fromAI:any;
};

const ChatBubbleAvatar = ({ isGroup, isMember, message,me,fromAI }: ChatBubbleAvatarProps) => {
	const createConversation = useMutation(api.conversations.createConversation)
	const { setSelectedConversation } = useConversationStore();

	if (!isGroup && !fromAI ) return null;

	const handelCreateConversation = async () => {
		try {

			const conversationId = await createConversation({
				isGroup: false,
				participents: [me._id, message.sender._id]
			})
			// update state
			setSelectedConversation({
				_id: conversationId,
				name: message.sender.name,
				participants: [me._id, message.sender._id],
				isGroup: false,
				isOnline: message.sender.isOnline,
				image: message.sender.image
			})
		} catch (error) {
			toast.error("Failed to kick user");
		}

	}

	return (
		<Avatar className='overflow-visible relative cursor-pointer'
			onClick={handelCreateConversation}
		> 
			{message.sender?.isOnline && isMember && (
				<div className='absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-foreground' />
			)}
			<AvatarImage src={message.sender?.image} className='rounded-full object-cover w-8 h-8' />
			<AvatarFallback className='w-8 h-8 '>
				<div className='animate-pulse bg-gray-tertiary rounded-full'></div>
			</AvatarFallback>
		</Avatar>
	);
};
export default ChatBubbleAvatar;