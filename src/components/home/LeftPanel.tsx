'use client'
import { ListFilter, MessageSquareDiff, Search } from "lucide-react";
import { Input } from "../ui/input";
import ThemeSwitch from "../additional/ThemeSwitch";
// import { conversations } from "@/app/dummy-data/db";
import Conversation from "./conversation";
import { UserButton } from "@clerk/nextjs";
import UserListDialog from "./user-list-dialog";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";
import { useConversationStore } from "@/app/_store/chatStore";
import BugDialog from "./bug-dialog";

const LeftPanel = () => {
	// check the auth user
	const { isAuthenticated } = useConvexAuth()
	const conversations = useQuery(api.conversations.getMyConversations, isAuthenticated ? undefined : "skip") //skip the process if it is undefiened
	const { isLoading } = useConvexAuth()

	const { selectedConversation, setSelectedConversation } = useConversationStore();

	useEffect(() => {
		const conversationIds = conversations?.map((conversation) => conversation._id);
		if (selectedConversation && conversationIds && !conversationIds.includes(selectedConversation._id)) {
			setSelectedConversation(null);
		}
	}, [conversations, selectedConversation, setSelectedConversation]);


	return (
		<div className='w-1/4 border-gray-600 border-r relative'>
			{!isLoading ? <>
			<div className="absolute bottom-6 right-8">
				{isAuthenticated && <UserListDialog />}
			</div>

				<div className='sticky top-0 bg-left-panel z-10'>
					{/* Header */}
					<div className='flex justify-between bg-gray-primary p-3 items-center'>
						<UserButton />

						<div className='flex items-center gap-3'>
							{/* todo -> move it to separate file and make it client side */}
							{/* <UserListDialog/> */}
							<BugDialog/>
							<ThemeSwitch />
						</div>
					</div>
					<div className='p-3 flex items-center'>
						{/* Search */}
						<div className='relative h-10 mx-3 flex-1'>
							<Search
								className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10'
								size={18}
							/>
							<Input
								type='text'
								placeholder='Search or start a new chat'
								className='pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent'
							/>
						</div>
						<ListFilter className='cursor-pointer' />
					</div>
				</div>

				{/* Chat List */}
				<div className='my-3 flex flex-col gap-0 max-h-[80%] overflow-auto'>
					{/* Conversations */}
					{
						conversations?.map((e) => (
							<Conversation key={e._id} conversation={e} />
						))
					}

					{conversations?.length === 0 && (
						<>
							<p className='text-center text-gray-500 text-sm mt-3'>No conversations yet</p>
							<p className='text-center text-gray-500 text-sm mt-3 '>
								We understand {"you're"} an introvert, but {"you've"} got to start somewhere 😊
							</p>
						</>
					)}
				</div>
			</>
				: null}
		</div>
	);
};
export default LeftPanel;