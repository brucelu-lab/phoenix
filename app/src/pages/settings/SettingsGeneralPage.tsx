import { css } from "@emotion/react";
import { usePreloadedQuery } from "react-relay";
import { useLoaderData } from "react-router";
import invariant from "tiny-invariant";

import {
  Card,
  CopyField,
  CopyInput,
  Label,
  Text,
  View,
} from "@phoenix/components";
import { CanManageRetentionPolicy, IsAdmin } from "@phoenix/components/auth";
import { BASE_URL, VERSION } from "@phoenix/config";
import type { settingsGeneralPageLoaderQuery } from "@phoenix/pages/settings/__generated__/settingsGeneralPageLoaderQuery.graphql";
import { APIKeysCard } from "@phoenix/pages/settings/APIKeysCard";
import { DBUsagePieChart } from "@phoenix/pages/settings/DBUsagePieChart";
import { GlobalRetentionPolicyCard } from "@phoenix/pages/settings/GlobalRetentionPolicyCard";
import type { settingsGeneralPageLoaderType } from "@phoenix/pages/settings/settingsGeneralPageLoader";
import { settingsGeneralPageLoaderGQL } from "@phoenix/pages/settings/settingsGeneralPageLoader";
import { UsersCard } from "@phoenix/pages/settings/UsersCard";

const gridCSS = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--global-dimension-size-200);
  width: 100%;
`;

const fullWidthCSS = css`
  grid-column: 1 / -1;
`;

const formCSS = css`
  padding: var(--global-dimension-size-200);
`;

export function SettingsGeneralPage() {
  const loaderData = useLoaderData<settingsGeneralPageLoaderType>();
  invariant(loaderData, "loaderData is required");
  const data = usePreloadedQuery<settingsGeneralPageLoaderQuery>(
    settingsGeneralPageLoaderGQL,
    loaderData
  );
  return (
    <div css={gridCSS}>
      <Card title="平台">
        <form css={formCSS}>
          <CopyField value={BASE_URL}>
            <Label>主机名</Label>
            <CopyInput />
            <Text slot="description">通过 HTTP 连接 Phoenix</Text>
          </CopyField>
          <CopyField value={VERSION}>
            <Label>平台版本</Label>
            <CopyInput />
            <Text slot="description">Phoenix 服务器版本</Text>
          </CopyField>
        </form>
      </Card>
      <Card title="数据库使用">
        <View padding="size-200">
          <DBUsagePieChart query={data} />
        </View>
      </Card>
      <IsAdmin>
        <div css={fullWidthCSS}>
          <APIKeysCard />
        </div>
        <div css={fullWidthCSS}>
          <UsersCard />
        </div>
      </IsAdmin>
      <CanManageRetentionPolicy>
        <div css={fullWidthCSS}>
          <GlobalRetentionPolicyCard />
        </div>
      </CanManageRetentionPolicy>
    </div>
  );
}
