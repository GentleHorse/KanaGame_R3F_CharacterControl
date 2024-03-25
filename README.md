# Kana Game with React Three Fiber & React Three Rapier

**Credit**
I followed one of the [Wawa Sensei](https://github.com/wass08)'s tutorial series, "[How to Create a 3D game with React Three Fiber](https://youtube.com/playlist?list=PLpepLKamtPji7wiGXOHLPcUMs-UKdL9i4&si=5GJiskGIMfYyHw3n)" to create this app, although I made a tiny changes to the codes. Thanks for the amazing lessons.

## 0. Troubleshoot

### "Rendered more hooks than during the previous render"

**Error** <br>
It happened in the `Kicker` component when tried to call the `if` statement before `useFrame` function. <br><br>

**What causd this kind of error**

- `if` statements called before a hook
- A hook is invoked inside the body of an `if`, `else`, `for` or `while` statement

## 1. Material GUI trick (`KanaSpots.jsx`)

![glass like sphere material gui](/public/images/screenshots/glass-like-sphere-material-gui.png)<br>

```
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
    color: "#efbeff",
    bg: "#ffffff",
  });

....

    <Sphere>
        <meshPhysicalMaterial {...config} />
    </Sphere>

    ....
```

## 2. How to spawn the character and make it move

### 2-0. Find the one at pmndrs market and download it
![pmndrs market](/public/images/screenshots/pmndrs-market-characters.png)<br>
You can find free 3D models at [pmndrs market](https://market.pmnd.rs/). Once you find one, click "Download Model" to download the model. The file format is automatically set to `gltf`, which is convenient for the next step.

- [pmndrs market](https://market.pmnd.rs/)

### 2-1. Run "gltfjsx" to create the `Character` component
You can automatically convert the downloaded gltf model to the React component with [gltfjsx](https://github.com/pmndrs/gltfjsx). Run the following command. (Assume that the model is located inside `models` > `female-cyborg` folder.)<br>

```
npx gltfjsx public/models/female-cyborg/model.gltf
```
<br>

And then copy all the code inside the auto generated `Model.jsx` file, create the `Character.jsx` component and paste the code inside of it. Also the link to the gltf model should be fixed properly. <br>

```
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Character(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("./models/female-cyborg/model.gltf");
  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={0.64}>
        <primitive object={nodes.LeftFootCtrl} />
        <primitive object={nodes.RightFootCtrl} />
        <primitive object={nodes.HipsCtrl} />
        <skinnedMesh
          geometry={nodes.characterMedium.geometry}
          material={materials["skin.001"]}
          skeleton={nodes.characterMedium.skeleton}
          castShadow
        />
      </group>
    </group>
  );
}

useGLTF.preload("./models/female-cyborg/model.gltf");
```

#### cf. An alternative to create the `Character` component
![online gltf conveter](/public/images/screenshots/online-gltf-converter.png)<br>
An alternative way to create the model component from the model is using [online gltf conveter](https://gltf.pmnd.rs/) offered by pmndrs. Just drop the gltf file and it automatically generates the jsx code for you.

### 2-2. Import `KeyboardControls` and set up
In order to make the character move with the keyboard, use `KeyboardControls` from `@react-three/drei`. It's recommended to implement it outside `<Canvas>` so that non-three.js components can access keyboard inputs.

- [KeyboardControls](https://github.com/pmndrs/drei?tab=readme-ov-file#keyboardcontrols) <br>

**App.js**
```
export const Controls = {
  forward: "forward",
  backward: "backward",
  leftward: "leftward",
  rightward: "rightward",
  jump: "jump",
};

function App() {
  /**
   * PARAMS FOR KEYBOARD CONTROL
   */
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.leftward, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.rightward, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  return (
    <>
      <KeyboardControls map={map}>

        <Canvas .... >
          <Suspense>
            <Physics debug>
              <Experience />
            </Physics>
          </Suspense>
        </Canvas>

        ....

      </KeyboardControls>
    </>
  );
}

export default App;
```

### 2-3. Create the `CharacterController` component
First you need to create the `CharacterController` component and wrap `Character` component with `RigidBody`. <br>

```
<RigidBody>
    <Character />
</RigidBody>
```

### 2-4. Set up 
In order to make the character move with keyboard inputs, first you need to set up `useKeyboardControls` from `@react-three/drei`.<br>

```
const [subscribeKeys, getKeys] = useKeyboardControls();
```

### 2-5. Link ref to `RigidBody`
Making the character move involves the physics, thus you need to reference the character via `<RigidBody>`. <br>

```
const body = useRef();

....

    <RigidBody ref={body} .... >
        <Character />
    </RigidBody>
```

### 2-6. Apply forces to make the character move
Using **"getter"** of `useKeyboardControls` to fetch keyboard input states, then apply forces to the model with `applyImpulse`. It's important to use and tweak **"one vector"** to apply forces otherwise unwanted forces could be applied to the character leading to unpredictable character movements. Applying forces needs to be done inside `useFrame`. For provide the same user experience regardless of device, the amount of applied force should be optimized through `delta`. The second boolean parameter of `applyImpulse` is to wake up the character (react three rapier system automatically sets objects sleep after several seconds). <br>

```
useFrame((state, delta) => {
    // Get input key states
    const { forward, backward, leftward, rightward } = getKeys();

    // One vector for handling all applied forces
    const impluse = { x: 0, y: 0, z: 0 };

    // Move forward, backward, leftward, rightward
    if (forward) {
        impluse.z -= 3 * delta;
    }
    if (backward) {
        impluse.z += 3 * delta;
    }
    if (leftward ) {
        impluse.x -= 3 * delta;
    }
    if (rightward) {
        impluse.x += 3 * delta;
    }

    // Apply forces to the rigid body
    body.current.applyImpulse(impluse, true);
});
```

### 2-7. Use `CapsuleCollider` instead of default collider
![character CapsuleCollider](/public/images/screenshots/character-capsule-collider.png)<br>
For better and optimized physicall simulations, implement `CapsuleCollider`. <br>

```
<RigidBody .... colliders={false} >
    <Character />
    <CapsuleCollider .... />
</RigidBody>
```
### 2-8. Prevent the character to fall on the ground
![character fall on the ground](/public/images/screenshots/character-fall-on-the-ground.png)<br>
When the force is applied to the character, it will fall on the ground. To prevent it, tweak the `enabledRotations` attribute of `RigidBody`. <br>

```
<RigidBody .... enabledRotations={[false, false, false]} >
    <Character />
    <CapsuleCollider .... />
</RigidBody>
```

### 2-9. Control the character movement speed to make it more natural
In order to create natural character movements, you need to limit its speed by accessing its movement speed via `linvel()` method. And also set `linearDamping` of `RigidBody` to automatically diminish applied forces. <br>

```
useFrame((state, delta) => {
    // Get input key states
    const { forward, backward, leftward, rightward } = getKeys();

    // One vector for handling all applied forces
    const impluse = { x: 0, y: 0, z: 0 };

    // Access the character linear velocity
    const linvel = body.current.linvel();

    // Move forward, backward, leftward, rightward
    if (forward && linvel.z > -3) {
        impluse.z -= 3 * delta;
    }
    if (backward && linvel.z < 3) {
        impluse.z += 3 * delta;
    }
    if (leftward && linvel.x > -3) {
        impluse.x -= 3 * delta;
    }
    if (rightward && linvel.x < 3) {
        impluse.x += 3 * delta;
    }

    // Apply forces to the rigid body
    body.current.applyImpulse(impluse, true);
});

....

    <RigidBody .... linearDamping={0.5} >
        <Character />
        <CapsuleCollider .... />
    </RigidBody>
```

### 2-10. Face the character towards movement directions
![character face directions](/public/images/screenshots/character-face-directions.png)<br>
It looks more natural if the character face the direction in which it moves. It can be done through accessing the character `mesh` and tweaking its rotation (since it doesn't have to be related to the physic simulation in this game). <br>

```
const character = useRef();

useFrame((state, delta) => {
    // Get input key states
    const { forward, backward, leftward, rightward } = getKeys();

    // One vector for handling all applied forces
    const impluse = { x: 0, y: 0, z: 0 };

    // Access the character linear velocity
    const linvel = body.current.linvel();

    // Control the character mesh rotation
    let changeRotation = false;

    // Move forward, backward, leftward, rightward
    if (forward && linvel.z > -3) {
        impluse.z -= 3 * delta;
        changeRotation = true;
    }
    if (backward && linvel.z < 3) {
        impluse.z += 3 * delta;
        changeRotation = true;
    }
    if (leftward && linvel.x > -3) {
        impluse.x -= 3 * delta;
        changeRotation = true;
    }
    if (rightward && linvel.x < 3) {
        impluse.x += 3 * delta;
        changeRotation = true;
    }

    // Rotate the character according to move directions
    if (changeRotation) {
      const angle = Math.atan2(linvel.x, linvel.z);
      character.current.rotation.y = angle;
    }

    // Apply forces to the rigid body
    body.current.applyImpulse(impluse, true);
});

....


    <RigidBody .... >

        <group ref={character}>
          <Character />
        </group>

        <CapsuleCollider .... />

    </RigidBody>
```

### 2-11. Make the character jump
![character jump](/public/images/screenshots/character-jump.png)<br>
Jump logic should be triggered based on the keyboard input **"state changes"**, not 
**"state"** (otherwise the jump forces keep applied and the character fly away). In order to listen "state changes", you need to **"subscribe"** the keyboard input. <br>

```
  const jump = () => {
    body.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
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
```

### 2-12. Limit the jump activation according to the height
Without limitations, the character jumps endlessly (and could fly to the moon) and that's not ideal user experience. So set the jump height limit with `rapier.Ray`. To do so, `useRapier` should be properly imported from `@react-three/rapier`. <br>

```
const { rapier, world } = useRapier();

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 1.25 / 2; // Move origin to the touch ground
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 20, true);

    if (hit.toi < 3) {
      body.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
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

```

## 3. Reset the character position when it falls outside the stage
![character fall outside the stage](/public/images/screenshots/character-fall-outside-the-stage.png)

### 3-0. Objectives
- Add the `sensor` attribute to the specific `Collider`
- Create the reset function of the character position & velocity

### 3-1. Sensors
A Collider can be set to be **"a sensor"**, which means that it will not generate any contact points, and will not be affected by forces. This is useful for detecting when a collider enters or leaves another collider, without affecting the other collider.

To detect when a collider enters or leaves another collider, you can use the `onIntersectionEnter` and `onIntersectionExit` events on the collider.
<br>

- [onIntersectionEnter / onIntersectionExit docs](https://pmndrs.github.io/react-three-rapier/interfaces/RigidBodyProps.html#onIntersectionEnter)

### 3-2. Add the `sensor` attribute to the floor
In this game, there's the floor outside the stage, so set the `sensor` attribute to that collider. <br>

```
<RigidBody colliders={false} type="fixed" name="void">
    <mesh .... />
    <CuboidCollider .... sensor />
</RigidBody>
```

### 3-3. Create reset function and add it through `onIntersectionEnter` attribute
`onIntersectionEnter` callbacks when this collider, or another collider starts intersecting, and at least one of them is a `sensor`. So create the reset function and set to the `CharacterController` component through the `onIntersectionEnter` attribute. <br>

```
const resetPosition = () => {
    body.current.setTranslation({ x: 0, y: 0, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
};

....

    <RigidBody
        .... 
        onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject.name === "void") {
                resetPosition();
            }
        }}
    >

        <group ref={character}>
          <Character />
        </group>

        <CapsuleCollider .... />

    </RigidBody>
```

## 4. Let the camera follow the character
![camera follow character](/public/images/screenshots/camera-follow-character.png)<br>
To let the camera follow the character movements, access its position through `getWorldPosition` of the character `mesh` (in this case, it's done with its `mesh` ref, `character`) and synchronize the both movements with adjusting the camera position & target (where the camera looks at). <br>

- **Camera position**: synchronize xz-axis, but y-axis is fixed
- **Camera target**: synchronize xyz-axis <br><br>

```
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
```

## 5. Animate the character

### 5-0. Steps
- Prepare the model as the format of **"fbx"**
- Upload to [Mixamo](https://www.mixamo.com/#/)
- Find an animation and download it
- Attach the imported animation to the model in blender
- Export as **"gltf"** file

### 5-1. Import the gltf model into blender and exported as the fbx file
![import to blender](/public/images/screenshots/import-gltf-model-to-blender.png)<br>
![export as fbx](/public/images/screenshots/export-gltf-as-fbx.png)<br>

### 5-2. Upload the fbx model to mixamo
![upload fbx to mixamo 01](/public/images/screenshots/upload-fbx-to-mixamo-01.png)<br>
![upload fbx to mixamo 02](/public/images/screenshots/upload-fbx-to-mixamo-02.png)<br>
![upload fbx to mixamo 03](/public/images/screenshots/upload-fbx-to-mixamo-03.png)<br>

### 5-3. Select an animation and download it
![upload fbx to mixamo 04](/public/images/screenshots/upload-fbx-to-mixamo-04.png)<br>
![upload fbx to mixamo 05](/public/images/screenshots/upload-fbx-to-mixamo-05.png)<br><br>

Don't forget to check **"In Place"**.

### 5-4. Import the animation (fbx) to blender
![import fbx animation](/public/images/screenshots/import-fbx-animation-to-blender.png)<br>

### 5-5. Change "Editor Type" to "Dope Sheet", open "Action Editor" and rename the animation
![dope sheet action editor](/public/images/screenshots/blender-dope-sheet-action-editor.png)<br>

### 5-6. Rename the original model, pose mode, open animation in action editor, hit "Push Down" 
![rename the original model](/public/images/screenshots/blender-rename-original-character.png)<br>
![open pose mode](/public/images/screenshots/blender-open-pose-mode.png)<br>
![action editor select animation](/public/images/screenshots/blender-action-editor-select-run.png)<br>
![action editor hit push down](/public/images/screenshots/blender-action-editor-hit-push-down.png)<br>

### 5-7. Change "Editor Type" to "Nonlinear Animation", rename, delete the animation model from Mixamo
![nonlinear animation](/public/images/screenshots/blender-nonlinear-animation.png)<br>
![rename nla track 1](/public/images/screenshots/blender-rename-nla-track-1.png)<br>
![rename nla track 2](/public/images/screenshots/blender-rename-nla-track-2.png)<br>
![delete imported animation model](/public/images/screenshots/blender-delete-imported-fbx-animation-model.png)<br>

### 5-8. Export the model as the format of gltf
![export animated gltf character](/public/images/screenshots/blender-export-animated-character.png)<br>











