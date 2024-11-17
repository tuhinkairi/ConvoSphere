
"use client"
import Loader from "@/components/additional/Loader";
import LandingPage from "@/components/home/landingpage";
import LeftPanel from "@/components/home/LeftPanel";
import RightPanel from "@/components/home/RightPanel";
import { useUser } from "@clerk/nextjs";
export default function Home() {
	const { isLoaded, isSignedIn } = useUser()

	if (!isLoaded) {
		return <Loader/>
	}
	if (isLoaded && !isSignedIn) {
		return (<main className='h-screen w-screen'>
			<LandingPage />
		</main>)
	}
	if (isLoaded && isSignedIn) {
		return (
			<main className='h-screen w-screen'>

				<div className='flex overflow-y-hidden h-full max-w-[1700px] mx-auto bg-left-panel '>
					{/* Green background decorator for Light Mode */}
					<div className='fixed top-0 left-0 w-full h-36 bg-green-primary dark:bg-transparent -z-30' />
					<LeftPanel />
					<RightPanel />
				</div>

			</main>
		);
	}
}