import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { FreeRecallChallengeProcessingContent } from "./ProcessingContent";

export default function FreeRecallChallengeProcessingPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <FreeRecallChallengeProcessingContent />
    </Suspense>
  );
}
