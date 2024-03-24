# Kana Game with React Three Fiber & React Three Rapier

## 0. Troubleshoot

### "Rendered more hooks than during the previous render"

**Error** <br>
It happened in the `Kicker` component when tried to call the `if` statement before `useFrame` function. <br><br>

**What causd this kind of error**

- `if` statements called before a hook
- A hook is invoked inside the body of an `if`, `else`, `for` or `while` statement

## 1. Material GUI trick (`KanaSpots.jsx`)

[glass like sphere material gui](/public/images/screenshots/glass-like-sphere-material-gui.png)<br>

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

## 2. Animate character