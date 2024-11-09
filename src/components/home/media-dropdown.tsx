

import { ImageIcon, Plus, Video } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import Image from 'next/image'
import ReactPlayer from 'react-player'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useConversationStore } from '@/app/_store/chatStore'

const MediaDropdown = () => {
	const imageInput = useRef<HTMLInputElement>(null)
	const videoInput = useRef<HTMLInputElement>(null)
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	// functionality
	const sendImage = useMutation(api.messages.uploadImage)
	const sendVideo = useMutation(api.messages.uploadVideo)

	const { selectedConversation } = useConversationStore()
	const me = useQuery(api.users.getMe)
	// generate a shortlive upload url
	const generateUploadUrl = useMutation(api.conversations.generateUploadUrl)

	const handleSendImage = async () => {
		console.log('handel sending....')
		setIsLoading(true)
		try {
			// fetch the upload url
			const postUrl = await generateUploadUrl()
			// upload the image
			const result = await fetch(postUrl, {
				method: "POST", headers: {
					'Content-Type': 'application/json',
				}, body: selectedImage
			})
			// save the new stroage id to db
			const { storageId }  = await result.json()

			await sendImage({
				imgID: storageId,
				conversation: selectedConversation!._id,
				sender: me!._id
			})
			setSelectedImage(null)

		} catch (error) {
			toast.error('failed to send')
		}
		finally{
			
			setIsLoading(false)
		}

	}
	const handleSendVideo = () => console.log('click')
	return (
		<div className=''>
			<input type="file" ref={imageInput} accept='image/*' onChange={(e) => setSelectedImage(e.target.files![0])} hidden />
			<input type="file" ref={videoInput} accept='video/mp4' onChange={(e) => setSelectedVideo(e.target?.files![0])} hidden />

			{selectedImage &&
				<MediaImageDialog
					isOpen={selectedImage !== null}
					onClose={() => setSelectedImage(null)}
					selectedImage={selectedImage}
					isLoading={isLoading}
					handleSendImage={handleSendImage}
				/>}
			{selectedVideo && (
				<MediaVideoDialog
					isOpen={selectedVideo !== null}
					onClose={() => setSelectedVideo(null)}
					selectedVideo={selectedVideo}
					isLoading={isLoading}
					handleSendVideo={handleSendVideo}
				/>
			)}
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Plus className='text-gray-600 dark:text-gray-400' />
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => imageInput.current!.click()}>
						<ImageIcon size={18} className='mr-1' /> Photo
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => videoInput.current!.click()}>
						<Video size={20} className='mr-1' />
						Video
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default MediaDropdown;

// for images
type MediaImageDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedImage: File;
	isLoading: boolean;
	handleSendImage: () => void;

};

const MediaImageDialog = ({ isOpen, onClose, selectedImage, isLoading, handleSendImage }: MediaImageDialogProps) => {
	const [renderedImage, setRenderedImage] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedImage) return;
		const reader = new FileReader();
		reader.onload = (e) => setRenderedImage(e.target?.result as string);
		reader.readAsDataURL(selectedImage);
	}, [selectedImage]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent>
				<DialogTitle className='hidden'>Send Image</DialogTitle>
				<DialogDescription className='flex flex-col gap-10 justify-center items-center max-h-96 overflow-scroll'>
					{renderedImage && <Image src={renderedImage} width={300} height={300} alt='selected image' />}
					<Button className='w-full sticky bottom-0' disabled={isLoading} onClick={() => handleSendImage()}>
						{isLoading ? "Sending..." : "Send"}
					</Button>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

// for videos
type MediaVideoDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedVideo: File;
	isLoading: boolean;
	handleSendVideo: () => void;

};

const MediaVideoDialog = ({ isOpen, onClose, selectedVideo, isLoading, handleSendVideo }: MediaVideoDialogProps) => {
	const renderedVideo = URL.createObjectURL(new Blob([selectedVideo], { type: "video/mp4" }));
	// console.log("mounted",renderedVideo)
	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent>
				<DialogTitle className='hidden'>Send Video</DialogTitle>
				<DialogDescription>Video</DialogDescription>
				<div className='w-full'>
					{renderedVideo && <ReactPlayer url={renderedVideo} controls width='100%' />}
				</div>
				<Button className='w-full' disabled={isLoading} onClick={handleSendVideo}>
					{isLoading ? "Sending..." : "Send"}
				</Button>
			</DialogContent>
		</Dialog>
	);
};