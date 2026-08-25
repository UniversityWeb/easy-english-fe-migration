import {
  Button,
  Card,
  CardBody,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Select,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import config from '~/config';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import AuthService from '~/services/authService';
import { useNavigate } from 'react-router-dom';
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '~/utils/constants';
import useCustomToast from '~/hooks/useCustomToast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { successToast, errorToast } = useCustomToast();
  const [showPassword, setShowPassword] = useState(false);
  const [registerRequest, setRegisterRequest] = useState({
    username: 'john',
    password: 'P@123456789',
    fullName: 'john',
    email: 'john@gmail.com',
    phoneNumber: '+84972640891',
    gender: 'MALE',
    dob: '2024-08-05',
  });

  const validateForm = () => {
    const { username, password, fullName, email, phoneNumber, dob } =
      registerRequest;

    if (!username || username.length < MIN_USERNAME_LENGTH) {
      errorToast(
        `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`,
      );
      return false;
    }

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      errorToast(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      );
      return false;
    }

    if (!fullName) {
      errorToast('Full name is required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errorToast('Invalid email address.');
      return false;
    }

    const phoneRegex = /^\+\d{11,15}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      errorToast('Invalid phone number.');
      return false;
    }

    return validateDob(dob);
  };

  const validateDob = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    if (!dob || isNaN(birthDate.getTime())) {
      errorToast(`Invalid date of birth.`);
      return false;
    }

    if (birthDate > today) {
      errorToast(`Date of birth cannot be in the future.`);
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    console.log('handleRegister method onClick');
    if (!validateForm()) return;

    console.log(`RegisterRequest: ${registerRequest}`);
    AuthService.register(registerRequest)
      .then((registerResponse) => {
        if (!registerResponse) {
          errorToast(`Register unsuccessfully`);
          return;
        }

        successToast(registerResponse);
        navigate(config.routes.otp_validation, { state: { username: registerRequest.username } });
      })
      .catch((e) => {
        errorToast(e?.message)
      });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setRegisterRequest((prevState) => ({
      ...prevState,
      [name]: new Date(value).toISOString(),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Center>
      <VStack spacing={4} align="center">
        <Image boxSize="200px" src={TransientAppLogo} alt="Logo" />
        <Heading size="md">Create an account</Heading>
        <Text>Start making your dreams come true</Text>
        <Card mt={6} p="2rem" w={'400px'} mb={100}>
          <CardBody>
            <Stack spacing={6}>
              <FormControl id="fullName" isRequired>
                <FormLabel>Full name</FormLabel>
                <Input
                  type="text"
                  size="lg"
                  name="fullName"
                  value={registerRequest.fullName}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  size="lg"
                  name="username"
                  value={registerRequest.username}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    size="lg"
                    name="password"
                    value={registerRequest.password}
                    onChange={handleInputChange}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
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

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  size="lg"
                  name="email"
                  value={registerRequest.email}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl id="phoneNumber">
                <FormLabel>Phone number (Optional)</FormLabel>
                <Input
                  type="text"
                  size="lg"
                  name="phoneNumber"
                  value={registerRequest.phoneNumber}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl id="dob">
                <FormLabel>Date of birth: </FormLabel>
                <Input
                  name="dob"
                  placeholder="Select Time"
                  size="lg"
                  type="date"
                  mr={4}
                  value={new Date(registerRequest.dob)
                    .toISOString()
                    .substr(0, 10)}
                  onChange={handleDateChange}
                />
              </FormControl>

              <FormControl id="gender">
                <FormLabel>Gender</FormLabel>
                <Select
                  size="lg"
                  name="gender"
                  value={registerRequest.gender}
                  onChange={handleInputChange}
                >
                  <option value="MALE" defaultChecked={true}>
                    Male
                  </option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Select>
              </FormControl>

              <Button
                bg="cyan.600"
                color="white"
                loadingText="Loading"
                width="full"
                size="lg"
                borderRadius="xl"
                mt={6}
                p={6}
                onClick={handleRegister}
              >
                Register
              </Button>

              <Text align={'center'} mt={6}>
                Already a user?{' '}
                <Link color={'blue.400'} href={config.routes.login}>
                  Login
                </Link>
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </VStack>
    </Center>
  );
};

export default RegisterPage;
