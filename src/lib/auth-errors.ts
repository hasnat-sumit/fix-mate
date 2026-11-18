type AuthClientError = {
  code?: string;
  message?: string;
  status: number;
};

export type AuthErrorKind = "duplicate-email" | "other";

/**
 * Turns a Better Auth client error into a message a visitor can act on.
 * Server messages are only shown for validation (400) and suspension (403), which are written for users.
 */
export function describeAuthError(error: AuthClientError): { message: string; kind: AuthErrorKind } {
  if (error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" || error.code === "USER_ALREADY_EXISTS") {
    return { message: "An account with this email already exists.", kind: "duplicate-email" };
  }

  switch (error.status) {
    case 400:
      return { message: error.message || "Please check the details you entered.", kind: "other" };
    case 401:
      return { message: "Incorrect email or password.", kind: "other" };
    case 403:
      return { message: error.message || "This account can’t sign in right now.", kind: "other" };
    case 429:
      return { message: "Too many attempts. Please wait a minute and try again.", kind: "other" };
    default:
      return { message: "We couldn’t reach FixMate right now. Please try again in a moment.", kind: "other" };
  }
}

export const unreachableError = describeAuthError({ status: 0 });
