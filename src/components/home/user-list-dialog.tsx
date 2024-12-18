'use client';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ImageIcon, Plus } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DialogClose } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { useConversationStore } from "@/app/_store/chatStore";

const UserListDialog = () => {
	const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
	const [groupName, setGroupName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [renderedImage, setRenderedImage] = useState("");
	const imgRef = useRef<HTMLInputElement>(null);
	const dialogCloseRef = useRef<HTMLButtonElement>(null);

	// description show
	const [open, setOpen] = useState(false)

	// Initialize hooks outside conditional blocks
	const createConversation = useMutation(api.conversations.createConversation);
	const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);

	// fetching all users 
	const users = useQuery(api.users.getUsers);
	// fetching the user initiate the task
	const me = useQuery(api.users.getMe);

	const { setSelectedConversation } = useConversationStore()

	// Handle conversation creation
	const handelCreateConversation = async () => {
		if (selectedUsers.length === 0) return;
		let conversationId;
		setIsLoading(true);
		try {
			const isGroup = selectedUsers.length > 1;
			if (!isGroup) {
				conversationId = await createConversation({
					participents: [...selectedUsers, me?._id!],
					isGroup: false,
				});
			} else {
				const postUrl = await generateUploadUrl();
				// Check if `selectedImage` exists and set headers accordingly
				const headers = selectedImage ? { "Content-Type": selectedImage.type } : undefined;

				const result = await fetch(postUrl, {
					method: "POST",
					headers,
					body: selectedImage,
				});
				const { storageId } = await result.json();
				conversationId = await createConversation({
					participents: [...selectedUsers, me?._id!],
					isGroup: true,
					groupName,
					admin: me?._id!,
					groupImage: storageId,
				});
			}
			dialogCloseRef.current?.click();
			setGroupName('')
			setSelectedUsers([])
			setSelectedImage(null)

			// update the global state
			const conversationName = isGroup ? groupName : users?.find((user) => user._id === selectedUsers[0])?.name
			setSelectedConversation({
				_id: conversationId,
				participants: selectedUsers,
				isGroup,
				image: isGroup ? renderedImage : users?.find((user) => user._id === selectedUsers[0])?.image,
				name: conversationName,
				admin: me?._id!,
			});
		} catch (error) {
			toast('opps something went wrong')
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};
	// Image rendering
	useEffect(() => {
		if (!selectedImage) return setRenderedImage("");
		const reader = new FileReader();
		reader.onload = (e) => setRenderedImage(e.target?.result as string);
		reader.readAsDataURL(selectedImage);
	}, [selectedImage]);

	return (
		<Dialog>
			<div className="w-fit h-fit relative" onMouseEnter={() => setOpen(!open)} onMouseLeave={() => setOpen(!open)} >
				<DialogTrigger>
					<Plus size={40} className="bg-green-primary hover:bg-green-secondary rounded-full"/>
				</DialogTrigger>
				<div className={`absolute -bottom-6 right-0 z-50 text-xs whitespace-nowrap bg-zinc-900 p-1 rounded  text-white ${open ? "flex" : "hidden"}`}>New Chat</div>
			</div>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>USERS</DialogTitle>
					<DialogClose ref={dialogCloseRef} />
				</DialogHeader>
				<DialogDescription>Start a new chat</DialogDescription>
				{renderedImage && (
					<div className="w-16 h-16 relative mx-auto">
						<Image src={renderedImage} fill alt="user image" className="rounded-full object-cover" />
					</div>
				)}
				<input type="file" hidden accept="image/*" ref={imgRef} onChange={(e) => setSelectedImage(e.target.files![0])} />
				{selectedUsers.length > 1 && (
					<>
						<Input placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
						<Button className="flex gap-2" onClick={() => imgRef.current?.click()}>
							<ImageIcon size={20} />
							Group Image
						</Button>
					</>
				)}
				<div className="flex flex-col gap-3 overflow-auto max-h-60">
					{users?.filter(user => user.name !== "Deleted").map((user) => (
						<div
							key={user._id}
							className={`flex gap-3 items-center p-2 rounded cursor-pointer active:scale-95 
								transition-all ease-in-out duration-300
							${selectedUsers.includes(user._id) ? "bg-green-primary" : ""}`}
							onClick={() => {
								if (selectedUsers.includes(user._id)) {
									setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
								} else {
									setSelectedUsers([...selectedUsers, user._id]);
								}
							}}
						>
							<Avatar className="overflow-visible">
								{user.isOnline && (
									<div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-foreground" />
								)}
								<AvatarImage src={user.image} className="rounded-full object-cover" />
								<AvatarFallback>
									<div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full"></div>
								</AvatarFallback>
							</Avatar>
							<div className="w-full">
								<div className="flex items-center justify-between">
									<p className="text-md font-medium">{user.name || user.email.split("@")[0]}</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="flex justify-between">
					<Button variant={"outline"}>Cancel</Button>
					<Button onClick={handelCreateConversation} disabled={selectedUsers.length === 0 || (selectedUsers.length > 1 && !groupName) || isLoading}>
						{isLoading ? <div className="w-5 h-5 border-t-2 border-b-2 rounded-full animate-spin" /> : "Create"}
					</Button>
				</div>
			</DialogContent>

		</Dialog>
	);
};

export default UserListDialog;
