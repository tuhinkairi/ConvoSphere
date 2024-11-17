import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const sendReport = mutation(
    {
        args: {
            content: v.string()
        },
        handler: async (ctx, args) => {
            const identity = await ctx.auth.getUserIdentity()
            if (!identity) throw new ConvexError('not authenticated')
            // find the user with the current user 
            const user = await ctx.db.query('users').withIndex('bytokenIdentifier', q => q.eq('tokenIdentifier', identity.tokenIdentifier)).unique()

            if (!user) throw new ConvexError('user not found')
            
            ctx.db.insert('report',{
                user: user._id,
                sender: user.email,
                content: args.content
            })
        },
    }
)