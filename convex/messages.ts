import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { error } from "console";

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
        await ctx.db.insert('messages',{
            sender:args.sender,
            content:args.content,
            conversation:args.conversation,
            contentType:"text",
        })

        //add chat-gpt 
    }


})