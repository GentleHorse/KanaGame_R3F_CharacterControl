import { CylinderCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "../../store/store";
import { Center, Cylinder, Sphere, Text3D } from "@react-three/drei";
import { useControls } from "leva";

export const KanaSpots = () => {
  /**
   * IMPORT STATES & FUNCTIONS FROM USEGAMESTORE
   */
  const { level, currentStage, kanaTouched, mode } = useGameStore((state) => ({
    level: state.level, // Alias
    kanaTouched: state.kanaTouched, // Alias
    currentStage: state.currentStage, // Alias
    mode: state.mode, // Alias
  }));

  /**
   * GUI - GLASS LIKE SPHERE MATERIAL
   */
  const config = useControls({
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: { value: 10, min: 1, max: 32, step: 1 },
    resolution: { value: 1024, min: 256, max: 2048, step: 256 },
    transmission: { value: 1, min: 0, max: 1 },
    roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
    thickness: { value: 0, min: 0, max: 10, step: 0.01 },
    ior: { value: 1, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0, min: 0, max: 1 },
    anisotropy: { value: 0, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    attenuationDistance: { value: 1, min: 0, max: 10, step: 0.01 },
    attenuationColor: "#ffffff",
    color: "#80d6ff",
    bg: "#ffffff",
  });

  /**
   * FAIL SAFE
   */
  if (!level) {
    return null;
  }

  return level[currentStage].map((kana, index) => (
    <group
      key={`${currentStage}-${kana.name}`}
      rotation-y={(index / level[currentStage].length) * Math.PI * 2}
    >
      <group position-x={3.5} position-z={-3.5}>
        {/* KANA STAGE BLOCK */}
        <RigidBody
          colliders={false}
          type="fixed"
          onCollisionEnter={() => {
            kanaTouched(kana);
          }}
        >
          <CylinderCollider args={[0.25, 1]} />
          <Cylinder args={[1, 1, 0.5]}>
            <meshPhysicalMaterial {...config} />
          </Cylinder>
        </RigidBody>

        {/* GLASS LIKE SPHERE */}
        <Sphere scale={[1.22, 1.22, 1.22]} position={[0, 0.8, 0]}>
          <meshPhysicalMaterial {...config} />
        </Sphere>

        {/* 3D KANA CHARACTER */}
        <Center position-y={1.2}>
          <Text3D
            font={"./fonts/DotGothic16_Regular_Hiragana_Katakana_Only.json"}
            size={0.82}
            rotation-y={-(index / level[currentStage].length) * Math.PI * 2}
          >
            {mode === "hiragana"
              ? kana.character.hiragana
              : kana.character.katakana}
            <meshNormalMaterial toneMapped={false} />
          </Text3D>
        </Center>
      </group>
    </group>
  ));
};
