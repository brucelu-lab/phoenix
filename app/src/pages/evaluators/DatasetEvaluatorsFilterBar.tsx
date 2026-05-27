import type { ViewProps } from "@phoenix/components";
import { DebouncedSearch, Flex, View } from "@phoenix/components";
import { useDatasetEvaluatorsFilterContext } from "@phoenix/pages/evaluators/DatasetEvaluatorsFilterProvider";

export const DatasetEvaluatorsFilterBar = ({
  extraActions,
  padding = "size-200",
}: {
  extraActions?: React.ReactNode;
  padding?: ViewProps["padding"];
}) => {
  const { setFilter, filter } = useDatasetEvaluatorsFilterContext();

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
