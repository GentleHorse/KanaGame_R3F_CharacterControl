import { create } from "zustand";
import { kanas } from "../utils/constants.js";

/**
 *  LEVEL & STAGE GENERATION LOGIC
 *
 * @param {int} nbStage the number of stages
 * @param {array} level the array containing stages
 * @param {array} stage the array containing "kana" objects
 * @param {object} kana an object containing name, character, etc
 * @param {int} nbOptions the number of "kana" objects
 *
 * @returns the array of stages named "level" 
 *          [
 *            [{ .... }, { .... }, { .... }, { .... }],   // stage array
 *            [{ .... }, { .... }, { .... }, { .... }],
 *            
 *            .....
 *          ]
 */
export const generateGameLevel = ({ nbStage }) => {
  const level = [];

  for (let i = 0; i < nbStage; i++) {
    const stage = [];
    const nbOptions = 3 + 1;

    // Randomly added "kana" objects from "kanas" object array
    for (let j = 0; j < nbOptions; j++) {
      let kana = null;

      // Find "kana" which is not already added to the stage array
      while (!kana || stage.includes(kana)) {
        kana = kanas[Math.floor(Math.random() * kanas.length)];
      }

      stage.push(kana);
    }

    // Randomly add "correct" property to one of "kana" objects
    stage[Math.floor(Math.random() * stage.length)].correct = true;

    level.push(stage);
  }

  return level;
};

/**
 * CREATE A GAME HOOK WITH ZUSTAND
 *
 * @function create() create a game hook
 * @function set() merges states
 */
export const useGameStore = create((set) => ({
  // These are states managed by zustand
  level: null,
  currentStage: 0,
  currentKana: null,
  mode: "hiragana",

  startGame: () => {
    const level = generateGameLevel({ nbStage: 5 });
    const currentKana = level[0].find((kana) => kana.correct);

    set({ level: level, currentStage: 0, currentKana: currentKana });
  },

  nextStage: () => {
    set((state) => {
      const currentStage = state.currentStage + 1;
      const currentKana = state.level[currentStage].find(
        (kana) => kana.correct
      );

      return { currentStage: currentStage, currentKana: currentKana };
    });
  },
}));
