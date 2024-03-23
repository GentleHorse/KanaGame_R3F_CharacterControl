import { useGameStore } from "../../store/store";

export const Menu = () => {
  const { startGame } = useGameStore((state) => ({
    startGame: state.startGame,
  }));

  return (
    <>
      <div className="fixed flex flex-col gap-[16px] justify-center items-center left-0 top-0 w-full h-full bg-slate-950/40 backdrop-blur-sm">
        <h1 className="font-permanent-marker text-4xl text-amber-100">
          Kana game
        </h1>
        <button
          className="font-permanent-marker text-xl bg-slate-50/60 py-4 px-8 border-none rounded-xl text-md transition ease-in-out delay-40 hover:bg-white hover:cursor-pointer"
          onClick={() => startGame({ mode: "hiragana" })}
        >
          Start hiragana game
        </button>
        <button
          className="font-permanent-marker text-xl bg-slate-50/60 py-4 px-8 border-none rounded-xl text-md transition ease-in-out delay-40 hover:bg-white hover:cursor-pointer"
          onClick={() => startGame({ mode: "katakana" })}
        >
          Start katakana game
        </button>
      </div>
    </>
  );
};
