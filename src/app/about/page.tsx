import Navbar from "@/components/ui/Navbar";
export default function Home() {
    return (
    <main className='h-screen w-screen overflow-hidden '>
        <section className="h-full content-center text-center bg-green-primary text-white">
            <Navbar />
            <div className="flex flex-col gap-6 capitalize w-3/5 mx-auto text-wrap">
                <h1 className="text-5xl">About Us</h1>
                <p className="text-xl">
                    Welcome to our WhatsApp Clone, an AI-powered platform designed to enhance messaging and media generation. Built as a proof of concept, this application integrates cutting-edge AI technologies such as <strong>Gemini</strong> and <strong>EDEN.ai</strong>.
                </p>
                <p>
                    This project is built solely for internship purposes, aiming to demonstrate skills in frontend and backend development, combined with artificial intelligence integration.
                </p>
            </div>
        </section>

    </main>
    );
}