export type ErrorWithMessage = { message: string } | { error: { message: string } };

const hasMessage = (value: unknown): value is { message: string } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message: unknown }).message === 'string'
  );
};

const hasNestedErrorMessage = (value: unknown): value is { error: { message: string } } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as { error: unknown }).error === 'object' &&
    (value as { error: unknown }).error !== null &&
    'message' in (value as { error: { message: unknown } }).error &&
    typeof (value as { error: { message: unknown } }).error.message === 'string'
  );
};

export const getErrorMessage = (error: unknown, fallback = 'Une erreur inattendue est survenue.'): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (hasMessage(error)) {
    return error.message;
  }

  if (hasNestedErrorMessage(error)) {
    return error.error.message;
  }

  return fallback;
};
