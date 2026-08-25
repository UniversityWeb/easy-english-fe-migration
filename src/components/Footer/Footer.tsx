import React from 'react';
import { Box, Center, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <Box p={4} bg="var(--secondary-color)">
      <Center flexDirection="column" color="white">
        <Text fontSize="sm" as="i">
          {t('common.author_footer')}
        </Text>
      </Center>
    </Box>
  );
}
export default Footer;
