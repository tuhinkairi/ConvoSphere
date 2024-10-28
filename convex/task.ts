import { mutation, query } from "./_generated/server"
import {v} from 'convex/values'


// Fetch the data from db
export const getTask=query({
    args:{},
    handler:async(ctx)=>{
        return await ctx.db.query("task").collect()
    }
})

// add data from db
export const addTask= mutation({
    args:{
        text :v.string()
    },
    handler: async(ctx, args)=> {
        const data = {text:args.text, complete:false}
        return await ctx.db.insert("text",data)
    },
})

export const completedTask= mutation({
    args:{
        id:v.id('tasks'),
    },
    handler:async(ctx, args)=>{
        return await ctx.db.patch(args.id,{complete:true})
    }
})




// update data from db
export const updateTask= mutation({
    args:{
        id:v.id('tasks'),
        text:v.string(),
    },
    handler:async(ctx, args)=>{
        return await ctx.db.patch(args.id,{text:args.text})
    }
})

// delete data from db
export const deleteTask = mutation({
    args:{
        id:v.id('tasks')
    },
    handler:async (ctx, args)=>{
        await ctx.db.delete(args.id)
        return null
    } 
})