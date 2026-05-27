import { css } from "@emotion/react";
import { Tooltip, TooltipTrigger } from "react-aria-components";

import {
  Icon,
  Icons,
  Text,
  ToggleButton,
  ToggleButtonGroup,
  View,
} from "@phoenix/components";
import { usePreferencesContext } from "@phoenix/contexts";
import type { ProjectViewMode } from "@phoenix/store/preferencesStore";

export const ProjectViewModeToggle = () => {
  const { projectViewMode, setProjectViewMode } = usePreferencesContext(
    (state) => ({
      projectViewMode: state.projectViewMode,
      setProjectViewMode: state.setProjectViewMode,
    })
  );

  return (
    <ToggleButtonGroup
      css={css`
        flex-basis: fit-content;
      `}
      selectedKeys={[projectViewMode]}
      selectionMode="single"
      onSelectionChange={(value) => {
        const selectedKey = value.values().next().value;
        if (typeof selectedKey === "string") {
          setProjectViewMode(selectedKey as ProjectViewMode);
        }
      }}
      size="M"
    >
      <TooltipTrigger delay={100}>
        <ToggleButton
          id="grid"
          aria-label="网格视图"
          leadingVisual={<Icon svg={<Icons.Grid />} />}
        />
        <Tooltip offset={10}>
          <View
            padding="size-100"
            borderColor="default"
            borderWidth="thin"
            borderRadius="small"
          >
            <Text>以网格查看项目</Text>
          </View>
        </Tooltip>
      </TooltipTrigger>
      <TooltipTrigger delay={100}>
        <ToggleButton
          id="table"
          aria-label="表格视图"
          leadingVisual={<Icon svg={<Icons.ListOutline />} />}
        />
        <Tooltip offset={10}>
          <View
            padding="size-100"
            borderColor="default"
            borderWidth="thin"
            borderRadius="small"
          >
            <Text>以表格查看项目</Text>
          </View>
        </Tooltip>
      </TooltipTrigger>
    </ToggleButtonGroup>
  );
};
