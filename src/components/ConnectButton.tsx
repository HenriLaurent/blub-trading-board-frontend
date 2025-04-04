import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { useWalletTradingVolumes } from "../api/trading";
import WalletDetailModal from "./WalletDetailModal";
import { formatTokenAmount } from "../utils/formatters";

interface ConnectedButtonProps {
  account: {
    address: string;
    displayName: string;
  };
  chain: {
    unsupported?: boolean;
  };
  openAccountModal: () => void;
  openChainModal: () => void;
}

export default function ConnectedButton({
  account,
  chain,
  openAccountModal,
  openChainModal,
}: ConnectedButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: tradingData } = useWalletTradingVolumes(account.address);

  const totalTradingPoints =
    tradingData?.reduce(
      (total, volume) =>
        total + parseFloat(formatTokenAmount(volume.trading_points, 15)),
      0
    ) || 0;

  const formattedTradingScore = Math.round(totalTradingPoints).toLocaleString();

  if (chain.unsupported) {
    return (
      <button
        onClick={openChainModal}
        type="button"
        className="bg-yellow-500 px-3 py-2 rounded-xl text-white font-medium text-sm md:text-base"
      >
        Wrong network
      </button>
    );
  }

  if (tradingData && tradingData.length > 0) {
    return (
      <>
        <button
          className="bg-gradient-to-r from-[#FA73A0] to-[#d85086] px-3 py-2 md:px-4 md:py-3 rounded-xl text-white font-bold cursor-pointer hover:bg-rose-500 duration-200 inline-flex items-center gap-1 md:gap-2 font-nunito text-sm md:text-base"
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="md:w-5 md:h-5"
          >
            <path
              d="M12 4L14.5 9.5L20 12L14.5 14.5L12 20L9.5 14.5L4 12L9.5 9.5L12 4Z"
              fill="currentColor"
            />
          </svg>
          <span>{formattedTradingScore} pts</span>
        </button>

        <WalletDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          walletAddress={account.address}
          tradingData={tradingData}
          account={account}
          openAccountModal={openAccountModal}
        />
      </>
    );
  }

  return (
    <button
      className="bg-gradient-to-r from-[#FA73A0] to-[#d85086] px-3 py-2 md:px-4 md:py-3 rounded-xl text-white font-bold cursor-pointer hover:bg-rose-500 duration-200 inline-flex items-center gap-1 md:gap-2 font-nunito text-sm md:text-base"
      onClick={openAccountModal}
      type="button"
    >
      <span className="truncate max-w-[80px] md:max-w-full">
        {account.displayName}
      </span>
      <ChevronDownIcon className="text-white w-4 h-4 md:w-6 md:h-6" />
    </button>
  );
}
