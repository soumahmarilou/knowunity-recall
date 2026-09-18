import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { AfterRecordingContent } from "./AfterRecordingContent";

export default function FreeRecallChallengeAfterRecordingPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <AfterRecordingContent />
    </Suspense>
  );
}
