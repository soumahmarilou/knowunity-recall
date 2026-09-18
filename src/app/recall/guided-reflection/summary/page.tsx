import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { GuidedReflectionSummaryContent } from "./SummaryContent";

export default function GuidedReflectionSummaryPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <GuidedReflectionSummaryContent />
    </Suspense>
  );
}
