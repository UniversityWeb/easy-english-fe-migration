import React from 'react';
import { Flex } from '@chakra-ui/react';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';
import Footer from '~/components/Footer';

const StudentPageLayout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <NavbarForStudent />

      <Flex direction="column" flex="1">
        {children}
      </Flex>

      <Footer />
    </Flex>
  );
};

export default StudentPageLayout;
