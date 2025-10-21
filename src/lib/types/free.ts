/**
 * Mapping of response codes to their descriptions for the free mobile service.
 */
export const FreeResponseCode: Record<FreeResponseCodeKey | (number & {}), string> = {
  400: "Bad request",
  402: "Too many requests",
  403: "Service not enabled for this user",
  500: "Internal server error",
};

type FreeResponseCodeKey = 400 | 402 | 403 | 500;
