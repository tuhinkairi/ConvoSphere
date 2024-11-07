import { Laugh, Mic, Plus, Send } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConversationStore } from "@/app/_store/chatStore";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast from "react-hot-toast";
import useComponentVisible from "@/hooks/useComponentVisible";
import EmojiPicker, { Theme } from 'emoji-picker-react';

const MessageInput = () => {
	// message sending
	const [msgText, setMsgText] = useState("");
	const { selectedConversation } = useConversationStore()

	// custom hook
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
	
	// query
	const sendTextMsg = useMutation(api.messages.sendTextMessages)
	const user = useQuery(api.users.getMe)

	// handelfunctions
	const handelSendMessage = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			// sending the text data
			await sendTextMsg({
				sender: user!._id,
				content: msgText,
				conversation: selectedConversation!._id,
			})
			setMsgText('');
		}
		catch (err: any) {
			toast.error(err.message);
			console.log(err)
		}
	}

	return (
		<div className='bg-gray-primary p-2 flex gap-4 items-center'>
			<div className='relative flex gap-2 ml-2'>
				{/* emoji section */}
				<div ref={ref!} onClick={() => setIsComponentVisible(true)} >
					{isComponentVisible && <EmojiPicker theme={Theme.AUTO}
						onEmojiClick={(e: any) => setMsgText(msgText + e.emoji)}
						style={{ position: "absolute", bottom: "1.5rem", left: "1rem", zIndex: 50 }}
					/>}
					<Laugh className='text-gray-600 dark:text-gray-400' />
				</div>
				{/* media section */}
				<Plus className='text-gray-600 dark:text-gray-400' />
			</div>
			<form onSubmit={handelSendMessage} className='w-full flex gap-3'>
				<div className='flex-1'>
					<Input
						type='text'
						placeholder='Type a message'
						className='py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent'
						value={msgText}
						onChange={(e) => setMsgText(e.target.value)}
					/>
				</div>
				<div className='mr-4 flex items-center gap-3'>
					{msgText.length > 0 ? (
						<Button
							type='submit'
							size={"sm"}
							className='bg-transparent text-foreground hover:bg-transparent'
						>
							<Send />
						</Button>
					) : (
						<Button
							type='submit'
							size={"sm"}
							className='bg-transparent text-foreground hover:bg-transparent'
						>
							<Mic />
						</Button>
					)}
				</div>
			</form>
		</div>
	);
};
export default MessageInput;