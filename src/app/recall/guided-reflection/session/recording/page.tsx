import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { GuidedReflectionRecordingContent } from "./RecordingContent";

export default function GuidedReflectionRecordingPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <GuidedReflectionRecordingContent />
    </Suspense>
  );
}
