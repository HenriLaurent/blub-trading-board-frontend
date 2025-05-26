/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  XMarkIcon,
  ClipboardIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
import { formatTokenAmount } from "../utils/formatters";
import { useLogout } from "../api/auth";

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

  const logoutMutation = useLogout();

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
    logoutMutation.mutate();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2147483646] p-4 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="grain" />
      <div
        ref={modalRef}
        className="relative bg-[#ecd4df] dark:bg-slate-800 rounded-3xl max-w-[400px] w-full shadow-2xl overflow-hidden animate-fadeIn font-nunito "
        style={{
          animation:
            "fadeIn 150ms ease, slideUp 350ms cubic-bezier(.15,1.15,0.6,1.00)",
        }}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-2 neumorphic-button border border-white/20 text-slate-800 relative"
          >
            <XMarkIcon className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center mb-6 gap-4">
            <img src="/blub-logo.png" className=" rounded-lg w-12 h-12" />
            <h3 className="text-slate-800 dark:text-slate-300 font-black text-lg text-center">
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

          <div className="rounded-2xl backdrop-blur-sm p-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] dark:shadow-none border border-white/20 bg-black/2 relative overflow-hidden mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3">
                <p className="text-gray-500 text-sm">Trading Score</p>
                <p className="text-[#FA73A0] font-bold text-xl">
                  {Math.round(totalTradingPoints).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3">
                <p className="text-gray-500 text-sm">Balance</p>
                <p className="text-slate-800 font-bold text-xl dark:text-slate-300">
                  {totalBalance.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3">
                <p className="text-gray-500 text-sm">Volume In</p>
                <p className="text-green-500 font-bold text-xl">
                  {totalBuyVolume.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3">
                <p className="text-gray-500 text-sm">Volume Out</p>
                <p className="text-red-500 font-bold text-xl">
                  {totalSellVolume.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyAddress}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 text-slate-800 relative overflow-hidden font-nunito font-bold"
            >
              <ClipboardIcon className="w-4 h-4 text-gray-900" />
              <p className="text-xs font-bold">Copy Address</p>
            </button>
            <button
              onClick={handleDisconnect}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 text-slate-800 relative overflow-hidden font-nunito font-bold"
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
