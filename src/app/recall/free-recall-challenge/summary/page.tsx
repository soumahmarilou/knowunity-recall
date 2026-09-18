import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { FreeRecallChallengeSummaryContent } from "./SummaryContent";

export default function FreeRecallChallengeSummaryPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <FreeRecallChallengeSummaryContent />
    </Suspense>
  );
}
