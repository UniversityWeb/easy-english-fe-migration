import { useTranslation } from 'react-i18next';
import { Box, Text, Button, Stack } from '@chakra-ui/react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
      <Text mb={2} fontWeight="bold">
        {t('language.current')}: {currentLanguage}
      </Text>
      <Stack direction="row" spacing={4}>
        <Button
          textColor="white"
          bg={currentLanguage === 'en' ? 'cyan.600' : 'gray.400'}
          onClick={() => changeLanguage('en')}
        >
          {t('language.english')}
        </Button>
        <Button
          textColor="white"
          bg={currentLanguage === 'vi' ? 'cyan.600' : 'gray.400'}
          onClick={() => changeLanguage('vi')}
        >
          {t('language.vietnamese')}
        </Button>
      </Stack>
    </Box>
  );
};

export default LanguageSwitcher;
