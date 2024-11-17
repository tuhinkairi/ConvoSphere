"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger, 
  } from "@/components/ui/dialog"

  import React, { useState } from 'react'
import { BugReportForm } from "./bug-report"
import { Bug } from "lucide-react"

const BugDialog=()=> {
    const [open, setOpen] = useState(false)
    return (
        <Dialog>
		<div className="w-fit h-fit relative flex items-center" onMouseEnter={()=>setOpen(!open)} onMouseLeave={()=>setOpen(!open)} >
        <DialogTrigger>
            <Bug size={20}/>
        </DialogTrigger>
        <div className={`absolute -bottom-6 right-0 z-50 text-xs whitespace-nowrap bg-zinc-900 p-1 rounded  text-white ${open?"flex":"hidden"}`}>Report Issue</div>
		</div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Report Issue</DialogTitle>
            <DialogDescription className="pt-4">
                <BugReportForm/>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>      
    )
  }
export default BugDialog
  