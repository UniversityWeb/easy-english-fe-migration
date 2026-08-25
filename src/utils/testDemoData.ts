import { QUESTION_TYPES } from '~/utils/constants';

export const testDemoData = {
  id: 202,
  status: "DISPLAY",
  title: "English Grammar and Vocabulary Test",
  description: "A test covering basic grammar and vocabulary for intermediate English learners.",
  ordinalNumber: 1,
  durationInMilis: 2700000,
  startDate: "2024-10-29T10:00:00.000Z",
  endDate: "2024-10-29T10:45:00.000Z",
  createdAt: "2024-10-28T10:00:00.000Z",
  parts: [
    {
      id: 1,
      title: "Part 1: Grammar",
      readingPassage: "Read each question carefully and select the correct answer.",
      ordinalNumber: 1,
      testId: 202,
      questionGroups: [
        {
          id: 1,
          ordinalNumber: 1,
          from: 1,
          to: 5,
          title: "Group 1: Tenses",
          requirement: "Choose the correct form of the verb in each sentence.",
          imagePath: "images/grammar.png",
          questions: [
            {
              id: 1,
              type: "SINGLE_CHOICE",
              ordinalNumber: 1,
              title: "Present Continuous",
              description: "Select the correct form of the verb: 'She ____ to the store now.'",
              audioPath: "audio/question1.mp3",
              imagePath: null,
              options: ["is going", "goes", "went", "going"],
              correctAnswers: ["is going"],
              questionGroupId: 1
            },
            {
              id: 2,
              type: "SINGLE_CHOICE",
              ordinalNumber: 2,
              title: "Past Simple",
              description: "Choose the correct past form: 'They ____ a new house last year.'",
              audioPath: null,
              imagePath: null,
              options: ["bought", "buy", "buys", "buying"],
              correctAnswers: ["bought"],
              questionGroupId: 1
            }
          ],
          testPartId: 1
        }
      ]
    },
    {
      id: 2,
      title: "Part 2: Vocabulary",
      readingPassage: "Match each word with the correct definition.",
      ordinalNumber: 2,
      testId: 202,
      questionGroups: [
        {
          id: 2,
          ordinalNumber: 1,
          from: 6,
          to: 10,
          title: "Group 2: Synonyms",
          requirement: "Select the synonym that best matches the given word.",
          audioPath: "audio/vocabulary_intro.mp3",
          imagePath: "images/vocabulary.png",
          questions: [
            {
              id: 3,
              type: "SINGLE_CHOICE",
              ordinalNumber: 1,
              title: "Synonym for 'Happy'",
              description: "Choose the word that means the same as 'happy'.",
              audioPath: null,
              imagePath: null,
              options: ["joyful", "sad", "angry", "tired"],
              correctAnswers: ["joyful"],
              questionGroupId: 2
            },
            {
              id: 4,
              type: "TRUE_FALSE",
              ordinalNumber: 2,
              title: "Vocabulary Knowledge",
              description: "The word 'benevolent' means 'cruel'.",
              audioPath: null,
              imagePath: null,
              options: ["True", "False"],
              correctAnswers: ["False"],
              questionGroupId: 2
            }
          ],
          testPartId: 2
        }
      ]
    }
  ],
  sectionId: 15
};

export const testWithEmptyListDataDemo = {
  id: 202,
  status: "DISPLAY",
  title: "English Grammar and Vocabulary Test",
  description: "A test covering basic grammar and vocabulary for intermediate English learners.",
  ordinalNumber: 1,
  durationInMilis: 2700000,
  startDate: "2024-10-29T10:00:00.000Z",
  endDate: "2024-10-29T10:45:00.000Z",
  createdAt: "2024-10-28T10:00:00.000Z",
  sectionId: 1,
  parts: [],
}


export const QUESTION_TEMPLATES_TO_ADD = {
  SINGLE_CHOICE: {
    type: QUESTION_TYPES.SINGLE_CHOICE,
    ordinalNumber: 0,
    title: 'What is the past tense of "go"?',
    description: '',
    options: ['Gone', 'Going', 'Went', 'Go'],
    correctAnswers: ['Went'],
  },
  MULTI_CHOICE: {
    type: QUESTION_TYPES.MULTI_CHOICE,
    ordinalNumber: 0,
    title: 'Select all adjectives in the following sentence: "The quick brown fox jumps over the lazy dog."',
    description: '',
    options: ['Quick', 'Brown', 'Jumps', 'Lazy'],
    correctAnswers: ['Quick', 'Brown', 'Lazy'], // Multiple correct answers
  },
  TRUE_FALSE: {
    type: QUESTION_TYPES.TRUE_FALSE,
    ordinalNumber: 0,
    title: 'The sentence "She don’t like apples" is grammatically correct.',
    description: '',
    options: ['True', 'False'],
    correctAnswers: ['False'], // Only one correct answer
  },
  MATCHING: {
    type: QUESTION_TYPES.MATCHING,
    ordinalNumber: 0,
    title: 'Match the words with their definitions.',
    description: '',
    options: [
      'Run',
      'Beautiful',
      'Happily',
      'Cat',
    ],
    correctAnswers: [
      'Verb',
      'Adjective',
      'Adverb',
      'Noun',
    ], // Expected matches
  },
  FILL_BLANK: {
    type: QUESTION_TYPES.FILL_BLANK,
    ordinalNumber: 0,
    title: 'She is good ___ math.',
    description: 'She is good |at| math.',
    options: [''], // unused
    correctAnswers: ['at'], // Correct word to fill the blank
  },
};