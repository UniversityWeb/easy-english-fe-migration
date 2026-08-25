import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  fonts: {
    body: "'Nunito Sans', sans-serif",
    heading: "'Nunito Sans', sans-serif",
  },
  colors: {
    customBlue: {
      500: '#007AFF',
    },
    gold: {
      500: '#FFB546',
    },
  },
});

export default customTheme;
