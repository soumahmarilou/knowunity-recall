import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { GuidedReflectionProcessingContent } from "./ProcessingContent";

export default function GuidedReflectionProcessingPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <GuidedReflectionProcessingContent />
    </Suspense>
  );
}
