import {defineSchema, defineTable} from 'convex/server'
import { v } from 'convex/values'
export default defineSchema({
    task:defineTable({
        text: v.string(),
        complete: v.boolean() 
    }),
    product: defineTable({
            name: v.string(),
    })
})


