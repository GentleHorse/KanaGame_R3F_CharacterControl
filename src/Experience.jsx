import { useEffect } from "react";
import {
  Cylinder,
  MeshReflectorMaterial,
  OrbitControls,
  Text3D,
} from "@react-three/drei";
import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
} from "@react-three/rapier";
import JapaneseTorii from "./components/japanese-torii/JapaneseTorii";
import { useGameStore } from "./store/store.js";
import { KanaSpots } from "./components/kana-spots/KanaSpots.jsx";
import { CharacterController } from "./components/character/CharacterController.jsx";
import { AxesHelper } from "three";

export default function Experience() {
  /**
   * SET UP THE INITIAL STAGE ENVIRONMENT
   */
  const startGame = useGameStore((state) => state.startGame);

  useEffect(() => {
    startGame();
  }, []);

  return (
    <>
      <OrbitControls makeDefault />

      <axesHelper args={[2]} />

      {/* LIGHTS */}
      <ambientLight intensity={1} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        color={"#9e69da"}
      />

      {/* BACKGROUND */}
      <mesh
        scale={[50, 50, 1]}
        position={[0, -1.5, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        <planeGeometry />
        <MeshReflectorMaterial
          resolution={512}
          blur={[400, 400]}
          mixBlur={0.5}
          mirror={[0.85]}
          color="#81C7D4"
        />
      </mesh>
      <JapaneseTorii scale={[2, 2, 2]} position={[0, 2.5, -10]} />

      <group position-y={-1}>
        {/* STAGE */}
        <RigidBody
          colliders={false}
          type="fixed"
          position-y={-0.5}
          friction={1}
        >
          <CylinderCollider args={[0.5, 5]} />
          <Cylinder scale={[5, 1, 5]} receiveShadow>
            <meshStandardMaterial color="snow" />
          </Cylinder>
          <CuboidCollider args={[25, 0.5, 25]} position={[0, -0.5, 0]} />
        </RigidBody>

        {/* CHARACTER */}
        <CharacterController />

        {/* KANA */}
        <KanaSpots />
      </group>
    </>
  );
}
