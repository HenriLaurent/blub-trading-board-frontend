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
      ,{" "}
      <a
        href="https://twitter.com/Paps0x"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#FA73A0] hover:text-[#FA73A0]"
      >
        @Paps0x
      </a>
      &{" "}
      <a
        href="https://twitter.com/HenriLaurentDev"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#FA73A0] hover:text-[#FA73A0]"
      >
        @HenriLaurentDev
      </a>
    </footer>
  );
};

export default Footer;
