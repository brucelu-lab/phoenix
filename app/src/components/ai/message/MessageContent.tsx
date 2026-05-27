import { messageContentCSS } from "./styles";
import type { MessageContentProps } from "./types";

/**
 * Visual container for a message's body. Styling adapts based on the
 * parent {@link Message}'s `from` prop — user messages render as a
 * right-aligned bubble, assistant messages span the full width.
 *
 * @example
 * ```tsx
 * <Message from="user">
 *   <MessageContent>纯文本内容</MessageContent>
 * </Message>
 * ```
 */
export function MessageContent({
  children,
  ref,
  ...restProps
}: MessageContentProps) {
  return (
    <div ref={ref} css={messageContentCSS} {...restProps}>
      {children}
    </div>
  );
}
