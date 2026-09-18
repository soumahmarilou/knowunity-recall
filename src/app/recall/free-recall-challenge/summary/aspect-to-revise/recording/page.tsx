import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { AspectRecordingContent } from "./AspectRecordingContent";

export default function AspectRecordingPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <AspectRecordingContent />
    </Suspense>
  );
}
