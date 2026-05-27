import { MessageAction } from "@phoenix/components/ai/message/MessageAction";
import { MessageActions } from "@phoenix/components/ai/message/MessageActions";
import { Icon, Icons } from "@phoenix/components/core/icon";

export type FeedbackValue = "positive" | "negative";

export function FeedbackActionToolbar({
  onAnnotate,
  selectedFeedback,
  isSubmittingFeedback = false,
  onFeedback,
}: {
  onAnnotate?: () => void;
  selectedFeedback: FeedbackValue | null;
  isSubmittingFeedback?: boolean;
  onFeedback: ({ feedback }: { feedback: FeedbackValue }) => void;
}) {
  const isPositiveSelected = selectedFeedback === "positive";
  const isNegativeSelected = selectedFeedback === "negative";

  return (
    <MessageActions aria-label="反馈操作">
      {onAnnotate ? (
        <MessageAction
          label="标注"
          tooltip="标注"
          onPress={() => {
            onAnnotate();
          }}
        >
          <Icon svg={<Icons.EditOutline />} />
        </MessageAction>
      ) : null}
      <MessageAction
        label="赞"
        tooltip={
          isPositiveSelected
            ? "Remove positive feedback"
            : "Set feedback to positive"
        }
        isDisabled={isSubmittingFeedback}
        onPress={() => {
          onFeedback({ feedback: "positive" });
        }}
      >
        <Icon
          svg={<Icons.ThumbsUpOutline />}
          color={isPositiveSelected ? "success" : "inherit"}
        />
      </MessageAction>
      <MessageAction
        label="踩"
        tooltip={
          isNegativeSelected
            ? "Remove negative feedback"
            : "Set feedback to negative"
        }
        isDisabled={isSubmittingFeedback}
        onPress={() => {
          onFeedback({ feedback: "negative" });
        }}
      >
        <Icon
          svg={<Icons.ThumbsDownOutline />}
          color={isNegativeSelected ? "danger" : "inherit"}
        />
      </MessageAction>
    </MessageActions>
  );
}
