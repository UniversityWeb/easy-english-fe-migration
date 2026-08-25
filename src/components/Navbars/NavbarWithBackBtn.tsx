import { useNavigate } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import React from 'react';

const NavbarWithBackBtn = ({ returnUrl, backBtnTitle }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (returnUrl) {
      // Kiểm tra nếu returnUrl là URL tuyệt đối
      if (returnUrl.startsWith('http://') || returnUrl.startsWith('https://')) {
        window.location.href = returnUrl; // Điều hướng bằng window.location cho URL tuyệt đối
      } else {
        navigate(returnUrl); // Điều hướng bằng navigate cho đường dẫn tương đối
      }
    } else {
      navigate(-1); // Quay lại trang trước đó
    }
  };
  return (
    <Flex
      bg="gray.800"
      color="white"
      px="8"
      py="4"
      alignItems="center"
      w="full"
    >
      <Button
        leftIcon={<MdArrowBack />}
        variant="ghost"
        colorScheme="whiteAlpha"
        onClick={handleBackClick}
      >
        {backBtnTitle || 'Back to course'}
      </Button>
    </Flex>
  );
};

export default NavbarWithBackBtn;
