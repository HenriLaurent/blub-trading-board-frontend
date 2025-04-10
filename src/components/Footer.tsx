import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 text-center text-gray-600 text-sm">
      Made by{" "}
      <a
        href="https://twitter.com/0xOveroose"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#FA73A0] hover:text-[#FA73A0]"
      >
        @0xOveroose
      </a>{" "}
      &{" "}
      <a
        href="https://twitter.com/H"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#FA73A0] hover:text-[#FA73A0]"
      >
        @H
      </a>
    </footer>
  );
};

export default Footer;
