import {
  Box,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Button,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import useCustomToast from '~/hooks/useCustomToast';
import enrollmentService from '~/services/enrollmentService';
import userService from '~/services/userService';

export default function StudentDropPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState({}); // Theo dõi trạng thái loading của từng user
  const [notifiedUsers, setNotifiedUsers] = useState({}); // Theo dõi user đã được nhắc
  const { successToast, errorToast } = useCustomToast();

  const fetchUsers = async () => {
    const userRequest = {
      page: 0,
      size: 100,
      fullName: null,
      role: null,
      gender: null,
      status: null,
    };
    const response = await userService.getUsersWithoutAdmin(userRequest);
    const fetchedUsers = {
      students: response.content.map((user) => {
        const days_since_enrollment = Math.floor(Math.random() * 30) + 1; // từ 1 đến 30 ngày
        const passedLesson = Math.floor(Math.random() * 50); // từ 0 đến 49
        const passedTests = Math.floor(Math.random() * 10); // từ 0 đến 9
        const progress = Math.floor(Math.random() * 101); // từ 0 đến 100
        const lastLogin = new Date();
        lastLogin.setDate(lastLogin.getDate() - days_since_enrollment);

        return {
          email: user.email,
          name: user.username,
          days_since_enrollment,
          passedLesson,
          passedTests,
          progress,
          lastLogin: lastLogin.toISOString().split('T')[0],
        };
      }),
    };
    const predictedUsers = await predictAtRiskUsers(fetchedUsers);
    setUsers(predictedUsers?.predictions || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const predictAtRiskUsers = async (userList) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/predict',
        userList,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data; // kết quả trả về từ API
    } catch (error) {
      console.error('Lỗi khi gọi API dự đoán:', error);
      return [];
    }
  };

  async function handleSendNotification(email) {
    // Bắt đầu loading cho user này
    setLoadingUsers((prev) => ({ ...prev, [email]: true }));

    try {
      let studentsEmail = [];
      studentsEmail.push(email);
      const enrollmentRequest = {
        studentEmails: studentsEmail,
      };

      await enrollmentService.sendNotify(enrollmentRequest);

      // Thành công - đánh dấu đã nhắc và tắt loading
      setNotifiedUsers((prev) => ({ ...prev, [email]: true }));
      successToast(`Đã gửi thông báo đến ${email}`);
    } catch (error) {
      errorToast('Gửi thông báo thất bại');
    } finally {
      // Tắt loading
      setLoadingUsers((prev) => ({ ...prev, [email]: false }));
    }
  }

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        <Heading size="lg" mb={5}>
          Học viên có nguy cơ bỏ học
        </Heading>

        <Table>
          <Thead>
            <Tr>
              <Th>Tên</Th>
              <Th>Email</Th>
              <Th>Lần đăng nhập cuối</Th>
              <Th>Tiến độ</Th>
              <Th>Nguy cơ</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.lastLogin}</Td>
                <Td>{user.progress}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      user.risk_status === 'NGUY CƠ BỎ HỌC' ? 'red' : 'orange'
                    }
                  >
                    {user.risk_status}
                  </Badge>
                </Td>
                <Td>
                  {notifiedUsers[user.email] ? (
                    <Badge colorScheme="green" variant="solid">
                      Đã nhắc
                    </Badge>
                  ) : (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleSendNotification(user.email)}
                      isLoading={loadingUsers[user.email]}
                      loadingText="Đang gửi..."
                      disabled={loadingUsers[user.email]}
                    >
                      {loadingUsers[user.email] ? (
                        <>
                          <Spinner size="sm" mr={2} />
                          Đang gửi...
                        </>
                      ) : (
                        'Nhắc học'
                      )}
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </RoleBasedPageLayout>
  );
}
