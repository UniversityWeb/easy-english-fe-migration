import React, { useEffect, useState } from 'react';
import { Box, Collapse, HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx';
import faqService from '~/services/faqService';

const FAQ = ({ courseId }) => {
    const [faqData, setFaqData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFAQs, setOpenFAQs] = useState({});

    useEffect(() => {
        const fetchFAQs = async () => {
            setLoading(true);
            try {
                const response = await faqService.fetchFAQByCourse({ courseId });
                if (response) {
                    setFaqData(response);
                    setOpenFAQs(response.reduce((acc, faq) => ({ ...acc, [faq.id]: false }), {}));
                }
            } catch (error) {
                console.error('Error fetching FAQ data:', error);
            }
            setLoading(false);
        };

        fetchFAQs();
    }, [courseId]);

    const toggleFAQ = (id) => {
        setOpenFAQs((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    if (loading) return <Spinner size="xl" />;

    return (
        <Box mt={4}>
            <VStack spacing={4} align="stretch">
                {faqData.map((faq) => (
                    <Box key={faq.id}>
                        <HStack justify="space-between" cursor="pointer" onClick={() => toggleFAQ(faq.id)}>
                            <Text fontWeight="medium" fontSize="lg">{faq.question}</Text>
                            <Icon as={openFAQs[faq.id] ? RxTriangleUp : RxTriangleDown}  
                            _hover={{ bg: 'gray.200', borderRadius: '50%' }}
                            _active={{ bg: 'gray.300', borderRadius: '50%' }} />
                        </HStack>
                        <Collapse in={openFAQs[faq.id]} animateOpacity>
                            <Text mt={2}>{faq.answer}</Text>
                        </Collapse>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default FAQ;
