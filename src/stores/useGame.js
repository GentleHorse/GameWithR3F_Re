import { create } from "zustand";

export default create((set) => {
  return {
    blocksCount: 3,

    /**
     * PHASES
     */
    phase: "ready",

    start: () => set({ phase: "playing" }),
    restart: () => set({ phase: "ready" }),
    end: () => set({ phase: "ended" }),
  };
});
