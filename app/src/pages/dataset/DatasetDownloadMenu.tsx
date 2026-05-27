import {
  Button,
  Icon,
  Icons,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "@phoenix/components";
import { prependBasename } from "@phoenix/utils/routingUtils";

export function DatasetDownloadMenu({ datasetId }: { datasetId: string }) {
  return (
    <MenuTrigger>
      <Button
        size="M"
        leadingVisual={<Icon svg={<Icons.DownloadOutline />} />}
      />
      <Popover>
        <Menu
          aria-label="下载数据集"
          onAction={(action) => {
            switch (action) {
              case "csv":
                window.open(
                  prependBasename(`/v1/datasets/${datasetId}/csv`),
                  "_blank"
                );
                break;
              case "jsonl":
                window.open(
                  prependBasename(`/v1/datasets/${datasetId}/jsonl`),
                  "_blank"
                );
                break;
              case "openai-ft":
                window.open(
                  prependBasename(`/v1/datasets/${datasetId}/jsonl/openai_ft`),
                  "_blank"
                );
                break;
              case "openai-evals":
                window.open(
                  prependBasename(
                    `/v1/datasets/${datasetId}/jsonl/openai_evals`
                  ),
                  "_blank"
                );
                break;
            }
          }}
        >
          <MenuItem id="csv">下载 CSV</MenuItem>
          <MenuItem id="jsonl">下载 JSONL</MenuItem>
          <MenuItem id="openai-ft">下载 OpenAI 微调 JSONL</MenuItem>
          <MenuItem id="openai-evals">下载 OpenAI Evals JSONL</MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
