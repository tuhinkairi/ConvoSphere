"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const ThemeSwitch = () => {

	const { setTheme } = useTheme();
	const [open, setOpen] = useState(false)
	return (
		<DropdownMenu>
			<div className="w-fit h-fit relative" onMouseEnter={() => setOpen(!open)} onClick={() => setOpen(!open)} onMouseLeave={() => setOpen(!open)} >

				<DropdownMenuTrigger asChild className='bg-transparent relative'>
					<Button variant='outline' size='icon'>
						<SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
						<MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
						<span className='sr-only'>Toggle theme</span>
					</Button>
				</DropdownMenuTrigger>
				<div className={`absolute -bottom-6 right-0 z-50 text-xs whitespace-nowrap bg-zinc-900 p-1 rounded  text-white ${open ? "flex" : "hidden"}`}>Change Theme</div>
			</div>
			<DropdownMenuContent align='end' className='bg-gray-primary'>
				<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default ThemeSwitch;