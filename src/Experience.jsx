import { Cylinder, OrbitControls } from "@react-three/drei";
import { CylinderCollider, RigidBody } from "@react-three/rapier";

export default function Experience() {
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

      {/* STAGE */}
        <RigidBody colliders={false} type="fixed" position-y={-0.5}>
            <CylinderCollider args={[0.5, 5]} />
            <Cylinder scale={[5, 1, 5]} receiveShadow>
                <meshStandardMaterial color="snow" />
            </Cylinder>

        </RigidBody>

    </>
  );
}
