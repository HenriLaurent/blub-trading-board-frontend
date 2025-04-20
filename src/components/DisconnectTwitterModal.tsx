import { ArrowUturnLeftIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef } from "react";

export type DisconnectModalProps = {
  userImage: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onDisconnect: () => void;
};

export default function DisconnectTwitterModal({
  userImage,
  userName,
  isOpen,
  onClose,
  onDisconnect,
}: DisconnectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

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
        className="relative bg-[#ecd4df] rounded-3xl max-w-[360px] w-full shadow-2xl overflow-hidden animate-fadeIn font-nunito"
        style={{
          animation:
            "fadeIn 150ms ease, slideUp 350ms cubic-bezier(.15,1.15,0.6,1.00)",
        }}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 text-slate-800 relative overflow-hidden"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center mb-6 gap-4">
            <img
              src={userImage}
              className="rounded-full w-16 h-16"
              alt={userName}
            />
            <p className="text-gray-900 font-black text-lg text-center">
              @{userName}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 text-slate-800 relative overflow-hidden font-nunito font-bold"
            >
              <ArrowUturnLeftIcon className="w-4 h-4 text-gray-900" />
              <p className="text-xs font-bold">Cancel</p>
            </button>
            <button
              onClick={onDisconnect}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl backdrop-blur-sm px-4 py-2 neumorphic-button border border-white/20 text-slate-800 relative overflow-hidden font-nunito font-bold"
            >
              <svg
                fill="none"
                height={16}
                width={18}
                viewBox="0 0 18 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Disconnect</title>
                <path
                  className="w-4 h-4"
                  d="M2.67834 15.5908H9.99963C11.5514 15.5908 12.399 14.7432 12.399 13.1777V10.2656H10.6354V12.9863C10.6354 13.5332 10.3688 13.8271 9.78772 13.8271H2.89026C2.3092 13.8271 2.0426 13.5332 2.0426 12.9863V3.15625C2.0426 2.60254 2.3092 2.30859 2.89026 2.30859H9.78772C10.3688 2.30859 10.6354 2.60254 10.6354 3.15625V5.89746H12.399V2.95801C12.399 1.39941 11.5514 0.544922 9.99963 0.544922H2.67834C1.12659 0.544922 0.278931 1.39941 0.278931 2.95801V13.1777C0.278931 14.7432 1.12659 15.5908 2.67834 15.5908ZM7.43616 8.85059H14.0875L15.0924 8.78906L14.566 9.14453L13.6842 9.96484C13.5406 10.1016 13.4586 10.2861 13.4586 10.4844C13.4586 10.8398 13.7321 11.168 14.1217 11.168C14.3199 11.168 14.4635 11.0928 14.6002 10.9561L16.7809 8.68652C16.986 8.48145 17.0543 8.27637 17.0543 8.06445C17.0543 7.85254 16.986 7.64746 16.7809 7.43555L14.6002 5.17285C14.4635 5.03613 14.3199 4.9541 14.1217 4.9541C13.7321 4.9541 13.4586 5.27539 13.4586 5.6377C13.4586 5.83594 13.5406 6.02734 13.6842 6.15723L14.566 6.98438L15.0924 7.33984L14.0875 7.27148H7.43616C7.01917 7.27148 6.65686 7.62012 6.65686 8.06445C6.65686 8.50195 7.01917 8.85059 7.43616 8.85059Z"
                  fill="currentColor"
                ></path>
              </svg>
              <p className="text-xs font-bold">Disconnect</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
