
import LeftPanel from "@/components/home/LeftPanel";
import RightPanel from "@/components/home/RightPanel";
import { SignedIn } from "@clerk/nextjs";
export default function Home() {

	return (<main className='h-screen'>
		
		<SignedIn>

		<div className='flex overflow-y-hidden h-full max-w-[1700px] mx-auto bg-left-panel '>
			{/* Green background decorator for Light Mode */}
			<div className='fixed top-0 left-0 w-full h-36 bg-green-primary dark:bg-transparent -z-30' />
			<LeftPanel />
			<RightPanel />
		</div>
		</SignedIn>
	</main>
	);
}