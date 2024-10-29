import React from 'react'
import Navbar from '../ui/Navbar'
import { SignInButton } from '@clerk/nextjs'
import { LogInIcon } from 'lucide-react'
// import Main from '../ui/main'
// import Footer from '../ui/Footer'

function LandingPage() {
  return (
    <main className='h-screen overflow-hidden content-center text-center'>
              <Navbar/>
                <div className='flex flex-col gap-6 capitalize w-3/5 mx-auto text-wrap '>
                    <h1 className='text-5xl'>Welcome to Convosphere</h1>
                    <p className='text-xl'>this is a whatsapp clone but features with AI (GPT + Dalle) build for the internship perpous only</p>
                    <SignInButton>
                        <span className='cursor-pointer px-4 py-2 bg-white text-zinc-900 border-white rounded-l-full rounded-r-full flex w-fit m-auto font-semibold border hover:bg-transparent hover:text-inherit transition-colors'>Sign Up<LogInIcon className="ml-2 cursor-pointer"/></span>
                    </SignInButton>
                </div>
            {/* <Main/> */}
            {/* <Footer/>    */}
    </main>
  )
}

export default LandingPage
