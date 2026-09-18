import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { GuidedReflectionIntroContent } from "./IntroContent";

export default function GuidedReflectionIntroPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <GuidedReflectionIntroContent />
    </Suspense>
  );
}
