"use client";

import { useState } from "react";
import { ColorPaletteSheet } from "@/components/palette/ColorPaletteSheet";
import { ColorPaletteTrigger } from "@/components/palette/ColorPaletteTrigger";
import { useColorPalette } from "@/hooks/useColorPalette";

/** Global accent palette picker — fixed tab + right sheet. */
export function ColorPalettePicker() {
  const [open, setOpen] = useState(false);
  const { palette, setPalette, ready } = useColorPalette();

  return (
    <>
      <ColorPaletteTrigger
        open={open}
        onOpen={() => setOpen(true)}
        disabled={!ready}
      />
      <ColorPaletteSheet
        open={open}
        palette={palette}
        onOpenChange={(next) => {
          setOpen(next);
        }}
        onSelect={setPalette}
      />
    </>
  );
}
