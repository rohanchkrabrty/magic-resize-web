import { useState } from "react";
import { Select } from "@/components/ui";
import { useStore } from "@/hooks/store";
import { DEFAULT_PRESET } from "@/lib/data";
import { Preset } from "@/types/api";
import { usePresets } from "@/hooks/queries";
import { SelectItemText } from "@radix-ui/react-select";

type PropsType = {
  disabled?: boolean;
};

export function PresetActions({ disabled = false }: PropsType) {
  const [selectedpreset, setSelectedPreset] = useState<Preset>(DEFAULT_PRESET);
  const presets = usePresets([DEFAULT_PRESET]);
  const updateCanvas = useStore(state => state.updateCanvas);

  return (
    <div className="flex flex-col sm:flex-1">
      <p className="uppercase text-[11px] font-semibold text-gray-500 mb-3">
        Preset
      </p>
      <Select<Preset>
        options={presets.data.map((preset: Preset) => ({
          value: preset.name,
          ...preset,
        }))}
        onValueChange={value => {
          updateCanvas({ width: value.width, height: value.height });
          setSelectedPreset(value);
        }}
        defaultValue={{ ...DEFAULT_PRESET, value: DEFAULT_PRESET.name }}
        placeholder="Select a preset"
        className="rounded-b-none z-10"
        isLoading={presets.loading}
        disabled={disabled}
        item={value => (
          <div className="flex items-baseline gap-1 justify-between w-full">
            <SelectItemText>{value.name}</SelectItemText>
            <span className="text-gray-500 text-xs">
              {value.aspect_ratio_label}
            </span>
          </div>
        )}
      />
      <div className="flex gap-2 text-sm self-stretch justify-between text-gray-500 font-medium p-1.5 px-3 bg-gray-50 border border-gray-200 rounded-b-md border-t-0">
        <p>W {selectedpreset.width}px</p>
        <p>H {selectedpreset.height}px</p>
        <p>AR {selectedpreset.aspect_ratio_label}</p>
      </div>
    </div>
  );
}
