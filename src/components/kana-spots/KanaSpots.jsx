import { CylinderCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "../../store/store";
import { Center, Cylinder, Text3D } from "@react-three/drei";

export const KanaSpots = () => {
  const { level, currentStage, currentKana } = useGameStore((state) => ({
    level: state.level, // Alias
    currentKana: state.currentKana, // Alias
    currentStage: state.currentStage, // Alias
  }));

  if (!level) {
    return null;
  }

  return level[currentStage].map((kana, index) => (
    <group
      key={kana.name}
      rotation-y={(index / level[currentStage].length) * Math.PI * 2}
    >
      <group position-x={3.5} position-z={-3.5}>
        {/* KANA STAGE BLOCK */}
        <RigidBody colliders={false} type="fixed">
          <CylinderCollider args={[1 * 0.5, 1]} />
          <Cylinder args={[1, 1, 1]}>
            <meshStandardMaterial color="snow" />
          </Cylinder>
        </RigidBody>

        {/* 3D KANA CHARACTER */}
        <Center position-y={1.2}>
          <Text3D
            font={"./fonts/DotGothic16_Regular_Hiragana_Katakana_Only.json"}
            size={0.82}
            rotation-y={-(index / level[currentStage].length) * Math.PI * 2}
          >
            {kana.character.hiragana}
            <meshNormalMaterial />
          </Text3D>
        </Center>
      </group>
    </group>
  ));
};
