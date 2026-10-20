import { GhostFibers } from "@/components/ghost-fibers";

export default function GhostTestPage() {
  return (
    <div style={{ width: "100%", height: "80vh", background: "#000" }}>
      <GhostFibers
        glowColor="#00664E"
        secondaryColor="#05DC7F"
        lineColor="#152E2B"
      />
    </div>
  );
}
