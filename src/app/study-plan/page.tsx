import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { StudyPlanContent } from "./StudyPlanContent";

export default function StudyPlanPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <StudyPlanContent />
    </Suspense>
  );
}
