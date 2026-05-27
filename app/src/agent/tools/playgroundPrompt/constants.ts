export const PLAYGROUND_PROMPT_TOOL_NAMES = {
  read: "read_prompt_instance",
  edit: "edit_prompt_instance",
  cloneInstance: "clone_prompt_instance",
} as const;

export const READ_PROMPT_TOOL_NAME = PLAYGROUND_PROMPT_TOOL_NAMES.read;
export const EDIT_PROMPT_TOOL_NAME = PLAYGROUND_PROMPT_TOOL_NAMES.edit;
export const CLONE_PROMPT_INSTANCE_TOOL_NAME =
  PLAYGROUND_PROMPT_TOOL_NAMES.cloneInstance;

export const EDIT_PROMPT_NAVIGATION_CANCEL_ERROR =
  "实验台在审阅本次编辑前已关闭，因此本次编辑已被丢弃。";
