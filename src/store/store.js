import { create } from "zustand";
import { kanas } from "../utils/constants.js";
import { subscribeWithSelector } from "zustand/middleware";

/**
 *  GAME STATES
 */
export const gameStates = {
  MENU: "MENU",
  GAME: "GAME",
  GAME_OVER: "GAME_OVER",
};

/**
 * PLAY AUDIO
 */
export const playAudio = (path, callback) => {
  const audio = new Audio(`./sounds/${path}.mp3`);

  if (callback) {
    audio.addEventListener("ended", callback);
  }

  audio.play();
};

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
  const goodKanas = [];

  for (let i = 0; i < nbStage; i++) {
    const stage = [];
    const nbOptions = 3 + i;

    // Randomly added "kana" objects from "kanas" object array
    for (let j = 0; j < nbOptions; j++) {
      let kana = null;

      // Find "kana" which is not already added to the "stage" & "goodKanas" array
      while (!kana || stage.includes(kana) || goodKanas.includes(kana)) {
        kana = kanas[Math.floor(Math.random() * kanas.length)];
      }

      stage.push(kana);
    }

    // Randomly add "correct" property to one of "kana" objects, added to "goodKanas"
    const goodKana = stage[Math.floor(Math.random() * stage.length)];
    goodKana.correct = true;
    goodKanas.push(goodKana);

    // Add a stage to the level array
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
export const useGameStore = create(
  subscribeWithSelector((set, get) => ({
    // These are states managed by zustand
    level: null,
    currentStage: 0,
    currentKana: null,
    lastWrongKana: null,
    mode: "hiragana",
    gameState: gameStates.MENU,
    wrongAnswers: 0,

    startGame: ({ mode: mode }) => {
      const level = generateGameLevel({ nbStage: 4 });
      const currentKana = level[0].find((kana) => kana.correct);

      // Audio
      // 1. Play the "start" sound
      // 2. After 1, play the "currentKana" sound
      playAudio("start", () => {
        playAudio(`kanas/${currentKana.name}`);
      });

      set({
        level: level,
        currentStage: 0,
        currentKana: currentKana,
        gameState: gameStates.GAME,
        mode: mode,
        wrongAnswers: 0,
      });
    },

    nextStage: () => {
      set((state) => {
        // If the player clear the stage
        if (state.currentStage + 1 === state.level.length) {
          playAudio("congratulations");

          return {
            currentStage: 0,
            currentKana: null,
            level: null,
            gameState: gameStates.GAME_OVER,
            lastWrongKana: null,
          };
        }

        const currentStage = state.currentStage + 1;
        const currentKana = state.level[currentStage].find(
          (kana) => kana.correct
        );

        // Audio
        // 0. Play SFX ("good")
        // 1. Play the "That's correct!" sound
        // 2. Play the "currentKana" sound
        playAudio("good");
        playAudio(`correct${currentStage % 3}`, () => {
          playAudio(`kanas/${currentKana.name}`);
        });

        return {
          currentStage: currentStage,
          currentKana: currentKana,
          lastWrongKana: null,
        };
      });
    },

    goToMenu: () => {
      set({ gameState: gameStates.MENU });
    },

    kanaTouched: (kana) => {
      const currentKana = get().currentKana; // Access to the "currentKana" state

      if (currentKana.name === kana.name) {
        get().nextStage(); // Access to the "nextStage" functioin
      } else {
        // Audio
        // 0. Play SFX ("wrong")
        // 1. Play the "kana" sound the character touched
        // 1. Play the "That's incorrect!" sound
        playAudio("wrong");
        playAudio(`kanas/${kana.name}`, () => {
          playAudio("fail");
        });

        set((state) => ({
          wrongAnswers: state.wrongAnswers + 1,
          lastWrongKana: kana,
        }));
      }
    },
  }))
);
