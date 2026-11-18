type SendResult = { error: { message: string; name?: string } | null };

// resend.emails.send() does not throw on API errors (e.g. 403 domain not verified),
// it returns { error }. Throw so callers can log and report the failure.
export function assertEmailsSent(results: Record<string, SendResult>): void {
  const failures = Object.entries(results)
    .filter(([, result]) => result.error)
    .map(([label, result]) => `${label}: ${result.error?.name ?? 'error'} - ${result.error?.message}`);

  if (failures.length > 0) {
    console.error('Resend email failure:', failures);
    throw new Error(`Failed to send email(s): ${failures.join('; ')}`);
  }
}
