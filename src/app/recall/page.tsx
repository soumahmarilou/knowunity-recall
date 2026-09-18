import { Suspense } from "react";
import { Screen } from "@/components/Screen/Screen";
import { ModeSelectionContent } from "./ModeSelectionContent";

export default function ModeSelectionPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <ModeSelectionContent />
    </Suspense>
  );
}
