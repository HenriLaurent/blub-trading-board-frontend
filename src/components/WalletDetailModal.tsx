/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  XMarkIcon,
  ClipboardIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
import { useDisconnect } from "wagmi";
import { formatTokenAmount } from "../utils/formatters";

type WalletDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
  tradingData: any[];
  account: any;
  openAccountModal: () => void;
};

export default function WalletDetailModal({
  isOpen,
  onClose,
  walletAddress,
  tradingData,
  account,
}: WalletDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const { disconnect } = useDisconnect();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen || !tradingData) return null;

  // Calculer les totaux
  const totalTradingPoints = tradingData.reduce(
    (total, volume) =>
      total + parseFloat(formatTokenAmount(volume.trading_points, 15)),
    0
  );

  const totalBuyVolume = tradingData.reduce(
    (total, volume) => total + parseFloat(formatTokenAmount(volume.volume_in)),
    0
  );

  const totalSellVolume = tradingData.reduce(
    (total, volume) => total + parseFloat(formatTokenAmount(volume.volume_out)),
    0
  );

  const totalBalance = tradingData.reduce(
    (total, volume) => total + parseFloat(formatTokenAmount(volume.balance)),
    0
  );

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2147483646] p-4 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        ref={modalRef}
        className="relative bg-gray-100 rounded-3xl max-w-[400px] w-full shadow-2xl overflow-hidden animate-fadeIn font-nunito"
        style={{
          animation:
            "fadeIn 150ms ease, slideUp 350ms cubic-bezier(.15,1.15,0.6,1.00)",
        }}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="bg-gray-200 rounded-full p-1 hover:scale-105 duration-200 cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center mb-6 gap-4">
            <div className="bg-[#FA73A0] rounded-full p-3">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L14.5 9.5L20 12L14.5 14.5L12 20L9.5 14.5L4 12L9.5 9.5L12 4Z"
                  fill="white"
                />
              </svg>
            </div>
            <h3 className="text-gray-900 font-black text-lg text-center">
              Trading Statistics
            </h3>
            {walletAddress && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                  {account.displayName}
                </p>
                <button
                  onClick={copyAddress}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ClipboardIcon className="w-4 h-4" />
                </button>
                {copySuccess && (
                  <span className="text-xs text-green-500">Copied!</span>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3">
                <p className="text-gray-500 text-sm">Trading Score</p>
                <p className="text-[#FA73A0] font-bold text-xl">
                  {Math.round(totalTradingPoints).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3">
                <p className="text-gray-500 text-sm">Balance</p>
                <p className="text-gray-800 font-bold text-xl">
                  {totalBalance.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3">
                <p className="text-gray-500 text-sm">Buy Volume</p>
                <p className="text-green-500 font-bold text-xl">
                  {totalBuyVolume.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3">
                <p className="text-gray-500 text-sm">Sell Volume</p>
                <p className="text-red-500 font-bold text-xl">
                  {totalSellVolume.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyAddress}
              className="flex-1 py-2.5 rounded-xl font-medium text-gray-900 text-sm bg-white cursor-pointer flex flex-col items-center hover:bg-gray-50 hover:scale-105 duration-75"
            >
              <ClipboardIcon className="w-4 h-4 text-gray-900" />
              <p className="text-xs font-bold">Copy Address</p>
            </button>
            <button
              onClick={handleDisconnect}
              className="flex-1 py-2.5 rounded-xl font-medium text-gray-900 text-sm bg-white cursor-pointer flex flex-col items-center hover:bg-gray-50 hover:scale-105 duration-75"
            >
              <ArrowRightEndOnRectangleIcon className="w-4 h-4 text-gray-900" />
              <p className="text-xs font-bold">Disconnect</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
