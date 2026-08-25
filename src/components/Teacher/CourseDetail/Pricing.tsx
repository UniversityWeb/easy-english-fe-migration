import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Text,
} from '@chakra-ui/react';
import priceService from '~/services/priceService';
import { formatVNDMoney } from '~/utils/methods';
import useCustomToast from '~/hooks/useCustomToast';

const Price = React.memo(({ courseId }) => {
  const [form, setForm] = useState({
    id: '',
    isActive: true,
    price: '',
    salePrice: '',
    startDate: '',
    endDate: '',
  });

  const { successToast, errorToast } = useCustomToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (courseId) {
      const fetchPrice = async () => {
        setLoading(true);
        const priceRequest = {
          courseId,
        };
        try {
          const priceData = await priceService.fetchPriceByCourse(priceRequest);
          if (priceData) {
            setForm({
              ...priceData,
            });
          }
        } catch (error) {
          errorToast('Error fetching price data.');
        } finally {
          setLoading(false);
        }
      };

      fetchPrice();
    }
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Reset errors for the field being updated
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSwitchChange = (e) => {
    setForm({ ...form, isActive: e.target.checked });
  };

  const validateForm = () => {
    const newErrors = {};
    const price = parseFloat(form.price);
    const salePrice = parseFloat(form.salePrice);

    if (!form.price) {
      newErrors.price = 'Price is required.';
    }

    if (!form.salePrice) {
      newErrors.salePrice = 'Sale price is required.';
    }
    if (price < 10000) {
      newErrors.price = 'Price at least 10,000 VND.';
    }

    if (salePrice < 10000) {
      newErrors.salePrice = 'Sale price at least 10,000 VND.';
    }

    if (salePrice > price) {
      newErrors.salePrice =
        'Sale price cannot be greater than the regular price.';
    }
    if (form.startDate && form.endDate) {
      const startDate = new Date(form.startDate);
      const endDate = new Date(form.endDate);

      if (startDate > endDate) {
        newErrors.startDate = 'Start date cannot be later than end date.';
        newErrors.endDate = 'End date cannot be earlier than start date.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleUpdatePrice = async () => {
    if (!validateForm()) {
      return;
    }

    const priceRequest = {
      id: form.id,
      isActive: form.isActive,
      price: parseFloat(form.price),
      salePrice: parseFloat(form.salePrice),
      startDate: form.startDate,
      endDate: form.endDate,
    };

    try {
      await priceService.updatePrice(priceRequest);
      successToast('Price updated successfully.');
    } catch (error) {
      errorToast('Error updating price.');
    }
  };

  return (
    <HStack spacing={5} align="start" h="full" justify="center">
      <Box p="8" maxW="600px" mx="auto">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <FormControl mb="4" isInvalid={!!errors.price}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                placeholder="Enter price"
              />
              {form.price && (
                <Text mt={1} fontSize="sm" color="gray.500">
                  {formatVNDMoney(form.price)}
                </Text>
              )}
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>

            <FormControl mb="4" isInvalid={!!errors.salePrice}>
              <FormLabel>Sale Price</FormLabel>
              <Input
                type="number"
                name="salePrice"
                value={form.salePrice}
                onChange={handleInputChange}
                placeholder="Enter sale price"
              />
              {form.salePrice && (
                <Text mt={1} fontSize="sm" color="gray.500">
                  {formatVNDMoney(form.salePrice)}
                </Text>
              )}
              <FormErrorMessage>{errors.salePrice}</FormErrorMessage>
            </FormControl>

            <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={4}>
              <GridItem>
                <FormControl isInvalid={!!errors.startDate}>
                  <FormLabel>Sale Start Date</FormLabel>
                  <Input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{errors.startDate}</FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isInvalid={!!errors.endDate}>
                  <FormLabel>Sale End Date</FormLabel>
                  <Input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{errors.endDate}</FormErrorMessage>
                </FormControl>
              </GridItem>
            </Grid>

            <Button colorScheme="blue" mt={4} onClick={handleUpdatePrice}>
              Update Price
            </Button>
          </>
        )}
      </Box>
    </HStack>
  );
});

export default Price;
