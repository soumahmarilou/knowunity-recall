import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { FreeRecallChallengeIntroContent } from "./IntroContent";

export default function FreeRecallChallengeIntroPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <FreeRecallChallengeIntroContent />
    </Suspense>
  );
}
