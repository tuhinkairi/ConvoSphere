"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import toast from "react-hot-toast"
import { useState } from "react"

const formSchema = z.object({
    message: z.string().min(5, {
        message: "Message must be at least 5 characters.",
    }),
})

export function BugReportForm() {

    const report = useMutation(api.report.sendReport)
    const [open, setOpen] = useState(false)
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {

            await report({
                content: values.message,
            })
            toast.success("Report submitted successfully")
            setOpen(!open)
        } catch (error) {
            toast.error('Somthing Went Wrong, Please Try again!')
        }
    }
    return (
        (!open ? <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="pb-4">{"Please Describe the Issue You're Experiencing"}</FormLabel>
                            <FormControl>
                                <Input placeholder="Tell me about the issue" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>:
        <div className="text-center">Thanks for your support!, Report submitted successfully</div>
        )
    )
}

