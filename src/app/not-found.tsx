import Link from "next/link"

const notfound = ()=> {
  return (
    <section className="w-screen h-screen flex flex-col items-center justify-center text-center ">
      <h1 className="text-3xl font-bold capitalize">404 Not found</h1>
      <Link href="/" className="mt-5 hover:underline underline-offset-1">Return Home</Link>
    </section>
  )
}

export default notfound