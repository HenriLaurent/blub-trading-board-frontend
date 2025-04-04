import { ChevronDownIcon, WalletIcon } from "@heroicons/react/16/solid";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="bg-[#FA73A0] px-4 py-3 rounded-xl text-white font-bold cursor-pointer hover:bg-rose-500 duration-200 inline-flex items-center gap-2"
                    type="button"
                  >
                    <WalletIcon className="w-6 h-6 text-white" />
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <button
                  className="bg-[#FA73A0] px-4 py-3 rounded-xl text-white font-bold cursor-pointer hover:bg-rose-500 duration-200 inline-flex items-center gap-2 font-nunito"
                  onClick={openAccountModal}
                  type="button"
                >
                  {account.displayName}
                  <ChevronDownIcon className="text-white w-6 h-6" />
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
