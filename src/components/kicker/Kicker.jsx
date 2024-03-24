import { useRef } from "react";
import * as THREE from "three";
import { RigidBody, quat } from "@react-three/rapier";
import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gameStates, useGameStore } from "../../store/store";

export const Kicker = () => {
  const kicker = useRef();

  const { gameState, currentStage } = useGameStore((state) => ({
    gameState: state.gameState,
    currentStage: state.currentStage,
  }));

  useFrame((_state, delta) => {
    if (!kicker.current) {
      return;
    }

    const curRotation = quat(kicker.current.rotation());
    const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      delta * 8
    );

    curRotation.multiply(incrementRotation);
    kicker.current.setNextKinematicRotation(curRotation);
  });

  /**
   * cf. CAUTION - IF STATEMENT
   * 
   * - NO "if" statements before a hook
   * - A hook must not be invoked inside the body of an "if", "else", "for" or "while" statement
   */
  if (gameState !== gameStates.GAME || currentStage < 2) {
    return null;
  }

  return (
    <RigidBody ref={kicker} type="kinematicPosition" position={[0, 0.1, 0]}>
      <group position={[3, 0, 0]}>
        <Box args={[1.5, 0.2, 0.2]}>
          <meshStandardMaterial color={"mediumpurple"} />
        </Box>
      </group>
    </RigidBody>
  );
};

// import { Box } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { RigidBody, quat } from "@react-three/rapier";
// import { useRef } from "react";
// import * as THREE from "three";
// import { gameStates, useGameStore } from "../../store/store.js";

// export const Kicker = () => {
//   const kicker = useRef();

// //   const { gameState, currentStage } = useGameStore((state) => ({
// //     gameState: state.gameState,
// //     currentStage: state.currentStage,
// //   }));

//     const { gameState, currentStage } = useGameStore((state) => ({
//     gameState: state.gameState,
//     currentStage: state.currentStage,
//   }));

// //   if (gameState !== gameStates.GAME || currentStage < 2) {
// //     return null;
// //   }

//   useFrame((_state, delta) => {
//     if (!kicker.current) {
//       return;
//     }
//     const curRotation = quat(kicker.current.rotation());
//     const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
//       new THREE.Vector3(0, 1, 0),
//       delta * 8
//     );
//     curRotation.multiply(incrementRotation);
//     kicker.current.setNextKinematicRotation(curRotation);
//   });

//   if (gameState !== gameStates.GAME || currentStage < 2) {
//     return null;
//   }

//   return (
//     <RigidBody type="kinematicPosition" position={[0, 0.1, 0]} ref={kicker}>
//       <group position={[3, 0, 0]}>
//         <Box args={[1.5, 0.2, 0.2]}>
//           <meshStandardMaterial color={"mediumpurple"} />
//         </Box>
//       </group>
//     </RigidBody>
//   );
// };
