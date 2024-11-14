import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const sendTextMessages = mutation({
	args: {
		sender: v.string(), //sender
		content: v.string(), //text/video/image
		conversation: v.id('conversations') //the id of converstaion where the messages take place
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity()
		if (!identity) throw new ConvexError('not authenticated')
		// find the user with the current user 
		const user = await ctx.db.query('users').withIndex('bytokenIdentifier', q => q.eq('tokenIdentifier', identity.tokenIdentifier)).unique()

		if (!user) throw new ConvexError('user not found')

		//filter the converstion via 
		const conversation = await ctx.db.query('conversations').filter(q => q.eq(q.field('_id'), args.conversation)).first() //check the field 

		// check the user is part of the conversation or not
		if (!conversation?.participants.includes(user._id)) {
			throw new ConvexError('You are not the part of the converstion')
		}
		// create a new message
		await ctx.db.insert('messages', {
			sender: args.sender,
			content: args.content,
			conversation: args.conversation,
			contentType: "text",
		})

		//add ai 
		if(args.content.startsWith('@chat')){
			await ctx.scheduler.runAfter(0,api.ai.chat,{
				messageBody : args.content,
				conversation : args.conversation
			})
		}
		if(args.content.startsWith('@image')){
			await ctx.scheduler.runAfter(0,api.ai.Image,{
				messageBody : args.content,
				conversation : args.conversation
			})
		}
	} 
})
// ai message update
export const sendChatGPTMessage = mutation({
	args: {
		content: v.string(),
		conversation: v.id("conversations"),
		messageType: v.union(v.literal("text"), v.literal("image")),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("messages", {
			content: args.content,
			sender: "ChatGPT",
			contentType: args.messageType,
			conversation: args.conversation,
		});
	},
});

// getmessage
export const getMessages = query({
	args: {
		conversation: v.id("conversations"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthorized");
		}

		const messages = await ctx.db
			.query("messages")
			.withIndex("byconversation", (q) => q.eq("conversation", args.conversation))
			.collect();

		const userProfileCache = new Map();

		const messagesWithSender = await Promise.all(
			messages.map(async (message) => {
				if (message.sender === "ChatGPT") {
					const image = message.contentType === "text" ? "/gpt.png" : "dall-e.png";
					return { ...message, sender: { name: "ChatGPT", image } };
				}

				let sender;
				// Check if sender profile is in cache
				if (userProfileCache.has(message.sender)) {
					sender = userProfileCache.get(message.sender);
				} else {
					// Fetch sender profile from the database
					sender = await ctx.db
						.query("users")
						.filter((q) => q.eq(q.field("_id"), message.sender))
						.first();
					// Cache the sender profile
					userProfileCache.set(message.sender, sender);
				}

				return { ...message, sender };
			})
		);

		return messagesWithSender;
	},
});
// image url upload to message table
export const uploadImage = mutation({
	args: {
		imgID: v.id("_storage"),
		sender: v.id("users"),
		conversation: v.id("conversations")
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthorized");
		}
		const content = (await ctx.storage.getUrl(args.imgID)) as string
		await ctx.db.insert("messages", {
			content: content,
			sender: args.sender,
			contentType: "image",
			conversation: args.conversation
		})
	}
})
// video url upload to message table
export const uploadVideo = mutation({
	args: {
		vidID: v.id("_storage"),
		sender: v.id("users"),
		conversation: v.id("conversations")
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthorized");
		}
		const content = (await ctx.storage.getUrl(args.vidID)) as string
		await ctx.db.insert("messages", {
			content: content,
			sender: args.sender,
			contentType: "video",
			conversation: args.conversation
		})
	}
})