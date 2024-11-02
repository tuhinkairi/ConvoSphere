import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { error } from "console";




export const createConversation = mutation({
	args: {
		participents: v.array(v.id("users")),
		isGroup: v.boolean(),
		groupName: v.optional(v.string()),
		groupImage: v.optional(v.id("_storage")),
		admin: v.optional(v.id("users")),  // Corrected type for admin as user ID
	},
	handler: async (ctx, args) => {
		// Identify the user to retrieve the chats
		const identify = await ctx.auth.getUserIdentity();
		if (!identify) throw new ConvexError("unauthorized");

		// Check for existing conversations with the same set of participants
		const existingConversation = await ctx.db.query("conversations").filter((q) =>
			q.or(
				q.eq(q.field("participants"), args.participents),
				q.eq(q.field("participants"), [...args.participents].reverse()) // Account for reversed order
			)
		).first();

		if (existingConversation) return existingConversation._id;

		// Upload group image if provided
		let groupImage;
		if (args.groupImage) {
			groupImage = (await ctx.storage.getUrl(args.groupImage)) as string;
		}

		// Insert the new conversation into the database
		const conversationID = await ctx.db.insert("conversations", {
			participants: args.participents,
			isGroup: args.isGroup,
			groupName: args.groupName,
			groupImage: groupImage,
			admin: args.admin,
		});
		return conversationID;
	},
});

export const getMyConversations = query({
	args:{

	},
	handler:async(ctx,args)=>{
		// check the authorized user
		const identitiy = await ctx.auth.getUserIdentity() 
		if(!identitiy) throw new ConvexError("unauthorized");

		// fetch the user
		const user = await ctx.db.query('users').withIndex("bytokenIdentifier",(q)=>q.eq("tokenIdentifier",identitiy.tokenIdentifier)
		).unique()


		if (!user) throw new ConvexError("user not found!")
		
		// collect the converstations
		const conversations = await ctx.db.query("conversations").collect()
		const myConversations = conversations.filter((e)=>{
			return e.participants.includes(user._id)
		})
		// last message 
		const converstationsWithDetails = await Promise.all(
			myConversations.map(async (e)=>{
				let userDetails = {}

				if (!e.isGroup) {
					// getting the id of anohter user
					const otheruser = e.participants.find((id)=>id!==user._id)
					// fetch the details based on the conversation
					const profile = await ctx.db.query('users').filter((q)=>q.eq(q.field('_id'),otheruser)).take(1)

					userDetails = profile[0]
				}
				const lastMessage = await ctx.db.query('messages').filter((q)=> q.eq(q.field("conversation"),e._id)).order('desc').take(1) 

				
				return{
					...userDetails,
					...e,
					lastMessage:lastMessage[0]||null
				}
			})
		)
		return converstationsWithDetails;
		
	}
})


export const generateUploadUrl = mutation(async (ctx) => {
	const postUrl = await ctx.storage.generateUploadUrl();
	return postUrl;
});
