import {
  EDIT_PROMPT_NAVIGATION_CANCEL_ERROR,
  EDIT_PROMPT_TOOL_NAME,
} from "./constants";
import { applyPromptOperations, getPromptSnapshot } from "./promptStore";
import type { BindPendingPromptEditOptions, PendingPromptEdit } from "./types";

/**
 * Attaches accept/reject callbacks to a pending prompt edit using the live
 * AI SDK tool-call context that created the proposal.
 */
export function bindPendingPromptEditActions({
  pendingEdit,
  playgroundStore,
  addToolOutput,
  setPendingPromptEdit,
}: BindPendingPromptEditOptions): PendingPromptEdit {
  return {
    ...pendingEdit,
    accept: async () => {
      setPendingPromptEdit(pendingEdit.toolCallId, null);
      const current = getPromptSnapshot({
        playgroundStore,
        instanceId: pendingEdit.instanceId,
      });
      if (!current.ok) {
        await addToolOutput({
          state: "output-error",
          tool: EDIT_PROMPT_TOOL_NAME,
          toolCallId: pendingEdit.toolCallId,
          errorText: current.error,
        });
        return;
      }
      if (current.output.revision !== pendingEdit.expectedRevision) {
        await addToolOutput({
          state: "output-error",
          tool: EDIT_PROMPT_TOOL_NAME,
          toolCallId: pendingEdit.toolCallId,
          errorText:
            "The prompt was changed after this edit was proposed, so it can no longer be applied.",
        });
        return;
      }
      applyPromptOperations({
        playgroundStore,
        instanceId: pendingEdit.instanceId,
        operations: pendingEdit.operations,
      });
      const afterApply = getPromptSnapshot({
        playgroundStore,
        instanceId: pendingEdit.instanceId,
      });
      await addToolOutput({
        state: "output-available",
        tool: EDIT_PROMPT_TOOL_NAME,
        toolCallId: pendingEdit.toolCallId,
        output: {
          status: "accepted",
          instanceId: pendingEdit.instanceId,
          revision: afterApply.ok
            ? afterApply.output.revision
            : pendingEdit.after.revision,
          message: "提示词编辑已应用。",
        },
      });
    },
    reject: async () => {
      setPendingPromptEdit(pendingEdit.toolCallId, null);
      await addToolOutput({
        state: "output-available",
        tool: EDIT_PROMPT_TOOL_NAME,
        toolCallId: pendingEdit.toolCallId,
        output: {
          status: "rejected",
          instanceId: pendingEdit.instanceId,
          message: "用户拒绝了提议的提示词编辑。",
        },
      });
    },
    cancel: async () => {
      setPendingPromptEdit(pendingEdit.toolCallId, null);
      await addToolOutput({
        state: "output-error",
        tool: EDIT_PROMPT_TOOL_NAME,
        toolCallId: pendingEdit.toolCallId,
        errorText: EDIT_PROMPT_NAVIGATION_CANCEL_ERROR,
      });
    },
  };
}
