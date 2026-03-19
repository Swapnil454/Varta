import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Custom error types for email failures
export class EmailError extends Error {
  constructor(
    message: string,
    public code: EmailErrorCode,
    public statusCode: number = 500,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = "EmailError";
  }
}

export type EmailErrorCode =
  | "QUOTA_EXCEEDED"
  | "INVALID_API_KEY"
  | "INVALID_SENDER"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "INVALID_RECIPIENT"
  | "UNKNOWN_ERROR";

// Parse Resend error response
function parseEmailError(error: any): EmailError {
  const errorName = error?.name?.toLowerCase() || "";
  const errorMessage = error?.message?.toLowerCase() || "";

  // Handle Resend specific errors
  if (errorName === "invalid_api_key" || errorMessage.includes("api key")) {
    return new EmailError(
      "Email service configuration error",
      "INVALID_API_KEY",
      500,
      false
    );
  }

  if (errorName === "rate_limit_exceeded" || errorMessage.includes("rate limit")) {
    return new EmailError(
      "Too many email requests. Please wait a moment.",
      "RATE_LIMITED",
      429,
      true
    );
  }

  if (errorName === "validation_error") {
    if (errorMessage.includes("from")) {
      return new EmailError(
        "Email sender not verified",
        "INVALID_SENDER",
        500,
        false
      );
    }
    if (errorMessage.includes("to") || errorMessage.includes("email")) {
      return new EmailError(
        "Invalid email address",
        "INVALID_RECIPIENT",
        400,
        false
      );
    }
  }

  if (errorMessage.includes("quota") || errorMessage.includes("limit exceeded")) {
    return new EmailError(
      "Email service quota exceeded. Please try again later.",
      "QUOTA_EXCEEDED",
      503,
      true
    );
  }

  if (errorMessage.includes("unavailable") || errorMessage.includes("server error")) {
    return new EmailError(
      "Email service temporarily unavailable",
      "SERVICE_UNAVAILABLE",
      503,
      true
    );
  }

  return new EmailError(
    "Failed to send email",
    "UNKNOWN_ERROR",
    500,
    false
  );
}

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  statusCode?: number;
  error?: EmailError;
}

export async function sendMail(
  to: string,
  subject: string,
  html: string
): Promise<SendMailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      const emailError = parseEmailError(error);
      return {
        success: false,
        error: emailError,
      };
    }

    console.log("Email sent to:", to);

    return {
      success: true,
      messageId: data?.id || "resend-message",
      statusCode: 200,
    };
  } catch (error: any) {
    console.error("Resend error:", error?.message || error);

    const emailError = parseEmailError(error);
    return {
      success: false,
      error: emailError,
    };
  }
}

// Legacy wrapper for backward compatibility - throws on error
export async function sendMailOrThrow(
  to: string,
  subject: string,
  html: string
): Promise<{ messageId: string; response: number }> {
  const result = await sendMail(to, subject, html);
  if (!result.success) {
    throw result.error;
  }
  return {
    messageId: result.messageId!,
    response: result.statusCode!,
  };
}


