import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { ConceptQuestionsSummaryContent } from "./SummaryContent";

export default function ConceptQuestionsSummaryPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <ConceptQuestionsSummaryContent />
    </Suspense>
  );
}
