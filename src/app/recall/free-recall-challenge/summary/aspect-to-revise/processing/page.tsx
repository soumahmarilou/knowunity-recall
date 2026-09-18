import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { AspectProcessingContent } from "./AspectProcessingContent";

export default function AspectProcessingPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <AspectProcessingContent />
    </Suspense>
  );
}
