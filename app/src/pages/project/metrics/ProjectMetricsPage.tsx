import { css } from "@emotion/react";
import React, { memo, Suspense, useMemo, useRef } from "react";
import { useParams } from "react-router";

import {
  Flex,
  Heading,
  Loading,
  Text,
  useTimeRange,
  View,
} from "@phoenix/components";
import { ErrorBoundary } from "@phoenix/components/exception";
import { ONE_MONTH_MS } from "@phoenix/constants/timeConstants";
import { TopModelsByCost } from "@phoenix/pages/project/metrics/TopModelsByCost";
import { TopModelsByToken } from "@phoenix/pages/project/metrics/TopModelsByToken";
import { TraceErrorsTimeSeries } from "@phoenix/pages/project/metrics/TraceErrorsTimeSeries";

import { LLMSpanCountTimeSeries } from "./LLMSpanCountTimeSeries";
import { LLMSpanErrorsTimeSeries } from "./LLMSpanErrorsTimeSeries";
import { SpanAnnotationScoreTimeSeries } from "./SpanAnnotationScoreTimeSeries";
import { ToolSpanCountTimeSeries } from "./ToolSpanCountTimeSeries";
import { ToolSpanErrorsTimeSeries } from "./ToolSpanErrorsTimeSeries";
import { TraceCountTimeSeries } from "./TraceCountTimeSeries";
import { TraceLatencyPercentilesTimeSeries } from "./TraceLatencyPercentilesTimeSeries";
import { TraceTokenCostTimeSeries } from "./TraceTokenCostTimeSeries";
import { TraceTokenCountTimeSeries } from "./TraceTokenCountTimeSeries";

interface MetricPanelHeaderProps {
  title: string;
  subtitle?: string;
}

function MetricPanelHeader({ title, subtitle }: MetricPanelHeaderProps) {
  return (
    <div
      css={css`
        padding: var(--global-dimension-size-100) var(--global-dimension-size-200) 0
          var(--global-dimension-size-200);

        display: flex;
        flex-direction: row;
        gap: var(--global-dimension-size-100);
      `}
      className="dashboard-panel-header"
    >
      <Flex direction="column">
        <Heading>{title}</Heading>
        {subtitle && (
          <Text size="XS" color="gray-600">
            {subtitle}
          </Text>
        )}
      </Flex>
    </div>
  );
}

interface MetricPanelProps extends MetricPanelHeaderProps {
  children: React.ReactNode;
}

export function MetricPanel({
  ref,
  title,
  subtitle,
  children,
}: MetricPanelProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <View
      borderWidth="thin"
      borderColor="gray-200"
      borderRadius="medium"
      height="100%"
      width="100%"
      data-testid={`dashboard-panel`}
      backgroundColor="gray-75"
      ref={ref}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          height: 100%;
        `}
      >
        <MetricPanelHeader title={title} subtitle={subtitle} />
        <div
          css={css`
            flex: 1 1 auto;
            padding: var(--global-dimension-size-200);
            height: 190px;
            overflow: auto;
          `}
        >
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </View>
  );
}

type EpochTimeRange = {
  start: number;
  end: number;
};

/**
 * Hook that converts an open time range from context into a closed time range.
 * If the time range is already closed, it returns it as-is.
 * If it's open, it fills in missing start/end values based on a frozen "now" timestamp.
 *
 * The "now" timestamp is frozen and only updates when the context time range actually changes,
 * preventing unnecessary recalculations on every render.
 */
function useClosedTimeRange(): EpochTimeRange {
  const { timeRange: contextTimeRange } = useTimeRange();

  // Extract and memoize timestamps to get stable primitive values
  const startMs = useMemo(
    () => (contextTimeRange.start ? contextTimeRange.start.getTime() : null),
    [contextTimeRange.start]
  );
  const endMs = useMemo(
    () => (contextTimeRange.end ? contextTimeRange.end.getTime() : null),
    [contextTimeRange.end]
  );

  // Use a ref to freeze "now" until the context time range actually changes
  const lastTimestampsRef = useRef({ startMs, endMs });
  // eslint-disable-next-line react-hooks/purity
  const frozenNowMsRef = useRef<number>(Date.now());

  // Only update frozen "now" when timestamps actually change
  if (
    lastTimestampsRef.current.startMs !== startMs ||
    lastTimestampsRef.current.endMs !== endMs
  ) {
    lastTimestampsRef.current = { startMs, endMs };
    // eslint-disable-next-line react-hooks/purity
    frozenNowMsRef.current = Date.now();
  }

  const frozenNowMs = frozenNowMsRef.current;

  const epochTimeRange = useMemo<EpochTimeRange>(() => {
    let start = startMs;
    let end = endMs;
    if (start !== null && end !== null) {
      // closed range from context
      return { start, end };
    } else if (start === null && end !== null) {
      return { start: end - ONE_MONTH_MS, end };
    } else if (start !== null && end === null) {
      // If start is in the past, close at "now"; else, one month after start
      end = start < frozenNowMs ? frozenNowMs : start + ONE_MONTH_MS;
      return { start, end };
    } else {
      // both null → last month to now
      end = frozenNowMs;
      start = end - ONE_MONTH_MS;
      return { start, end };
    }
  }, [startMs, endMs, frozenNowMs]);

  return epochTimeRange;
}

export function ProjectMetricsPage() {
  const { projectId } = useParams();
  if (!projectId) {
    throw new Error("projectId is required");
  }

  const epochTimeRange = useClosedTimeRange();

  return (
    <main
      css={css`
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow-y: auto;
      `}
    >
      <MetricPanels projectId={projectId} epochTimeRange={epochTimeRange} />
    </main>
  );
}
const MetricPanels = memo(function MetricPanels({
  projectId,
  epochTimeRange,
}: {
  projectId: string;
  epochTimeRange: EpochTimeRange;
}) {
  const timeRange = useMemo(
    () => ({
      start: new Date(epochTimeRange.start),
      end: new Date(epochTimeRange.end),
    }),
    [epochTimeRange]
  );
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: var(--global-dimension-size-200);
        padding: var(--global-dimension-size-200);
      `}
    >
      <Flex direction="row" gap="size-200">
        <MetricPanel
          title="追踪流量"
          subtitle="追踪总流量"
        >
          <TraceCountTimeSeries projectId={projectId} timeRange={timeRange} />
        </MetricPanel>
        <MetricPanel
          title="异常追踪"
          subtitle="异常追踪总流量"
        >
          <TraceErrorsTimeSeries projectId={projectId} timeRange={timeRange} />
        </MetricPanel>
      </Flex>
      <Flex direction="row" gap="size-200">
        <MetricPanel title="追踪延迟" subtitle="延迟分位数">
          <TraceLatencyPercentilesTimeSeries
            projectId={projectId}
            timeRange={timeRange}
          />
        </MetricPanel>
        <MetricPanel
          title="标注分数"
          subtitle="平均标注分数"
        >
          <SpanAnnotationScoreTimeSeries
            projectId={projectId}
            timeRange={timeRange}
          />
        </MetricPanel>
      </Flex>
      <Flex direction="row" gap="size-200">
        <MetricPanel title="成本" subtitle="预估成本（美元）">
          <TraceTokenCostTimeSeries
            projectId={projectId}
            timeRange={timeRange}
          />
        </MetricPanel>
        <MetricPanel title="按成本排序的 Top 模型">
          <TopModelsByCost projectId={projectId} timeRange={timeRange} />
        </MetricPanel>
      </Flex>
      <Flex direction="row" gap="size-200">
        <MetricPanel
          title="Token 用量"
          subtitle="提示词与补全的 Token 用量"
        >
          <TraceTokenCountTimeSeries
            projectId={projectId}
            timeRange={timeRange}
          />
        </MetricPanel>
        <MetricPanel title="按 Token 数排序的 Top 模型">
          <TopModelsByToken projectId={projectId} timeRange={timeRange} />
        </MetricPanel>
      </Flex>
      <Flex direction="row" gap="size-200">
        <MetricPanel title="LLM 跨度" subtitle="LLM 跨度数量">
          <LLMSpanCountTimeSeries projectId={projectId} timeRange={timeRange} />
        </MetricPanel>
        <MetricPanel
          title="异常 LLM 跨度"
          subtitle="异常 LLM 跨度趋势"
        >
          <LLMSpanErrorsTimeSeries
            projectId={projectId}
            timeRange={timeRange}
          />
        </MetricPanel>
      </Flex>
      <Flex direction="row" gap="size-200">
        <MetricPanel title="工具跨度" subtitle="工具跨度数量">
          <ToolSpanCountTimeSeries
            projectId={projectId}
            timeRange={timeRange}
          />
        </MetricPanel>
        <MetricPanel
          title="异常工具跨度"
          subtitle="异常工具跨度趋势"
        >
          <ToolSpanErrorsTimeSeries
            projectId={projectId}
            timeRange={timeRange}
          />
        </MetricPanel>
      </Flex>
    </div>
  );
});
