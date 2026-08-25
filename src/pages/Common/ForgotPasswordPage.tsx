import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from '@chakra-ui/react';
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import authService from '~/services/authService';
import useCustomToast from '~/hooks/useCustomToast';
import config from '~/config';
import { validatePassword } from '~/utils/methods';
import ValidationErrors from '~/components/ValidationErrors';
import OTPInput from 'react-otp-input';

const INPUT_TYPES = {
  EMAIL: 'EMAIL',
  PASSWORD_AND_OTP: 'PASSWORD_AND_OTP',
};

const ForgotPasswordForm = ({
  email,
  setEmail,
  handleResetPassword,
  isLoading,
}) => (
  <form onSubmit={handleResetPassword}>
    <FormLabel fontSize="md" fontWeight="medium">
      Email
    </FormLabel>
    <Input
      type="email"
      placeholder="Enter your email"
      size="md"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <Button
      mt={5}
      bg="cyan.600"
      color="white"
      loadingText="Loading"
      type="submit"
      width="full"
      size="sm"
      borderRadius="xl"
      p={6}
      isLoading={isLoading}
      disabled={!email}
    >
      Reset Password
    </Button>
  </form>
);

const PasswordResetForm = ({
  passwordData,
  setPasswordData,
  handlePasswordChange,
  handleUpdatePassWithOtp,
  isLoading,
}) => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <form onSubmit={handleUpdatePassWithOtp}>
      <Box gap={6} mb={6}>
        <FormControl isRequired mb={6}>
          <FormLabel>New Password</FormLabel>
          <InputGroup>
            <Input
              id="password"
              name="password"
              placeholder="********"
              type={showPassword ? 'text' : 'password'}
              size="lg"
              value={passwordData.password}
              onChange={handlePasswordChange}
            />
            <InputRightElement h={'full'}>
              <Button
                variant={'ghost'}
                onClick={togglePasswordVisibility}
                cursor="pointer"
              >
                {showPassword ? (
                  <ViewIcon color="cyan.700" />
                ) : (
                  <ViewOffIcon color="cyan.700" />
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl isRequired mb={6}>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="********"
              type={showPassword ? 'text' : 'password'}
              size="lg"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
            <InputRightElement h={'full'}>
              <Button
                variant={'ghost'}
                onClick={toggleConfirmPasswordVisibility}
                cursor="pointer"
              >
                {showConfirmPassword ? (
                  <ViewIcon color="cyan.700" />
                ) : (
                  <ViewOffIcon color="cyan.700" />
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="otp" mb={6} isRequired>
          <FormLabel>Enter OTP</FormLabel>
          <OTPInput
            value={passwordData.otp}
            onChange={(otp) =>
              setPasswordData({ ...passwordData, otp: otp })
            }
            numInputs={6}
            separator={<span>-</span>}
            inputStyle={{
              width: '40px',
              height: '40px',
              margin: '0 5px',
              fontSize: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #eaeaea',
            }}
            focusStyle={{
              borderColor: '#00B5D8',
              boxShadow: '0 0 0 1px rgba(0, 163, 255, 0.5)',
            }}
            renderInput={(props) => (
              <input
                {...props}
                type="number"
                style={{
                  width: "50px",
                  height: "50px",
                  margin: "0 5px",
                  fontSize: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px solid #eaeaea",
                }}
              />
            )}
          />
        </FormControl>

      </Box>
      <Button
        mt={5}
        bg="cyan.600"
        color="white"
        loadingText="Loading"
        type="submit"
        width="full"
        size="sm"
        borderRadius="xl"
        p={6}
        isLoading={isLoading}
      >
        Reset Password
      </Button>
    </form>
  );
}

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { successToast, errorToast } = useCustomToast();
  const [validationErrors, setValidationErrors] = useState([]);
  const [inputType, setInputType] = useState(INPUT_TYPES.EMAIL);
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
    otp: '',
  });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationErrors([]);
    try {
      await authService.generateOtpToResetPassword(email);
      successToast('Otp sent to email successfully');
      setInputType(INPUT_TYPES.PASSWORD_AND_OTP);
    } catch (error) {
      setInputType(INPUT_TYPES.EMAIL);
      setValidationErrors([error.message]);
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassWithOtp = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
    setIsLoading(true);
    try {
      const resetPassReq = {
        email: email,
        otp: passwordData.otp,
        newPassword: passwordData.password,
      };
      await authService.resetPasswordWithOtp(resetPassReq);
      successToast('Password reset successfully');
      setInputType(INPUT_TYPES.EMAIL);
    } catch (error) {
      setValidationErrors(['Failed to reset password']);
      console.error('OTP verification failed:', error);
      setInputType(INPUT_TYPES.PASSWORD_AND_OTP);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    if (name === 'password' || name === 'confirmPassword') {
      const errors = validatePassword(
        name === 'password' ? value : passwordData.password,
        name === 'confirmPassword' ? value : passwordData.confirmPassword,
      );
      setValidationErrors(errors);
    }
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="100px"
      p="6"
      boxShadow="lg"
      borderRadius="md"
      textAlign="center"
      bg="white"
    >
      <HStack mb={4}>
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Go back"
          onClick={() => window.history.back()}
          variant="ghost"
        />
        <Heading size="md">Restore Password</Heading>
      </HStack>

      {inputType === INPUT_TYPES.EMAIL ? (
        <ForgotPasswordForm
          email={email}
          setEmail={setEmail}
          handleResetPassword={handleResetPassword}
          isLoading={isLoading}
        />
      ) : (
        <PasswordResetForm
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          handlePasswordChange={handlePasswordChange}
          handleUpdatePassWithOtp={handleResetPassWithOtp}
          isLoading={isLoading}
        />
      )}

      <Box mt={5}>
        <ValidationErrors errors={validationErrors} />
      </Box>

      <Box mt={6} borderTop="1px solid #eaeaea" pt={4}>
        <Text>
          No account?{' '}
          <Link as={RouterLink} to={config.routes.register} color="blue.500">
            Register
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
