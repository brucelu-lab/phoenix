import type { ViewProps } from "@phoenix/components";
import { DebouncedSearch, Flex, View } from "@phoenix/components";
import { useEvaluatorsFilterContext } from "@phoenix/pages/evaluators/EvaluatorsFilterProvider";

export const EvaluatorsFilterBar = ({
  extraActions,
  padding = "size-200",
}: {
  extraActions?: React.ReactNode;
  padding?: ViewProps["padding"];
}) => {
  const { setFilter, filter } = useEvaluatorsFilterContext();

  return (
    <View
      padding={padding}
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
          aria-label="按名称搜索评测器"
          onChange={setFilter}
          defaultValue={filter}
          placeholder="按名称搜索评测器"
        />
        {!!extraActions && (
          <Flex direction="row" alignItems="center" gap="size-100" flex="none">
            {extraActions}
          </Flex>
        )}
      </Flex>
    </View>
  );
};
