import { useControls } from "leva";

export default function Background() {
    const {color} = useControls('background', {
        color: "#ecb88a"
    })

  return (
    <>
      <color args={[color]} attach="background" />
    </>
  );
}