import { ToggleButton, ToggleButtonGroup } from "@phoenix/components";
import { usePlaygroundContext } from "@phoenix/contexts/PlaygroundContext";
import type { GenAIOperationType } from "@phoenix/store";

function isGenAIOperationType(v: string): v is GenAIOperationType {
  return v === "chat" || v === "text_completion";
}

export function PlaygroundOperationTypeRadioGroup() {
  const operationType = usePlaygroundContext((state) => state.operationType);
  const setOperationType = usePlaygroundContext(
    (state) => state.setOperationType
  );
  return (
    <ToggleButtonGroup
      defaultSelectedKeys={[operationType]}
      aria-label="操作类型"
      onSelectionChange={(v) => {
        if (v.size === 0) {
          return;
        }
        const type = v.keys().next().value;
        if (typeof type === "string" && isGenAIOperationType(type)) {
          setOperationType(type);
        }
      }}
    >
      <ToggleButton aria-label="对话" id={"chat"}>
        Chat
      </ToggleButton>
      <ToggleButton aria-label="补全" id={"text_completion"}>
        Completion
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
