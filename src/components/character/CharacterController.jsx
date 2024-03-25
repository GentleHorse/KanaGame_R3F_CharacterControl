import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import Character from "./Character.jsx";
import { useGameStore, playAudio } from "../../store/store.js";

const JUMP_FORCE = 0.8;
const JUMP_ACTIVATE_HIGHT = 3;
const MOVEMENT_SPEED = 2;
const MAX_VEL = 3;
const RUN_VEL = 1.5;

export const CharacterController = () => {
  /**
   * REF
   */
  const body = useRef(); // RigidBody
  const character = useRef(); // Character mesh

  /**
   * CHARACTER STATE
   */
  const { characterState, setCharacterState } = useGameStore((state) => ({
    characterState: state.characterState,
    setCharacterState: state.setCharacterState,
  }));

  /**
   * SET UP KEYBOARD CONTROLS
   */
  const [subscribeKeys, getKeys] = useKeyboardControls();

  /**
   * MAKE THE CHARACTER MOVE
   */
  useFrame((state, delta) => {
    // Get input key states
    const { forward, backward, leftward, rightward, jump } = getKeys();

    // One vector for handling all applied forces
    const impluse = { x: 0, y: 0, z: 0 };

    // Access the character linear velocity
    const linvel = body.current.linvel();

    console.log(linvel);

    // Control the character mesh rotation
    let changeRotation = false;

    // Move forward, backward, leftward, rightward
    if (forward && linvel.z > -MAX_VEL) {
      impluse.z -= MOVEMENT_SPEED * delta;
      changeRotation = true;
    }
    if (backward && linvel.z < MAX_VEL) {
      impluse.z += MOVEMENT_SPEED * delta;
      changeRotation = true;
    }
    if (leftward && linvel.x > -MAX_VEL) {
      impluse.x -= MOVEMENT_SPEED * delta;
      changeRotation = true;
    }
    if (rightward && linvel.x < MAX_VEL) {
      impluse.x += MOVEMENT_SPEED * delta;
      changeRotation = true;
    }

    // Rotate the character according to move directions
    if (changeRotation) {
      const angle = Math.atan2(linvel.x, linvel.z);
      character.current.rotation.y = angle;
    }

    // Apply forces to the rigid body
    body.current.applyImpulse(impluse, true);

    // For the character animations
    if (Math.abs(linvel.x) > RUN_VEL || Math.abs(linvel.z) > RUN_VEL) {
      if (characterState === "Idle" || characterState !== "JumpAnimation") {
        setCharacterState("RunAnimation");
      }
    } else if (
      (Math.abs(linvel.x) === 0 || Math.abs(linvel.z) === 0) &&
      Math.abs(linvel.y) === 0
    ) {
      if (characterState !== "Idle") {
        setCharacterState("Idle");
      }
    }
  });

  /**
   * MAKE THE CHARACTER JUMP
   */
  const { rapier, world } = useRapier();

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 1.25 / 2; // Move origin to the touch ground
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 20, true);

    if (hit.toi < JUMP_ACTIVATE_HIGHT) {
      body.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
      if (characterState !== "JumpAnimation") {
        setCharacterState("JumpAnimation");
      }
    }
  };

  // Listen to the "jump state" change for trigger jump Fn
  useEffect(() => {
    const unsubscribeKeys = subscribeKeys(
      (state) => state.jump,
      (value) => value && jump()
    );

    return () => {
      unsubscribeKeys();
    };
  }, []);

  /**
   * RESET CHARACTER POSITION
   *
   * The position gets reset;
   * - when the character falls outside the stage
   * - when the character cleared the stage
   */
  const resetPosition = () => {
    body.current.setTranslation({ x: 0, y: 0, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useEffect(
    () => useGameStore.subscribe((state) => state.currentStage, resetPosition),
    []
  );

  /**
   * ANIMATE CAMERA
   */
  useFrame((state, delta) => {
    // Get the character position
    const characterWorldPosition = character.current.getWorldPosition(
      new THREE.Vector3()
    );

    // Set the camera position
    state.camera.position.x = characterWorldPosition.x;
    state.camera.position.z = characterWorldPosition.z + 10;

    // Set the camera target
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(characterWorldPosition);
    state.camera.lookAt(cameraTarget);
  });

  return (
    <group>
      <RigidBody
        ref={body}
        colliders={false}
        scale={[0.5, 0.5, 0.5]}
        linearDamping={0.9}
        angularDamping={0.5}
        enabledRotations={[false, false, false]}
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject.name === "void") {
            resetPosition();
            playAudio("fail", () => {
              playAudio("ganbatte");
            });
          }
        }}
      >
        <CapsuleCollider args={[0.8, 0.4]} position={[0, 1.2, 0]} />

        <group ref={character}>
          <Character />
        </group>
      </RigidBody>
    </group>
  );
};
