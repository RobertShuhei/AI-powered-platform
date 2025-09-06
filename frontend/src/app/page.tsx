export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">
          AI Tour Guide Matcher
        </h1>
      </div>
      
      <div className="relative flex place-items-center">
        <p className="text-center text-lg">
          Connect travelers with local personal tour guides
        </p>
      </div>
      
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300">
          <h2 className="mb-3 text-2xl font-semibold">
            Find Guides
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Discover unique local experiences with verified tour guides
          </p>
        </div>
        
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300">
          <h2 className="mb-3 text-2xl font-semibold">
            Become a Guide
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Share your local knowledge and earn by guiding travelers
          </p>
        </div>
      </div>
    </main>
  )
}