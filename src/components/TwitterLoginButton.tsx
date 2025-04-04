export type TwitterLoginButtonProps = {
  onLogin: () => void;
  isPending: boolean;
};

export default function TwitterLoginButton({
  onLogin,
  isPending,
}: TwitterLoginButtonProps) {
  return (
    <button
      onClick={onLogin}
      disabled={isPending}
      className={`w-full md:w-auto cursor-pointer flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-[#FA73A0] to-[#d85086] text-white px-3 py-2 md:px-4 md:py-3 rounded-xl hover:bg-rose-500 font-bold transition-colors text-sm md:text-base`}
    >
      <svg
        viewBox="0 0 1200 1227"
        className="w-3 h-3 md:w-4 md:h-4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
          fill="white"
        />
      </svg>
      <span>{isPending ? "Connecting..." : "Connect with X"}</span>
    </button>
  );
}
