import { useControls } from "leva";

export default function Background() {
    const {color} = useControls('background', {
        color: "ivory"
    })

  return (
    <>
      <color args={[color]} attach="background" />
    </>
  );
}
