import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { ConceptQuestionsSummaryContinueContent } from "./ContinueContent";

export default function ConceptQuestionsSummaryContinuePage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <ConceptQuestionsSummaryContinueContent />
    </Suspense>
  );
}
