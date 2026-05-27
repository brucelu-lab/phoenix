import { css } from "@emotion/react";
import { useMemo } from "react";
import { useRouteError } from "react-router";

import { Button, ExternalLink, Flex } from "@phoenix/components";
import { isConnectionTimeoutError } from "@phoenix/components/exception/isConnectionTimeoutError";

export function ErrorElement() {
  const error = useRouteError();

  const content = useMemo(() => {
    if (error instanceof Error && error.message === "Failed to fetch") {
      // We know this means the server disconnected
      return <NotFoundContent />;
    }
    if (error instanceof Error && isConnectionTimeoutError(error)) {
      // Load balancer or proxy timed out before server could respond
      return <ConnectionTimeoutContent />;
    }
    return <ErrorContent error={error} />;
  }, [error]);
  return (
    <main
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `}
    >
      <section
        css={css`
          width: 500px;
          /* Add spacing on the bottom so it gets pushed down */
          margin-top: 200px;
          display: flex;
          flex-direction: column;
        `}
      >
        {content}
      </section>
    </main>
  );
}

function NotFoundContent() {
  return (
    <>
      <Flex direction="column" width="100%" alignItems="center">
        <h1>服务器已断开</h1>
      </Flex>
      <p>
        We are unable to reach the Phoenix server. Please ensure that Phoenix is
        running and try again.
      </p>
    </>
  );
}

function ConnectionTimeoutContent() {
  return (
    <>
      <Flex direction="column" width="100%" alignItems="center">
        <h1>连接超时</h1>
      </Flex>
      <p>
        The connection to the Phoenix server timed out before a response was
        received. This typically happens when a load balancer or proxy closes
        the connection before the server can respond.
      </p>
      <p>Possible solutions:</p>
      <ul
        css={css`
          margin: var(--global-dimension-static-size-100) 0;
          padding-left: var(--global-dimension-static-size-300);
        `}
      >
        <li>增加负载均衡器或代理超时设置</li>
        <li>检查 Phoenix 服务器是否过载或响应缓慢</li>
        <li>验证组件间网络连通性</li>
      </ul>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          gap: var(--global-dimension-static-size-100);
        `}
      >
        <Button
          variant="primary"
          size="S"
          onPress={() => {
            window.location.reload();
          }}
        >
          Retry
        </Button>
      </div>
    </>
  );
}

function ErrorContent({ error }: { error: unknown }) {
  return (
    <>
      <Flex direction="column" width="100%" alignItems="center">
        <h1>出错了</h1>
      </Flex>
      <p>
        We strive to do our very best but 🐛 bugs happen. It would mean a lot to
        us if you could file a an issue. If you feel comfortable, please include
        the error details below in your issue. We will get back to you as soon
        as we can.
      </p>
      <p
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          gap: var(--global-dimension-static-size-100);
        `}
      >
        <span
          css={css`
            display: inline-flex;
            flex-direction: row;
            align-items: baseline;
            gap: 0.2em;
          `}
        >
          💙 the
          <ExternalLink href="mailto:phoenix-devs@arize.com">
            phoenix team
          </ExternalLink>
        </span>
      </p>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          gap: var(--global-dimension-static-size-100);
        `}
      >
        <ExternalLink href="https://github.com/Arize-ai/phoenix/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D">
          file an issue with us
        </ExternalLink>

        <Button
          variant="primary"
          size="S"
          onPress={() => {
            window.location.href = "/";
          }}
        >
          Return Home
        </Button>
      </div>
      <details open>
        <summary>error details</summary>
        <pre
          css={css`
            white-space: pre-wrap;
            overflow-wrap: break-word;
            overflow: hidden;
            overflow-y: auto;
            max-height: 500px;
          `}
        >
          {error instanceof Error ? error.message : null}
        </pre>
      </details>
    </>
  );
}
