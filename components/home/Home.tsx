import Link from "next/link"
import React from "react"

type HomeProps = {}

const HomeC: React.FC<HomeProps> = () => {
  return (
    <div className="relative flex h-full w-full snap-y snap-mandatory flex-col items-center justify-start px-[20%]">
      <div className="flex min-h-screen w-full flex-col items-center justify-center text-center font-semibold text-[5rem] leading-[10rem]">
        Welcome to the{" "}
        <span className="-m-[2rem] animate-gradient bg-300% bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 bg-clip-text font-bold text-[8rem] text-transparent">
          Paradox AI
        </span>
        <div className="mt-[4rem] flex w-full items-center justify-center ">
          <Link
            href={"/chat"}
            className="flex min-w-fit rounded-full bg-blue-900 px-[4%] py-[2%] text-2xl transition-colors duration-300 ease-in-out hover:bg-blue-700"
          >
            Let's Chat
          </Link>
        </div>
      </div>
      <div className="flex min-h-screen w-full flex-col items-center justify-center text-center font-semibold text-[2rem]">
        <p>
          <span
            className="  bg-gradient-to-r from-orange-700 via-blue-500
					 to-green-400 text-transparent bg-clip-text bg-300% animate-gradient"
          >
            Paradox AI
          </span>{" "}
          - aggregates YouTube videos, PDFs, images, and documents based on
          keywords, providing relevant links and timestamps for efficient
          exploration.
        </p>
        <div className="flex items-center justify-center w-full my-10">
          <Link
            href={"/medical-report"}
            className="flex bg-blue-900 rounded-full px-[4%] py-[2%] text-2xl min-w-fit hover:bg-blue-700 transition-colors ease-in-out duration-300"
          >
            Explore Now
          </Link>
        </div>
      </div>
    </div>
  )
}
export default HomeC
