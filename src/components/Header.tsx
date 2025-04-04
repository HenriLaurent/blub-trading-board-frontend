/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router";
import TwitterLoginButton from "./TwitterLoginButton";
import { useLogout, useStartTwitterAuth } from "../api/auth";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useLinkWallet } from "../api/wallet";
import { CustomConnectButton } from "./CustomConnectButton";
import DisconnectTwitterModal from "./DisconnectTwitterModal";

type HeaderProps = {
  user: any;
};

export default function Header({ user }: HeaderProps) {
  const logoutMutation = useLogout();
  const twitterAuthMutation = useStartTwitterAuth();
  const { address, isConnected } = useAccount();
  const [previousConnectionState, setPreviousConnectionState] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <header className="bg-white shadow-md py-4 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#FA73A0] font-gluten">
            <Link to="/">Blub Trading Board</Link>
          </h1>
          <div className="flex items-center gap-4">
            <CustomConnectButton />
            <div className="flex items-center space-x-4">
              {user?.authenticated ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer hover:bg-gray-100  px-4 py-2 rounded-xl"
                >
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
                  onLogin={handleLogin}
                  isPending={twitterAuthMutation.isPending}
                />
              )}
            </div>
          </div>
        </div>
      </div>
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
