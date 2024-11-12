import { create } from "zustand";
import { Id } from "../../../convex/_generated/dataModel";

// Define the structure of a conversation, used to represent each conversation in the chat application
export type Conversation = {
	_id: Id<"conversations">;
	image?: string;
	participants: Id<"users">[];
	isGroup: boolean;
	name?: string;
	groupImage?: string;
	groupName?: string;
	admin?: Id<"users">;
	isOnline?: boolean;
	lastMessage?: {
		_id: Id<"messages">;
		conversation: Id<"conversations">;
		content: string;
		sender: Id<"users">;
	};
};

export type KickMessage={
	condition:boolean
}
// Define the state structure and actions for managing the selected conversation & kick message in the app
type KickMessageStore={
	selectedCondition : KickMessage|false;
	setSelectedCondition: (KickMessage:KickMessage| false)=>void
}

type ConversationStore = {
	selectedConversation: Conversation | null;
	setSelectedConversation: (conversation: Conversation | null) => void;
};

// Create a Zustand store to manage the selected conversation state across the app
export const useKickMessageStore = create<KickMessageStore>((set)=>({
	selectedCondition:false,
	setSelectedCondition:(condition)=>set({selectedCondition:condition})
}))

export const useConversationStore = create<ConversationStore>((set) => ({
	selectedConversation: null,
	setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
}));


// Define the structure of a message in the chat application
// interface is the use of future cause it help to extend componenet
export interface IMessage {
	_id: string;
	content: string;
	_creationTime: number;
	contentType: "text" | "image" | "video";
	sender: {
		_id: Id<"users">;
		image: string;
		name?: string;
		tokenIdentifier: string;
		email: string;
		_creationTime: number;
		isOnline: boolean;
	};
}
 