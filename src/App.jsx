import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

import Experience from "./Experience.jsx";
import Header from "./components/header/Header.jsx";
import { Physics } from "@react-three/rapier";
import { generateGameLevel } from "./components/store/store.js";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
