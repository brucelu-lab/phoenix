import {
  DebouncedSearch,
  Flex,
  Icon,
  Icons,
  LinkButton,
  View,
} from "@phoenix/components";
import { CanModify } from "@phoenix/components/auth";
import { usePromptsFilterContext } from "@phoenix/pages/prompts/PromptsFilterProvider";
import { PromptsLabelMenu } from "@phoenix/pages/prompts/PromptsLabelMenu";

export const PromptsFilterBar = () => {
  const {
    setFilter,
    filter,
    selectedPromptLabelIds,
    setSelectedPromptLabelIds,
  } = usePromptsFilterContext();

  return (
    <View
      padding="size-200"
      borderBottomWidth="thin"
      borderBottomColor="default"
      flex="none"
    >
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap="size-100"
      >
        <DebouncedSearch
          aria-label="按名称搜索提示词"
          onChange={setFilter}
          defaultValue={filter}
          placeholder="按名称搜索提示词"
        />
        <Flex direction="row" alignItems="center" gap="size-100" flex="none">
          <PromptsLabelMenu
            selectedLabelIds={selectedPromptLabelIds}
            onSelectionChange={setSelectedPromptLabelIds}
          />
          <CanModify>
            <LinkButton
              size="M"
              leadingVisual={<Icon svg={<Icons.MessageSquareOutline />} />}
              variant="primary"
              to="/playground"
            >
              New Prompt
            </LinkButton>
          </CanModify>
        </Flex>
      </Flex>
    </View>
  );
};
