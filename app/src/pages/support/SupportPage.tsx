import { css } from "@emotion/react";
import type { ReactNode } from "react";

import {
  Flex,
  Heading,
  Icon,
  Icons,
  PageHeader,
  Text,
  View,
} from "@phoenix/components";

const supportItemsCSS = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--global-dimension-size-200);
  padding: var(--global-dimension-size-200);
`;

export function SupportPage() {
  return (
    <main>
      <Flex direction="column" width="100%">
        <View borderBottomColor="default" borderBottomWidth="thin">
          <PageHeader
            title="支持"
            subTitle="We are here to help. Pick a channel below to get in touch with us."
          />
        </View>
        <div css={supportItemsCSS}>
          <SupportItem
            leadingVisual={<Icon svg={<Icons.BookFilled />} />}
            href="https://arize.com/docs/phoenix"
            title="文档"
            description="访问我们的文档查看教程与 AI 支持。"
          />
          <SupportItem
            leadingVisual={<Icon svg={<Icons.GitHub />} />}
            href="https://github.com/Arize-ai/phoenix/issues"
            title="GitHub Issues"
            description="在 GitHub 提 Issue 上报 Bug 或请求新功能。"
          />
          <SupportItem
            leadingVisual={<Icon svg={<Icons.GitHub />} />}
            href="https://github.com/Arize-ai/phoenix/discussions"
            title="GitHub 讨论"
            description="在 GitHub 创建讨论以提问或反馈。"
          />
          <SupportItem
            leadingVisual={<Icon svg={<Icons.Slack />} />}
            href="https://join.slack.com/t/arize-ai/shared_invite/zt-3r07iavnk-ammtATWSlF0pSrd1DsMW7g"
            title="Slack"
            description="加入我们的 Slack 社区与其他用户和团队交流。"
          />
          <SupportItem
            leadingVisual={<Icon svg={<Icons.Slack />} />}
            href="mailto:phoenix-support@arize.com?subject=Slack%20Connect%20Request"
            title="Slack 连接"
            description="为你和你的团队获取专属支持频道。"
          />
        </div>
      </Flex>
    </main>
  );
}

const supportItemCSS = css`
  padding: var(--global-dimension-size-200) var(--global-dimension-size-200)
    var(--global-dimension-size-200);
  border: var(--global-border-size-thin) solid var(--global-border-color-default);
  border-radius: var(--global-dimension-size-100);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: var(--global-dimension-size-50);
  color: var(--global-color-text-700);
  transition: border-color 0.2s ease-in-out;
  text-decoration: none;
  &:hover {
    border-color: var(--global-color-primary);
  }
`;

const SupportItem = ({
  leadingVisual,
  href,
  title,
  description,
}: {
  leadingVisual: ReactNode;
  href: string;
  title: string;
  description: string;
}) => {
  return (
    <a css={supportItemCSS} href={href} target="_blank" rel="noreferrer">
      <Flex direction="row" gap="size-100" alignItems="center">
        {leadingVisual}
        <Heading level={2}>{title}</Heading>
      </Flex>
      <Text color="text-700">{description}</Text>
    </a>
  );
};
