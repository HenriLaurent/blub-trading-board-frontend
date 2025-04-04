import { WalletIcon } from "@heroicons/react/16/solid";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ConnectedButton from "./ConnectButton";

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            className="w-full md:w-auto"
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                className="w-full md:w-auto bg-gradient-to-r from-[#FA73A0] to-[#d85086] px-3 py-2 md:px-4 md:py-3 rounded-xl text-white font-bold cursor-pointer hover:bg-rose-500 duration-200 inline-flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base"
                type="button"
              >
                <WalletIcon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                <span>Connect Wallet</span>
              </button>
            ) : (
              <ConnectedButton
                account={account}
                chain={chain}
                openAccountModal={openAccountModal}
                openChainModal={openChainModal}
              />
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
