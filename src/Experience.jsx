import { useEffect } from "react";
import {
  Cylinder,
  MeshReflectorMaterial,
  OrbitControls,
  Text3D,
  Text,
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
import { Perf } from "r3f-perf";

export default function Experience() {
  const { currentKana } = useGameStore((state) => ({
    currentKana: state.currentKana,
  }));

  return (
    <>
      <OrbitControls makeDefault />

      <axesHelper args={[2]} />

      <Perf position="top-left" />

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

      {/* CURRENT CORRECT KANA */}
      {currentKana && (
        <Text position={[0, -0.5, -10]} scale={[1, 1.5, 1]} fontSize={3}>
          {currentKana.name.toUpperCase()}
          <meshBasicMaterial toneMapped={false} color="#227D51" />
        </Text>
      )}

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
        </RigidBody>

        {/* OUTSIDE STAGE, DETECT "AREA OUT" */}
        <RigidBody colliders={false} type="fixed" name="void">
          <CuboidCollider args={[25, 0.5, 25]} position={[0, -2, 0]} sensor />
        </RigidBody>

        {/* CHARACTER */}
        <CharacterController />

        {/* KANA */}
        <KanaSpots />
      </group>
    </>
  );
}
