import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { GuidedReflectionSessionContent } from "./SessionContent";

export default function GuidedReflectionSessionPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <GuidedReflectionSessionContent />
    </Suspense>
  );
}
