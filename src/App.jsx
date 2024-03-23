import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";

import Experience from "./Experience.jsx";
import Header from "./components/header/Header.jsx";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";

export const Controls = {
  forward: "forward",
  backward: "backward",
  leftward: "leftward",
  rightward: "rightward",
  jump: "jump",
};

function App() {
  const map = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.leftward, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.rightward, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.jump, keys: ["Space"] },
  ], []);

  return (
    <>
      <KeyboardControls map={map}>

        <Header />
        
        <Canvas
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [0, 6, 14],
          }}
        >
          <color attach="background" args={["snow"]} />
          <fog attach="fog" args={["snow", 20, 40]} />
          <Suspense>
            <Physics debug>
              <Experience />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default App;
