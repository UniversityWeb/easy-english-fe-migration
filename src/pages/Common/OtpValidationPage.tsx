import {
  Alert,
  Button,
  Card,
  CardBody,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import config from '~/config';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import AuthService from '~/services/authService';
import { useLocation, useNavigate } from 'react-router-dom';
import useCustomToast from '~/hooks/useCustomToast';
import { OTP_LENGTH } from '~/utils/constants';

const OtpValidationPage = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const navigate = useNavigate();
  const { successToast, errorToast } = useCustomToast();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const validateOtp = () => {
    if (!otp) {
      errorToast('OTP is required.');
      return false;
    }

    if (otp.length !== OTP_LENGTH) {
      errorToast(`OTP must be ${OTP_LENGTH} digits long.`);
      return false;
    }

    return true;
  };

  const handleValidateOtp = async () => {
    if (!validateOtp()) return;

    setIsLoading(true);
    const activeAccountRequest = {username, otp};
    try {
      const response = await AuthService.activeAccount(activeAccountRequest)
      successToast(response.message);
      navigate(config.routes.login);
    } catch (e) {
      errorToast(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    try {
      await AuthService.resendOTPToActiveAccount(username);
      setMessage('OTP sent successfully!');
      setError(false);
    } catch (e) {
      setMessage(e.message);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center height="100vh">
      <VStack spacing={4} align="center">
        <Image boxSize="200px" src={TransientAppLogo} alt="Logo" />
        <Heading size="md">Validate OTP</Heading>
        <Text>Please enter the OTP sent to your email</Text>
        <Card mt={6} p="2rem" w={'400px'}>
          <CardBody>
            <Stack spacing={6}>
              <FormControl id="otp" isRequired>
                <FormLabel>OTP</FormLabel>
                <Input
                  type="text"
                  size="lg"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                />
              </FormControl>

              <Button
                bg="cyan.600"
                color="white"
                isLoading={isLoading}
                loadingText="Validating"
                width="full"
                size="lg"
                borderRadius="xl"
                mt={6}
                onClick={handleValidateOtp}
              >
                Validate OTP
              </Button>

              <Text align={'center'} mt={6}>
                Didn't receive the OTP?{' '}
                <Button variant="link" color={'blue.400'} onClick={resendOtp} isLoading={isLoading}>
                  Resend OTP
                </Button>
                {message && (
                  <Alert status={error ? 'error' : 'success'} mt={4}>
                    {message}
                  </Alert>
                )}
              </Text>

              <Text align={'center'} mt={4}>
                <Button variant="link" color="blue.500" mr={4} onClick={() => navigate(config.routes.register)}>
                  Go to Register
                </Button>
                <Button variant="link" color="blue.500" onClick={() => navigate(config.routes.login)}>
                  Go to Login
                </Button>
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </VStack>
    </Center>
  );
};

export default OtpValidationPage;
