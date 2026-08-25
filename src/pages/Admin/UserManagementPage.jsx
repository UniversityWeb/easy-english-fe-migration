import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalContent,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { RiDeleteBinFill } from 'react-icons/ri';
import { PiPencilSimpleFill } from 'react-icons/pi';
import ProfileEdit from '~/components/Admin/UserManagement/UserDetail';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import userService from '~/services/userService'; // Import the service
import Pagination from '~/components/Student/Search/Page';
import useCustomToast from '~/hooks/useCustomToast';

const GENDER_OPTIONS = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
};

const ROLE_OPTIONS = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
};

const STATUS_OPTIONS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DELETED: 'Deleted',
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    fullName: null,
    role: null,
    gender: null,
    status: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();
  const resizableColumns = useRef([]);
  const { successToast, errorToast } = useCustomToast();
  const fetchUsers = async () => {
    try {
      const userRequest = {
        page: currentPage - 1,
        size: itemsPerPage,
        fullName: filters.fullName || null,
        role: filters.role || null,
        gender: filters.gender || null,
        status: filters.status || null,
      };
      const response = await userService.getUsersWithoutAdmin(userRequest);
      setUsers(response.content || []);
      setFilteredUsers(response.content || []);
      setTotalPages(response.totalPages);
    } catch (error) {
      errorToast(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const handleEdit = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (username) => {
    try {
      await userService.deleteUserForAdmin(username);

      const updatedUsers = users.filter((user) => user.username !== username);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      successToast(`User ${username} has been deleted successfully.`);
    } catch (error) {
      errorToast(error?.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={5}>
          <Heading>User Management</Heading>
          <Button colorScheme="teal" onClick={() => handleEdit()}>
            Add User
          </Button>
        </Flex>

        <Flex mb={4} gap={4}>
          <Box>
            <Input
              placeholder="Search by full name"
              name="fullName"
              value={filters.fullName}
              onChange={handleFilterChange}
            />
          </Box>
          <Box>
            <Select
              placeholder="Filter by role"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
            >
              {Object.keys(ROLE_OPTIONS).map((key) => (
                <option key={key} value={key}>
                  {ROLE_OPTIONS[key]}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Select
              placeholder="Filter by gender"
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
            >
              {Object.keys(GENDER_OPTIONS).map((key) => (
                <option key={key} value={key}>
                  {GENDER_OPTIONS[key]}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Select
              placeholder="Filter by status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              {Object.keys(STATUS_OPTIONS).map((key) => (
                <option key={key} value={key}>
                  {STATUS_OPTIONS[key]}
                </option>
              ))}
            </Select>
          </Box>
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table
            variant="simple"
            colorScheme="whiteAlpha"
            className="resizable-table"
          >
            <Thead bg="gray.100">
              <Tr>
                <Th>Avatar</Th>
                <Th>Username</Th>
                <Th>Full Name</Th>
                <Th>Email</Th>
                <Th>Phone Number</Th>
                <Th>Birthday</Th>
                <Th>Gender</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Bio</Th>
                <Th>Created At</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={user.username}>
                  <Td>
                    <Avatar src={user.avatarPath} name={user.username} />
                  </Td>
                  <Td>{user.username}</Td>
                  <Td>{user.fullName}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.phoneNumber}</Td>
                  <Td>
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    }).format(new Date(user.dob))}
                  </Td>
                  <Td>{GENDER_OPTIONS[user.gender]}</Td>
                  <Td>{ROLE_OPTIONS[user.role]}</Td>
                  <Td>{STATUS_OPTIONS[user.status]}</Td>
                  <Td>{user.bio}</Td>
                  <Td>
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    }).format(new Date(user.createdAt))}
                  </Td>
                  <Td>
                    <IconButton
                      icon={<PiPencilSimpleFill />}
                      onClick={() => handleEdit(user)}
                      color="gray.500"
                      mr={2}
                    />
                    <IconButton
                      icon={<RiDeleteBinFill />}
                      onClick={() => handleDelete(user.username)}
                      color="gray.500"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Box mt={8}>
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalPages={totalPages}
            />
          </Box>
        </Box>

        <Modal isOpen={isModalOpen} onClose={closeModal} size="lg" isCentered>
          <ModalContent
            style={{ zoom: 0.85 }}
            width="auto"
            height="auto"
            minW="1000px"
            maxH="900px"
          >
            <ProfileEdit
              user={{
                ...selectedUser,
                password: null, // Gán password là null nếu là edit
              }}
              mode={selectedUser ? 'edit' : 'add'}
              onSuccess={() => {
                closeModal();
                fetchUsers(); // Refresh the user list
              }}
            />
          </ModalContent>
        </Modal>
      </Box>

      <style>{`
        .resizable-table th, .resizable-table td {
          border-right: 1px solid #e2e8f0;
          padding: 8px;
          white-space: nowrap;
          position: relative;
        }
        .resizable-table th:last-child, .resizable-table td:last-child {
          border-right: none;
        }
        .resizer {
          position: absolute;
          top: 0;
          right: 0;
          width: 5px;
          height: 100%;
          cursor: col-resize;
          background-color: transparent;
        }
      `}</style>
    </RoleBasedPageLayout>
  );
};

export default UserManagement;
