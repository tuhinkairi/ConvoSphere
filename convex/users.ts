import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";


// session created
export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        email: v.string(),
        name: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            email: args.email,
            name: args.name,
            image: args.image,
            isOnline: true,
        });
    },
});
export const deleteUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").withIndex('bytokenIdentifier',(q)=>q.eq('tokenIdentifier',args.tokenIdentifier)).unique()
        await ctx.db.patch(user?._id!,{
            isOnline: false,
            image:"https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg",
            name:"Deleted"
        });
    },
});


// session removed logoff
export const setUserOffline = internalMutation({
    args: {
        tokenIdentifier: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").withIndex('bytokenIdentifier',(q)=>q.eq('tokenIdentifier',args.tokenIdentifier)).unique()
        
        if (!user) {
            throw new ConvexError("User not found!");
        }
        await ctx.db.patch(user._id, {isOnline:false});
    },
});


// session created when login
export const setUserOnline = internalMutation({
    args: {
        tokenIdentifier: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").withIndex('bytokenIdentifier',(q)=>q.eq('tokenIdentifier',args.tokenIdentifier)).unique()
        
        if (!user) {
            throw new ConvexError("User not found!");
        }
        await ctx.db.patch(user._id, { isOnline: true });
    },
});

// update the pic
export const updateUser = internalMutation({
	args: { tokenIdentifier: v.string(), image: v.string() },
	async handler(ctx, args) {
		const user = await ctx.db
			.query("users")
			.withIndex("bytokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, {
			image: args.image,
		});
	},
});

// getting all users if login
export const getUsers = query({
    args:{},
    handler:async(ctx,args)=>{
        const user = await ctx.auth.getUserIdentity()
        if (!user) {
            throw new ConvexError("Unauthorized")
        }
        const all_users = await ctx.db.query("users").collect()
        return all_users.filter(restUser => restUser.tokenIdentifier!== user.tokenIdentifier)
    }   
})
// getting profile
export const getMe = query({
    args:{},
    handler:async(ctx,args)=>{
        // getting the user key to locate
        const user = await ctx.auth.getUserIdentity()
        if (!user) {
            throw new ConvexError("Unauthorized")
        }
        const profile = await ctx.db.query("users").withIndex('bytokenIdentifier',(q)=>q.eq('tokenIdentifier', user.tokenIdentifier)).unique()
        
        if (!profile) throw new ConvexError('user not found')
            
        return profile;
    }   
})


export const getGroupMembers = query({
	args: {
		conversationId: v.id("conversations")
	},
	handler: async (ctx, args) => {
		// check the authorized user
		const identitiy = await ctx.auth.getUserIdentity()
		if (!identitiy) throw new ConvexError("unauthorized");

		// fetch the conversation matched id where we can get the group users then we filter from the users table to display on the members chart
		const conversation = await ctx.db.query("conversations").filter((q)=>q.eq(q.field("_id"),args.conversationId)).first()
		if (!conversation) {
			throw new ConvexError('Conversation not found')
		}
        const user = await ctx.db.query('users').collect()

        const groupUsers = user.filter((e)=>conversation.participants.includes(e._id))
        return groupUsers;
	}
})

