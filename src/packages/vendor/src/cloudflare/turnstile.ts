
import { z } from 'zod'

export type TurnstileValidationResponse = z.infer<typeof TurnstileValidationResponse>;
export const TurnstileValidationResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    challenge_ts: z.iso.datetime().optional(),
    hostname: z.string().optional(),
    ['error-codes']: z.string().array().optional(),
    action: z.string().optional(),
    cdata: z.string().optional(),
  }),
  z.object({
    success: z.literal(false),
    ['error-codes']: z.string().array(),
  })
])

/**
 * From: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/#api-response-format
 * @param secret 
 * @param token 
 * @param remoteip 
 * @returns 
 */
export async function validateTurnstile(secret: string, token: string, remoteip?: string): Promise<TurnstileValidationResponse> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secret,
        response: token,
        remoteip: remoteip,
      }),
    });

    const result = await response.json();
    const parsed = TurnstileValidationResponse.parse(result);
    return parsed;
  } catch (error) {
    console.error("Turnstile validation error:", error);
    return { success: false, "error-codes": ["internal-error"] };
  }
}
