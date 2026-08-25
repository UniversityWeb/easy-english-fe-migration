import React from 'react';
import { Flex } from '@chakra-ui/react';
import Footer from '~/components/Footer';
import RoleBasedNavbar from '~/components/Navbars/RoleBasedNavbar';
import ChatBox from '~/components/ChatBox'; // <- thêm dòng này

const RoleBasedPageLayout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <RoleBasedNavbar />
      <Flex direction="column" flex="1">
        {children}
      </Flex>
      <Footer />
      <ChatBox /> {/* <- thêm ChatBox ở ngoài cùng để nó nằm đè lên */}
    </Flex>
  );
};

export default RoleBasedPageLayout;
