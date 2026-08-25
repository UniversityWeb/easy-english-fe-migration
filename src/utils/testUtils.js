import { getUsername as getAuthUsername } from '~/utils/authUtils';

const TAKE_TEST_KEY = 'takeTestKey'

const getTestKey = (testId) => {
  const username = getAuthUsername();
  return TAKE_TEST_KEY + "/" + username + "/" + testId;
}

const getTest = (testId) => {
  const key = getTestKey(testId);
  const savedTest = localStorage.getItem(key);
  return savedTest ? JSON.parse(savedTest) : null;
};

const saveTest = (testId, test) => {
  const key = getTestKey(testId);
  localStorage.setItem(key, JSON.stringify(test));
}

const clearSavedTest = (testId) => {
  const key = getTestKey(testId);
  localStorage.removeItem(key);
}

const clearAllTestsOfCurUsername = () => {
  const username = getAuthUsername();
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`${TAKE_TEST_KEY}/${username}`)) {
      localStorage.removeItem(key);
    }
  });
};

const saveQuestionState = (testId, testQuestionId, answers) => {
  const key = getTestKey(testId);
  const savedTest = getTest(testId) || {};

  // Update the answers for the specific question
  const updatedUserAnswers = savedTest.userAnswers || [];
  const existingAnswerIndex = updatedUserAnswers.findIndex(
    (answer) => answer.testQuestionId === testQuestionId
  );

  if (existingAnswerIndex > -1) {
    updatedUserAnswers[existingAnswerIndex].answers = answers;
  } else {
    updatedUserAnswers.push({
      testQuestionId,
      answers,
    });
  }

  // Save the updated test back to localStorage
  const updatedTest = { ...savedTest, userAnswers: updatedUserAnswers };
  saveTest(testId, updatedTest);
  return updatedTest;
};

const generateSubmitTestRequest = (testId) => {
  const savedTest = getTest(testId);
  if (!savedTest) {
    throw new Error('No test data found for this test');
  }

  const finishedAt = new Date().toISOString();
  const startedAt = savedTest.startedAt || null;

  // Calculate takingDuration if `startedAt` is available
  let takingDuration = null;
  if (startedAt) {
    const startDate = new Date(startedAt);
    const finishDate = new Date(finishedAt);
    takingDuration = Math.floor((finishDate - startDate) / 1000); // duration in seconds
  }

  const submitTestRequest = {
    testId: testId,
    takingDuration,
    startedAt,
    finishedAt,
    userAnswers: savedTest.userAnswers || [],
  };

  return submitTestRequest;
};

const getStartedTime = (testId) => {
  const savedTest = getTest(testId);
  return savedTest ? savedTest?.startedAt : null;
};

const getCourseId = (testId) => {
  const savedTest = getTest(testId);
  return savedTest ? savedTest?.courseId : null;
};

const getParts = (testId) => {
  const savedTest = getTest(testId);
  return savedTest ? savedTest.parts || [] : [];
};

const getPart = (testId, partId) => {
  const savedTest = getTest(testId);
  if (!savedTest || !savedTest.parts) return null;

  // Find the part by its unique partId
  return savedTest.parts.find(part => part.id === partId) || null;
};

const getQuestionGroups = (testId) => {
  const savedTest = getTest(testId);
  if (!savedTest || !savedTest.parts) return [];

  const questionGroups = [];
  savedTest.parts.forEach(part => {
    part.questionGroups.forEach(group => {
      questionGroups.push(group);
    });
  });

  return questionGroups;
};

const getQuestion = (testId, testQuestionId) => {
  const savedTest = getTest(testId);
  if (!savedTest || !savedTest.parts) return null;

  // Iterate through parts and their question groups to find the question by ID
  for (const part of savedTest.parts) {
    for (const group of part.questionGroups) {
      const question = group.questions.find(q => q.id === testQuestionId);
      if (question) {
        return question; // Return the question if found
      }
    }
  }

  return null; // Return null if the question is not found
};

const getQuestions = (testId) => {
  const savedTest = getTest(testId);
  if (!savedTest || !savedTest.parts) return [];

  // Extract all questions from all parts and their question groups
  const questions = [];
  savedTest.parts.forEach(part => {
    part.questionGroups.forEach(group => {
      questions.push(...group.questions);
    });
  });

  return questions;
};

const getQuestionsInRangeByPartId = (testId, partId, startIndex, endIndex) => {
  const part = getPart(testId, partId);
  if (!part || !part.questionGroups) return [];

  // Collect all questions from the part's question groups
  const allQuestions = [];
  part.questionGroups.forEach(group => {
    allQuestions.push(...group.questions);
  });

  // Return the questions within the specified range
  return allQuestions.slice(startIndex, endIndex);
};

const getQuestionRange = (testId, part) => {
  const allQuestions = getQuestionsInRangeByPartId(
    testId,
    part.id,
    0,
    part.questionGroups.reduce((acc, group) => acc + group.questions.length, 0)
  );
  return allQuestions.map((q) => {
    return {
      id: q?.id,
      ordinalNumber: q?.ordinalNumber
    };
  });
};

export {
  saveTest,
  getTest,
  clearSavedTest,
  clearAllTestsOfCurUsername,
  saveQuestionState,
  generateSubmitTestRequest,
  getStartedTime,
  getCourseId,
  getParts,
  getPart,
  getQuestionGroups,
  getQuestion,
  getQuestions,
  getQuestionsInRangeByPartId,
  getQuestionRange,
};
