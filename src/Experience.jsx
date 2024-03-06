import { useEffect } from "react";
import {
  Cylinder,
  MeshReflectorMaterial,
  OrbitControls,
  Text3D,
} from "@react-three/drei";
import { CylinderCollider, RigidBody } from "@react-three/rapier";
import JapaneseTorii from "./components/japanese-torii/JapaneseTorii";
import { kanas } from "./components/utils/constants.js";
import { useGameStore } from "./components/store/store.js";

export default function Experience() {

  /**
   * USE THE GAME HOOK
   */
  const startGame = useGameStore((state) => state.startGame);

  useEffect(() => {
    startGame();
  }, []);

  return (
    <>
      <OrbitControls makeDefault />

      {/* LIGHTS */}
      <ambientLight intensity={1} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        color={"#9e69da"}
      />

      {/* BACKGROUND */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[50, 50]} />
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
        <RigidBody colliders={false} type="fixed" position-y={-0.5}>
          <CylinderCollider args={[0.5, 5]} />
          <Cylinder scale={[5, 1, 5]} receiveShadow>
            <meshStandardMaterial color="snow" />
          </Cylinder>
        </RigidBody>

        {/* KANA */}
        <Text3D
          font={"./fonts/DotGothic16_Regular_Hiragana_Katakana_Only.json"}
        >
          {kanas[0].character.hiragana}
          <meshNormalMaterial />
        </Text3D>
      </group>
    </>
  );
}
