import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { AspectToReviseContent } from "./AspectToReviseContent";

export default function AspectToRevisePage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <AspectToReviseContent />
    </Suspense>
  );
}
