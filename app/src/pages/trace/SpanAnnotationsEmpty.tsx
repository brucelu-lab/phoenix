import {
  ExternalLinkButton,
  Flex,
  Icon,
  Icons,
  Text,
  View,
} from "@phoenix/components";

export function SpanAnnotationsEmpty() {
  return (
    <View padding="size-400">
      <Flex direction="column" gap="size-100" alignItems="center">
        <Text size="L">该跨度无标注</Text>

        <ExternalLinkButton
          leadingVisual={<Icon svg={<Icons.Edit2Outline />} />}
          href="https://arize.com/docs/phoenix/tracing/how-to-tracing/feedback-and-annotations/annotating-in-the-ui"
          size="S"
        >
          How to Annotate
        </ExternalLinkButton>
      </Flex>
    </View>
  );
}
