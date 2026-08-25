import { Box, Icon } from '@chakra-ui/react';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Icon as={FaStar} key={i} color="orange" />);
    } else if (i === Math.floor(rating) + 1 && rating % 1 > 0) {
      stars.push(<Icon as={FaStarHalfAlt} key={i} color="orange" />);
    } else {
      stars.push(<Icon as={FaRegStar} key={i} color="gray.300" />);
    }
  }

  return <Box display="flex">{stars}</Box>;
};

export default StarRating;
