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
                className="flex gap-2 rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 bg-black/2 relative overflow-hidden"
                type="button"
              >
                <WalletIcon className="w-4 h-4 md:w-6 md:h-6 text-slate-800" />
                <span className="text-slate-800 dark:font-bold font-nunito">
                  Connect Wallet
                </span>
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
