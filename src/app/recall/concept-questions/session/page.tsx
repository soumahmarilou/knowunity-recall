import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { ConceptQuestionsSessionContent } from "./SessionContent";

export default function ConceptQuestionsSessionPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <ConceptQuestionsSessionContent />
    </Suspense>
  );
}
