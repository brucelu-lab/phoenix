import { useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTitleExtra,
  DialogTrigger,
  Icon,
  Icons,
  Modal,
  ModalOverlay,
} from "@phoenix/components";
import { useNotifySuccess } from "@phoenix/contexts";
import { getErrorMessagesFromRelayMutationError } from "@phoenix/utils/errorUtils";

import { SecretMutationForm } from "./SecretMutationForm";
import { useSecretMutation } from "./SecretsMutation";

export function ReplaceSecretButton({
  secretKey,
  parseError,
  connectionId,
}: {
  secretKey: string;
  /** Decrypt error from the server, when the stored secret is unparseable. */
  parseError: string | null;
  connectionId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notifySuccess = useNotifySuccess();
  const [commit, isCommitting] = useSecretMutation();

  const handleSubmit = ({ value }: { value: string }) => {
    setError(null);
    commit({
      variables: {
        input: {
          secrets: [{ key: secretKey, value: value.trim() }],
        },
        connections: [connectionId],
      },
      onCompleted: () => {
        setIsOpen(false);
        notifySuccess({
          title: "密钥已更新",
          message: `${secretKey} has been replaced.`,
        });
      },
      onError: (error) => {
        const formattedError = getErrorMessagesFromRelayMutationError(error);
        setError(formattedError?.[0] ?? error.message);
      },
    });
  };

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={(open) => {
        setError(null);
        setIsOpen(open);
      }}
    >
      <Button
        variant="default"
        leadingVisual={<Icon svg={<Icons.EditOutline />} />}
        aria-label={`Replace ${secretKey}`}
        size="S"
      />
      <ModalOverlay>
        <Modal size="M">
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>替换密钥</DialogTitle>
                <DialogTitleExtra>
                  <DialogCloseButton slot="close" />
                </DialogTitleExtra>
              </DialogHeader>
              {error ? (
                <Alert variant="danger" banner>
                  {error}
                </Alert>
              ) : null}
              {parseError && (
                <Alert variant="warning" banner>
                  Could not decrypt the stored value.
                </Alert>
              )}
              <SecretMutationForm
                title="输入新值以替换已存储的密钥。"
                fixedKey={secretKey}
                defaultKey={secretKey}
                submitLabel={isCommitting ? "Saving..." : "Save Secret"}
                isSubmitting={isCommitting}
                onSubmit={handleSubmit}
              />
            </DialogContent>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
