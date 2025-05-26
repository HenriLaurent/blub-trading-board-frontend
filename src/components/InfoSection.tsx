import { useState } from "react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function InfoSection() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <InformationCircleIcon className="h-4 w-4" />
          Show how it works
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl backdrop-blur-sm p-6 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] dark:shadow-none border border-white/20 bg-black/2  dark:from-blue-950/20 dark:to-purple-950/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/2 to-transparent pointer-events-none"></div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors z-10"
      >
        <XMarkIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </button>

      <div className="relative space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            How the Blub Board Works
          </h3>
        </div>

        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0"></div>
            <p>
              The Blub Board calculates your trading score based on the volume
              of tokens entering and leaving your wallet.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink dark:bg-orange-400 flex-shrink-0"></div>
            <p>
              There is a{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                10% penalty
              </span>{" "}
              on the volume withdrawn. For example, 1,000 blub deposited or
              swapped to another wallet results in a 1,100-point deduction from
              your trading score.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
                Blub Reserve NFTs grant bonus points:
              </p>
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💍</span>
                  <span>
                    A Ring or Gold NFT awards{" "}
                    <span className="font-semibold">20,000 points</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🟣</span>
                  <span>
                    A Blob NFT awards{" "}
                    <span className="font-semibold">3,000 points</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 flex-shrink-0"></div>
            <p>
              Bonus points are cumulative, and there is no penalty on outgoing
              volume for these.
            </p>
          </div>

          <div className="mt-4 p-3 bg-black/4 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <p className="text-center font-medium text-slate-800 dark:text-slate-200">
              🎯 The trading board ranking will offer benefits on upcoming Blub
              products. Happy trading!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
