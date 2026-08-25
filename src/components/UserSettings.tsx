import React, { useEffect } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCustomToast from '~/hooks/useCustomToast';
import userService from '~/services/userService';
import { useTranslation } from 'react-i18next';

// Validation schema
const schema = yup.object().shape({
  autoReplyEnabled: yup.boolean(),
  autoReplyMessage: yup.string().when('autoReplyEnabled', {
    is: true,
    then: () => yup.string().required('Auto-reply message is required'),
    otherwise: () => yup.string().notRequired(),
  }),
});

const UserSettings = ({ user }) => {
  const { successToast, errorToast } = useCustomToast();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      autoReplyEnabled: false,
      autoReplyMessage: '',
    },
  });

  const autoReplyEnabled = useWatch({
    control,
    name: 'autoReplyEnabled',
    defaultValue: false,
  });

  useEffect(() => {
    if (user) {
      const settings = user?.settings;
      reset({
        autoReplyEnabled: settings?.autoReplyEnabled ?? false,
        autoReplyMessage: settings?.autoReplyMessage ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (settings) => {
    console.log('Submitted:', settings);

    try {
      if (!settings.autoReplyEnabled) {
        settings.autoReplyMessage = '';
      }
      await userService.updateOwnSettings(settings);

      successToast('Settings saved.');
    } catch (error) {
      console.error('Failed to update settings:', error);
      errorToast('Error saving settings.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Controller
          control={control}
          name="autoReplyEnabled"
          render={({ field }) => (
            <Checkbox isChecked={field.value} onChange={field.onChange}>
              {t('settings.auto_reply')}
            </Checkbox>
          )}
        />

        {autoReplyEnabled && (
          <FormControl isInvalid={!!errors.autoReplyMessage}>
            <FormLabel>{t('settings.til_reply_msg')}</FormLabel>
            <Textarea
              placeholder={t('settings.note_reply_msg')}
              {...register('autoReplyMessage')}
            />
            {errors.autoReplyMessage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.autoReplyMessage.message}
              </p>
            )}
          </FormControl>
        )}

        <Button
          bg="cyan.600"
          color="white"
          size="md"
          width="fit-content"
          type="submit"
          isLoading={isSubmitting}
        >
          Save Settings
        </Button>
      </Stack>
    </form>
  );
};

export default UserSettings;
