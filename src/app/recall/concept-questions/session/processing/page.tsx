import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { ConceptQuestionsProcessingContent } from "./ProcessingContent";

export default function ConceptQuestionsProcessingPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <ConceptQuestionsProcessingContent />
    </Suspense>
  );
}
