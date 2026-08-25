import React, { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Dữ liệu cho biểu đồ hình tròn
const pieData = [
  { name: 'Course 1', value: 100, key: 'course1' },
  { name: 'Course 2', value: 50, key: 'course2' },
  { name: 'Course 3', value: 30, key: 'course3' },
  { name: 'Course 4', value: 70, key: 'course4' },
];

// Cấu hình khóa học
const courses = [
  { key: 'course1', label: 'Course 1', color: '#82ca9d' },
  { key: 'course2', label: 'Course 2', color: '#8884d8' },
  { key: 'course3', label: 'Course 3', color: '#ffc658' },
  { key: 'course4', label: 'Course 4', color: '#83a6ed' },
];

const PieChart = () => {
  const [visibleCourses, setVisibleCourses] = useState({
    course1: true,
    course2: true,
    course3: true,
    course4: true,
  });

  // Hàm xử lý khi click vào legend để bật/tắt khóa học
  const handleLegendClick = (courseKey) => {
    setVisibleCourses((prev) => ({
      ...prev,
      [courseKey]: !prev[courseKey], // Toggle visibility
    }));
  };

  // Xử lý dữ liệu biểu đồ: Nếu khóa học bị tắt thì giá trị của nó sẽ là 0
  const processedData = pieData.map((entry) => ({
    ...entry,
    value: visibleCourses[entry.key] ? entry.value : 0, // Đặt value = 0 nếu khóa học bị tắt
  }));

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
        Sales
      </Text>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsPieChart>
          <Pie
            data={processedData} // Dữ liệu đã được xử lý
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
          >
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={courses.find((course) => course.key === entry.key).color}
              />
            ))}
          </Pie>
          <Legend
            formatter={(value) => {
              const course = courses.find((c) => c.label === value);
              return (
                <span
                  onClick={() => handleLegendClick(course.key)}
                  style={{
                    textDecoration: visibleCourses[course.key]
                      ? 'none'
                      : 'line-through',
                    cursor: 'pointer',
                    color: course.color,
                  }}
                >
                  {course.label}
                </span>
              );
            }}
          />
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PieChart;
