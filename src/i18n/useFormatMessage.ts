import { useCallback } from 'react';
import type { MessageFormatElement } from 'react-intl';
import { useIntl } from 'react-intl';
import { getDefaultMessage } from './utils';

type Values = Record<string, unknown>;

interface FormatMessageOptions {
  id: string;
  defaultMessage?: string;
  values?: Values;
}

export const useFormatMessage = () => {
  const intl = useIntl();

  const formatMessage = useCallback(
    (
      idOrDescriptor: string | { id: string; defaultMessage?: string; values?: Values; description?: string | number | object | MessageFormatElement[] },
      values?: Values,
    ): string => {
      if (typeof idOrDescriptor === 'string') {
        return intl.formatMessage(
          {
            id: idOrDescriptor,
            defaultMessage: getDefaultMessage(idOrDescriptor),
          },
          values,
        );
      }

      const { id, defaultMessage, values: descriptorValues } = idOrDescriptor;
      return intl.formatMessage(
        {
          ...idOrDescriptor,
          id,
          defaultMessage: defaultMessage ?? getDefaultMessage(id),
        },
        values ?? descriptorValues,
      );
    },
    [intl],
  );

  return formatMessage;
};
