import { IMessage, useConversationStore } from "@/app/_store/chatStore";
import { MessageSeenSvg } from "@/lib/svg";
import ChatBubbleAvatar from "./chat-bubble-avatar";
import DateIndicator from "./date-indicator";
import ReactPlayer from "react-player";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription } from "../ui/dialog";

type ChatBubbleProps = {
	message: IMessage, //structure of the message
	activeuser: any,
	previousMessage: IMessage

}

const ChatBubble = ({ message, activeuser, previousMessage }: ChatBubbleProps) => {
	// console.log(message)
	const date = new Date(message._creationTime);
	const hour = date.getHours().toString().padStart(2, "0"); //start with 0 if not 2 digit
	const minute = date.getMinutes().toString().padStart(2, "0");
	const time = `${hour}:${minute}`;

	// check the member
	const { selectedConversation } = useConversationStore()
	const isMember = selectedConversation?.participants.includes(message.sender?._id) || false;
	const isGroup = selectedConversation?.isGroup;
	const fromMe = message.sender?._id === activeuser?._id;
	const bgClass = fromMe ? "bg-green-chat" : "bg-white dark:bg-gray-primary"

	// image pop-up box
	const [open, setOpen] = useState(false)
	if (!fromMe) {
		return (<>
			{/* date show */}
			<DateIndicator previousMessage={previousMessage} message={message} />
			<div className="flex gap-1 w-2/3">
				<ChatBubbleAvatar isMember={isMember} isGroup={isGroup} message={message} />
				<div className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
					<OtherMessageIndicator />
					<TextMessage message={message} />
					<MessageTime time={time} fromMe={fromMe} />
				</div>
			</div>
		</>)
	}

	// message show according to their type
	const renderMessageContent = () => {

		switch (message.contentType) {
			case "text":
				console.log('text')
				return <TextMessage message={message} />;

			case "image":
				console.log('image')
				return <ImageMessage message={message} handleClick={() => {setOpen(!open)
				}} />;
			case "video":
				console.log('video')
				return <VideoMessage message={message} />;
			default:
				return null;
		}
	};
	return (<>
		{/* date show */}
		<DateIndicator previousMessage={previousMessage} message={message} />
		<div className="flex gap-1 w-2/3 ml-auto">
			<div className={`flex flex-col z-20 max-w-fit ml-auto  px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
				<SelfMessageIndicator />

				{renderMessageContent()}
				{open && <ImagePopUp  src={message.content} open={open} onClose={() => setOpen(false)} />}
				<MessageTime time={time} fromMe={fromMe} />
			</div>
		</div>
	</>)

};
export default ChatBubble;

// extra components
const OtherMessageIndicator = () => (
	<div className='absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3 rounded-bl-full' />
);
const SelfMessageIndicator = () => (
	<div className='absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden' />
);


const TextMessage = ({ message }: { message: IMessage }) => {
	const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL

	return (
		<div>
			{isLink ? (
				<a
					href={message.content}
					target='_blank'
					rel='noopener noreferrer'
					className={`mr-2 text-sm font-light text-blue-400 underline`}
				>
					{message.content}
				</a>
			) : (
				<p className={`mr-2 text-sm font-light`}>{message.content}</p>
			)}
		</div>
	);
};
const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
	return (
		<p className='text-[10px] mt-2 self-end flex gap-1 items-center'>
			{time} {fromMe && <MessageSeenSvg />}
		</p>
	);
};

// message type showing components
const ImageMessage = ({ message, handleClick }: { message: IMessage; handleClick: () => void }) => {

	return (
		<div className='w-[250px] h-[250px] m-2 relative'>
			<Image
				src={message.content}
				fill
				className='cursor-pointer object-cover rounded'
				alt='image'
				onClick={handleClick}
			/>
		</div>
	);
};


const VideoMessage = ({ message }: { message: IMessage }) => {
	console.log('video')
	return <ReactPlayer url={message.content} width='250px' height='250px' controls={true} light={true} />;
};

// image pop up component

const ImagePopUp = ({ src, onClose, open }:{ open: boolean; src: string; onClose: () => void }) => {
	console.log(open, src)
	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent className='min-w-[750px]'>
				
				<DialogTitle className="hidden">pop up box</DialogTitle>
				<DialogDescription className='relative h-[450px] flex justify-center'>
					<Image src={src} fill className='rounded-lg object-contain' alt='image' />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};