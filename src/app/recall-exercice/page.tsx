import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { RecallExerciceContent } from "./RecallExerciceContent";

export default function RecallExercicePage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <RecallExerciceContent />
    </Suspense>
  );
}
