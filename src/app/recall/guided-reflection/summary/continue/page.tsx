import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { GuidedReflectionSummaryContinueContent } from "./ContinueContent";

export default function GuidedReflectionSummaryContinuePage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <GuidedReflectionSummaryContinueContent />
    </Suspense>
  );
}
