import { useEffect } from "react";
import {
  Cylinder,
  MeshReflectorMaterial,
  OrbitControls,
  Text3D,
  Text,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
} from "@react-three/rapier";
import { useGameStore } from "./store/store.js";
import { KanaSpots } from "./components/kana-spots/KanaSpots.jsx";
import { CharacterController } from "./components/character/CharacterController.jsx";
import { AxesHelper } from "three";
import { Perf } from "r3f-perf";
import { Kicker } from "./components/kicker/Kicker.jsx";
import Stage from "./components/stage/Stage.jsx";

export default function Experience() {
  const { currentKana, lastWrongKana } = useGameStore((state) => ({
    currentKana: state.currentKana,
    lastWrongKana: state.lastWrongKana,
  }));

  const { currentStage } = useGameStore((state) => ({
    currentStage: state.currentStage,
  }));

  return (
    <>
      <OrbitControls makeDefault />

      {/* <axesHelper args={[2]} /> */}

      <Perf position="top-left" />

      {/* LIGHTS */}
      <Environment preset="sunset" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.3}
        castShadow
        color={"#9e69da"}
      />

      {/* CURRENT CORRECT KANA */}
      {currentKana && (
        <Text
          position={[0, -0.92, 0]}
          fontSize={1.84}
          rotation-x={-Math.PI / 2}
          font="./fonts/PixelCowboy.ttf"
        >
          {currentKana.name.toUpperCase()}
          <meshStandardMaterial toneMapped={true} color="snow" />
        </Text>
      )}

      {/* WRONGLY ANSWERED KANA */}
      {lastWrongKana && (
        <Text
          position={[0, -0.92, 1.8]}
          fontSize={1}
          rotation-x={-Math.PI / 2}
          font="./fonts/PixelCowboy.ttf"
        >
          {lastWrongKana.name.toUpperCase()}
          <meshStandardMaterial
            toneMapped={true}
            color="crimson"
            transparent={true}
          />
        </Text>
      )}

      <group position-y={-1}>
        {/* KICKER */}
        {currentStage >= 2 && <Kicker />}

        {/* FLOOR */}
        <RigidBody colliders={false} type="fixed" name="void">
          <mesh
            scale={[50, 50, 1]}
            position={[0, -0.9, 0]}
            rotation={[-Math.PI * 0.5, 0, 0]}
          >
            <planeGeometry />
            <MeshReflectorMaterial
              resolution={512}
              blur={[400, 400]}
              mixBlur={0.5}
              mirror={[0.85]}
              color="#81C7D4"
              mixStrength={2}
              depthScale={1}
              minDepthThreshold={0.85}
              metalness={0.5}
              roughness={0.8}
            />
          </mesh>
          <CuboidCollider args={[25, 0.5, 25]} position={[0, -2, 0]} sensor />
        </RigidBody>

        <ContactShadows
          frames={1}
          position={[0, -0.88, 0]}
          scale={80}
          opacity={0.42}
          far={50}
          blur={0.8}
          color={"#aa9acd"}
        />

        {/* STAGE */}
        <Stage position-y={-0.92} />

        <RigidBody
          colliders={false}
          type="fixed"
          position-y={-0.5}
          friction={1}
        >
          <CylinderCollider args={[0.5, 5]} />
        </RigidBody>

        {/* CHARACTER */}
        <CharacterController />

        {/* KANA */}
        <KanaSpots />
      </group>
    </>
  );
}
