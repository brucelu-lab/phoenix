import { useParams } from "react-router";
import invariant from "tiny-invariant";

import { DebouncedSearch, Flex, View } from "@phoenix/components";
import { useDatasetContext } from "@phoenix/contexts/DatasetContext";
import { AddDatasetExampleButton } from "@phoenix/pages/dataset/AddDatasetExampleButton";
import { useExamplesFilterContext } from "@phoenix/pages/examples/ExamplesFilterContext";
import { ExamplesSplitsMenu } from "@phoenix/pages/examples/ExamplesSplitsMenu";

export const ExamplesFilterBar = () => {
  const { setFilter, filter, selectedSplitIds, setSelectedSplitIds } =
    useExamplesFilterContext();
  const { datasetId } = useParams();
  invariant(datasetId, "datasetId is required");
  const datasetName = useDatasetContext((state) => state.datasetName);
  const refreshLatestVersion = useDatasetContext(
    (state) => state.refreshLatestVersion
  );
  return (
    <View
      padding="size-100"
      // prevent the example table from eating the bottom of the filter bar
      // TODO: refactor the dataset page layout css to not have to do this
      minHeight={54}
      borderBottomWidth="thin"
      borderBottomColor="default"
    >
      <Flex
        width="100%"
        justifyContent="space-between"
        gap="size-100"
        alignItems="center"
        wrap="nowrap"
      >
        <DebouncedSearch
          defaultValue={filter}
          onChange={setFilter}
          placeholder="按输入/输出/元数据搜索样本"
          aria-label="搜索样本"
        />
        <ExamplesSplitsMenu
          onSelectionChange={setSelectedSplitIds}
          selectedSplitIds={selectedSplitIds}
        />
        <AddDatasetExampleButton
          datasetId={datasetId}
          datasetName={datasetName}
          onAddExampleCompleted={refreshLatestVersion}
        />
      </Flex>
    </View>
  );
};
