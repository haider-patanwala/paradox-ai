import React from "react"

type FooterProps = {}

const Footer: React.FC<FooterProps> = () => (
  <footer className="flex items-center justify-center w-full my-2 ">
    <p>
      Built with ❤️ by Team{" "}
      <span className=" bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text bg-300% animate-gradient">
        Paradox
      </span>
    </p>
  </footer>
)

export default Footer
