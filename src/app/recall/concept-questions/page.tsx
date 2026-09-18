import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { ConceptQuestionsIntroContent } from "./IntroContent";

export default function ConceptQuestionsIntroPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <ConceptQuestionsIntroContent />
    </Suspense>
  );
}
