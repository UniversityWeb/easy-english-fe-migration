import React, { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: "May", course1: 50, course2: 20, course3: 10, course4: 40 },
  { name: "June", course1: 0, course2: 30, course3: 10, course4: 60 },
  { name: "July", course1: 100, course2: 50, course3: 60, course4: 80 },
  { name: "August", course1: 200, course2: 130, course3: 100, course4: 150 },
  { name: "September", course1: 300, course2: 200, course3: 150, course4: 200 },
  { name: "October", course1: 0, course2: 0, course3: 0, course4: 0 },
];

const courses = [
  { key: 'course1', label: 'Course 1', color: '#82ca9d' },
  { key: 'course2', label: 'Course 2', color: '#8884d8' },
  { key: 'course3', label: 'Course 3', color: '#ffc658' },
  { key: 'course4', label: 'Course 4', color: '#83a6ed' },
];

const EarningsChart = () => {
  const [visibleCourses, setVisibleCourses] = useState({
    course1: true,
    course2: true,
    course3: true,
    course4: true,
  });

  const handleLegendClick = (courseKey) => {
    setVisibleCourses((prev) => ({
      ...prev,
      [courseKey]: !prev[courseKey],
    }));
  };

  return (
    <Box w="full" p={5} shadow="md" borderWidth="1px" rounded="md">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
        Earnings
      </Text>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="color3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="color4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#83a6ed" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#83a6ed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend
            formatter={(value) => {
              const course = courses.find((c) => c.key === value);
              return (
                <span
                  onClick={() => handleLegendClick(value)}
                  style={{
                    textDecoration: visibleCourses[value] ? 'none' : 'line-through',
                    cursor: 'pointer',
                    color: course.color,
                  }}
                >
                  {course.label}
                </span>
              );
            }}
          />
          {courses.map((course) => (
            <Area
              key={course.key}
              type="monotone"
              dataKey={course.key}
              stroke={course.color}
              fillOpacity={1}
              fill={`url(#${course.key === 'course1' ? 'color1' : course.key === 'course2' ? 'color2' : course.key === 'course3' ? 'color3' : 'color4'})`}
              style={{
                strokeWidth: visibleCourses[course.key] ? 2 : 0,
                opacity: visibleCourses[course.key] ? 1 : 0.2, // Change opacity for strikethrough effect
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

const AnalyticsCoursesPage = () => {
  return <EarningsChart />;
};

export default AnalyticsCoursesPage;