import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { ConceptQuestionsRevealContent } from "./RevealContent";

export default function ConceptQuestionsRevealPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <ConceptQuestionsRevealContent />
    </Suspense>
  );
}
