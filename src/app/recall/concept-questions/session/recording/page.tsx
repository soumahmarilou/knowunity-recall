import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { ConceptQuestionsRecordingContent } from "./RecordingContent";

export default function ConceptQuestionsRecordingPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <ConceptQuestionsRecordingContent />
    </Suspense>
  );
}
