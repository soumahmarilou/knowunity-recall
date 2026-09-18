import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { FreeRecallChallengeSessionContent } from "./SessionContent";

export default function FreeRecallChallengeSessionPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <FreeRecallChallengeSessionContent />
    </Suspense>
  );
}
