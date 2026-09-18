import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { FinalSummaryContent } from "./FinalSummaryContent";

export default function FinalSummaryPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <FinalSummaryContent />
    </Suspense>
  );
}
