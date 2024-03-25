import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useGameStore } from "../../store/store";

export default function Character(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    "./models/female-cyborg/model.gltf"
  );

  // Idle, JumpAnimation, RunAnimation
  const { actions } = useAnimations(animations, group);

  // Import the character state
  const characterState = useGameStore((state) => state.characterState);

  // console.log(characterState)
  console.log(actions)

  useEffect(() => {
    actions[characterState].reset().fadeIn(0.01).play();

    return () => {
      actions[characterState].fadeOut(0.1);
    }

  }, [characterState])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="MyCharacter" scale={0.64}>
          <primitive object={nodes.LeftFootCtrl} />
          <primitive object={nodes.RightFootCtrl} />
          <primitive object={nodes.HipsCtrl} />
          <skinnedMesh
            name="characterMedium"
            geometry={nodes.characterMedium.geometry}
            material={materials["skin.001"]}
            skeleton={nodes.characterMedium.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./models/female-cyborg/model.gltf");

