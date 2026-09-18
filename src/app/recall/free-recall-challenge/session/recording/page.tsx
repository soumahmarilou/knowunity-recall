import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { FreeRecallChallengeRecordingContent } from "./RecordingContent";

export default function FreeRecallChallengeRecordingPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <FreeRecallChallengeRecordingContent />
    </Suspense>
  );
}
