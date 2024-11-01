import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

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

export const generateUploadUrl = mutation(async (ctx) => {
	const postUrl = await ctx.storage.generateUploadUrl();
	return postUrl;
});
