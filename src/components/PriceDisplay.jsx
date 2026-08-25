import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { formatVNDMoney } from '~/utils/methods';

const PriceDisplay = ({ priceResponse = {}, primaryColor = 'red.500', secondaryColor = 'gray.500', fontWeight = 'bold', align = 'center' }) => {
  // Destructure with default values
  const {
    price = 0,
    salePrice = 0,
    startDate = null,
    endDate = null,
    isActive = false,
  } = priceResponse;

  // Current date
  const now = new Date();

  // Check if the date range is valid
  const isValidDateRange =
    startDate &&
    endDate &&
    new Date(startDate) <= now &&
    now <= new Date(endDate);

  return (
    <Flex align={align} direction={price !== salePrice && price > 0 ? 'column' : 'row'} minH="48px">
      {isActive && isValidDateRange ? (
        // Show sale price with original price strikethrough
        <>
          {price !== salePrice && price > 0 && (
            <Text as="s" color={secondaryColor}>
              {formatVNDMoney(price)}
            </Text>
          )}
          <Text fontWeight={fontWeight} color={primaryColor}>
            {formatVNDMoney(salePrice)}
          </Text>
        </>
      ) : (
        // Show only the original price
        <Text fontWeight={fontWeight} color={primaryColor}>
          {formatVNDMoney(price)}
        </Text>
      )}
    </Flex>
  );
};

export default PriceDisplay;
