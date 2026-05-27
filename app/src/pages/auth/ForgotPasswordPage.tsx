import { css } from "@emotion/react";
import { useState } from "react";

import { Flex, Heading, Link } from "@phoenix/components";

import { AuthLayout } from "./AuthLayout";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export function ForgotPasswordPage() {
  const [resetSent, setResetSent] = useState<boolean>(false);
  const content = resetSent ? (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap="size-100"
    >
      <Heading level={1}>请检查邮箱</Heading>
      <p>
        {`Thanks! If an account with that email address exists, we sent you a link to reset your password.`}
      </p>
    </Flex>
  ) : (
    <>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap="size-100"
      >
        <Heading level={1}>忘记密码</Heading>
        <p>
          {`Enter the email address associated with your account and we'll send you
        a link to reset your password.`}
        </p>
      </Flex>
      <ForgotPasswordForm onResetSent={() => setResetSent(true)} />
    </>
  );
  return (
    <AuthLayout>
      <div
        css={css`
          & a {
            text-align: center;
            width: 100%;
            display: block;
            text-align: center;
            padding-top: var(--global-dimension-size-200);
          }
        `}
      >
        {content}
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap="size-200"
        >
          <Link to="/login">返回登录</Link>
        </Flex>
      </div>
    </AuthLayout>
  );
}
