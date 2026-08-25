import React from 'react';
import { Box } from '@chakra-ui/react';

const SidebarItem = ({ icon: Icon, text, isActive, handleClick, size = 22 }) => {
  return (
    <Box
      w="100%"
      onClick={handleClick}
      className="drawer__item"
      style={{ textDecoration: 'none', border: 'none', cursor: 'pointer' }}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      padding="10px"
      _hover={{
        transform: 'scale(1.05)',
        transition: 'transform 0.2s ease',
        backgroundColor: isActive ? '#e2e2e2' : '#f8f8f8',
        cursor: 'pointer',
      }}
    >
      {Icon && <Icon style={{ fontSize: size }} />}
      <p style={{ marginLeft: '10px' }}>{text}</p>
    </Box>
  );
};

export default SidebarItem;
