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


// session removed logoff
export const setUserOffline = internalMutation({
    args: {
        tokenIdentifier: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").withIndex('bytokenIdentifier',(q)=>q.eq('tokenIdentifier',args.tokenIdentifier)).unique()
        
        alert(user)
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



