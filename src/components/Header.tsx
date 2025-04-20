/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router";
import TwitterLoginButton from "./TwitterLoginButton";
import { useLogout, useStartTwitterAuth } from "../api/auth";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useLinkWallet } from "../api/wallet";
import { CustomConnectButton } from "./CustomConnectButton";
import DisconnectTwitterModal from "./DisconnectTwitterModal";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  user: any;
};

export default function Header({ user }: HeaderProps) {
  const logoutMutation = useLogout();
  const twitterAuthMutation = useStartTwitterAuth();
  const { address, isConnected } = useAccount();
  const [previousConnectionState, setPreviousConnectionState] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkWalletMutation = useLinkWallet();

  const handleLogin = () => {
    twitterAuthMutation.mutate();
  };

  useEffect(() => {
    if (
      isConnected &&
      !previousConnectionState &&
      address &&
      user?.authenticated
    ) {
      linkWalletMutation.mutate(address);
    }

    setPreviousConnectionState(isConnected);
  }, [
    isConnected,
    address,
    previousConnectionState,
    linkWalletMutation,
    user?.authenticated,
  ]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="py-4 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center">
          <h1 className="hidden lg:inline text-2xl md:text-3xl font-bold text-[#FA73A0]  font-gluten pt-1 ">
            <Link to="/">Blub Trading Board</Link>
          </h1>
          <img
            src="/blub-logo.png"
            className="lg:hidden rounded-lg w-12 h-12"
          />

          {/* Mobile menu button */}
          <div className="flex gap-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center space-x-4">
              {user?.authenticated ? (
                <div className="flex items-center gap-2 rounded-xl px-4 py-2 neumorphic-button border border-white/20 relative font-nunito font-bold">
                  <div className="flex items-center">
                    {user.profile_image_url && (
                      <img
                        src={user.profile_image_url}
                        alt={user.display_name || user.username}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    )}
                    <span className="font-nunito text-slate-800 font-bold">
                      {user.display_name}
                    </span>
                  </div>
                </div>
              ) : (
                <TwitterLoginButton
                  onLogin={handleLogin}
                  isPending={twitterAuthMutation.isPending}
                />
              )}
            </div>
            {user?.authenticated && <CustomConnectButton />}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mobile-menu-container">
          <div className="mt-4 px-4 py-3 space-y-4  border-t border-gray-200 shadow-lg">
            <div className="flex items-center space-y-3">
              {user?.authenticated && <CustomConnectButton />}
              {user?.authenticated ? (
                <button className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-xl w-full">
                  <div className="flex items-center">
                    {user.profile_image_url && (
                      <img
                        src={user.profile_image_url}
                        alt={user.display_name || user.username}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <span className="font-medium">@{user.username}</span>
                  </div>
                </button>
              ) : (
                <TwitterLoginButton
                  onLogin={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  isPending={twitterAuthMutation.isPending}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {user && (
        <DisconnectTwitterModal
          userImage={user.profile_image_url}
          userName={user.username}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDisconnect={logoutMutation.mutate}
        />
      )}
    </header>
  );
}
