import { mutation, query } from "./_generated/server"
import {v} from 'convex/values'


// Fetch the product data from db
export const getProduct=query({
    args:{},
    handler:async(ctx)=>{
        return await ctx.db.query("product").collect()
    }
})

// add product data from db
export const addProduct= mutation({
    args:{
        name:v.string(),
        price:v.number(),
    },
    handler: async(ctx, args)=> {
        const data = {name:args.name, price:args.price}
        return await ctx.db.insert("product",data)
    },
})

// update product data from db
export const updateProduct= mutation({
    args:{
        id:v.id('product'),
        name:v.string(),
        price:v.number(),
    },
    handler:async(ctx, args)=>{
        return await ctx.db.patch(args.id,{name:args.name,price:args.price})
    }
})

// delete product data from db
export const deleteProduct = mutation({
    args:{
        id:v.id('product')
    },
    handler:async (ctx, args)=>{

        await ctx.db.delete(args.id)
        return null
    } 
})