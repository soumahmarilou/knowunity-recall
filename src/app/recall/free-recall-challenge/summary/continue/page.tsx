import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { FreeRecallChallengeSummaryContinueContent } from "./ContinueContent";

export default function FreeRecallChallengeSummaryContinuePage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <FreeRecallChallengeSummaryContinueContent />
    </Suspense>
  );
}
