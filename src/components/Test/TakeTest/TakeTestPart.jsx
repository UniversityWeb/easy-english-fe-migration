import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Flex, Heading, Icon, IconButton, VStack } from '@chakra-ui/react';
import { BsEraserFill } from 'react-icons/bs';
import { FaHighlighter } from 'react-icons/fa';
import TakeTestGroup from '~/components/Test/TakeTest/TakeTestGroup';
import { getPart } from '~/utils/testUtils';
import ReactQuill from 'react-quill';

function TakeTestPart({
  testId,
  partId,
  scrollToQuestion,
  onQuestionAnswered,
  isSplitLayout,
  setIsSplitLayout,
}) {
  const [part, setPart] = useState();
  const [leftWidth, setLeftWidth] = useState(50); // Width of the reading passage (left pane)
  const [highlightButtonVisible, setHighlightButtonVisible] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState({
    top: 0,
    left: 0,
  });
  const selectedRangeRef = useRef(null);

  useEffect(() => {
    // Fetch part data when testId or partId changes
    const newPart = getPart(testId, partId);
    setPart(newPart);

    if (newPart && !isReadingPassageEmpty(newPart.readingPassage)) {
      setIsSplitLayout(true);
    } else {
      setIsSplitLayout(false);
    }
  }, [partId, setIsSplitLayout, testId]);

  // Utility function to check if the reading passage is empty
  const isReadingPassageEmpty = (text) => {
    return !text || text.trim().replace(/<[^>]+>/g, '').length === 0;
  };

  // Handle resizing the left pane (reading passage)
  const handleDrag = (e) => {
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 20 && newLeftWidth < 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  // Handle text selection for highlighting
  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();

      if (selectedText.trim()) {
        selectedRangeRef.current = range;

        const rect = range.getBoundingClientRect();
        setHighlightPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
        setHighlightButtonVisible(true);
      } else {
        setHighlightButtonVisible(false);
      }
    }
  };

  // Handle highlight action
  const handleHighlight = () => {
    const selection = window.getSelection();

    if (!selectedRangeRef.current || selection.rangeCount === 0) return;

    const range = selectedRangeRef.current;
    const selectedText = selection.toString();
    const parentNode = range.commonAncestorContainer.parentNode;

    if (
      parentNode.tagName === 'SPAN' &&
      parentNode.style.backgroundColor === 'yellow'
    ) {
      parentNode.replaceWith(document.createTextNode(parentNode.textContent));
      setHighlightButtonVisible(false);
    } else {
      const highlightSpan = document.createElement('span');
      highlightSpan.style.backgroundColor = 'yellow';
      highlightSpan.textContent = selectedText;

      range.deleteContents();
      range.insertNode(highlightSpan);

      selection.removeAllRanges();
      setHighlightButtonVisible(false);
    }
  };

  return (
    <>
      {isSplitLayout ? (
        // Split layout: reading passage on the left, questions on the right
        <Flex height="100vh" onMouseUp={handleTextSelect}>
          {/* Left pane for the reading passage */}
          <Box
            width={`${leftWidth}%`}
            overflowY="auto"
            padding="20px"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="lg"
            position="relative"
          >
            <Heading as="h3" size="lg" mb={4}>
              {part?.title || 'Untitled Part'}
            </Heading>

            {/* Conditionally display the reading passage if it has content */}
            {!isReadingPassageEmpty(part?.readingPassage) && (
              <Box
                bg="cyan.50"
                borderRadius="md"
                boxShadow="sm"
                overflow="hidden"
                sx={{
                  '.quill': { height: 'auto' },
                  '.ql-editor': { lineHeight: '1.5' },
                  '.ql-size-small': { fontSize: '16px' },
                  '.ql-size-large': { fontSize: '18px' },
                  '.ql-size-huge': { fontSize: '24px' },
                  '.ql-editor p': { marginBottom: '15px' },
                }}
              >
                <ReactQuill
                  value={part?.readingPassage}
                  readOnly={true}
                  theme={'bubble'}
                  style={{ marginBottom: '0px', lineHeight: '1.5' }}
                />
              </Box>
            )}

            {/* Highlight button (appears when text is selected) */}
            {highlightButtonVisible && (
              <IconButton
                aria-label={
                  selectedRangeRef.current?.commonAncestorContainer?.parentNode
                    ?.style?.backgroundColor === 'yellow'
                    ? 'Remove Highlight'
                    : 'Highlight'
                }
                icon={
                  selectedRangeRef.current?.commonAncestorContainer?.parentNode
                    ?.style?.backgroundColor === 'yellow' ? (
                    <Icon as={BsEraserFill} />
                  ) : (
                    <Icon as={FaHighlighter} />
                  )
                }
                colorScheme="yellow"
                border="none"
                backgroundColor="transparent"
                color="teal"
                variant="ghost"
                position="absolute"
                top={highlightPosition.top}
                left={highlightPosition.left}
                zIndex={2}
                size="sm"
                onClick={handleHighlight}
              />
            )}
          </Box>

          {/* Draggable divider */}
          <Box
            width="3px"
            cursor="col-resize"
            backgroundColor="#808080"
            onMouseDown={(e) => {
              e.preventDefault();
              document.addEventListener('mousemove', handleDrag);
              document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleDrag);
              });
            }}
            _hover={{ bg: 'gray.500' }}
            zIndex={1}
          />

          {/* Right pane for the questions */}
          <Box
            width={`${100 - leftWidth}%`}
            overflowY="auto"
            padding="20px"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="lg"
          >
            <VStack spacing={6} align="start">
              {/* Render question groups */}
              {part?.questionGroups?.map((group) => (
                <TakeTestGroup
                  key={group.id}
                  questionGroup={group}
                  scrollToQuestion={scrollToQuestion}
                  onQuestionAnswered={onQuestionAnswered}
                  testId={testId}
                />
              ))}
            </VStack>
          </Box>
        </Flex>
      ) : (
        // Full-width layout: reading passage takes the full width, questions are hidden
        <Box padding="20px" borderWidth="1px" borderRadius="lg" boxShadow="lg">
          {/* Conditionally display the reading passage if it has content */}
          {!isReadingPassageEmpty(part?.readingPassage) && (
            <>
              <Heading as="h3" size="lg" mb={4}>
                {part?.title || 'Untitled Part'}
              </Heading>

              <Box
                bg="cyan.50"
                borderRadius="md"
                boxShadow="sm"
                overflow="hidden"
                sx={{
                  '.quill': { height: 'auto' },
                  '.ql-editor': { lineHeight: '1.5' },
                  '.ql-size-small': { fontSize: '16px' },
                  '.ql-size-large': { fontSize: '18px' },
                  '.ql-size-huge': { fontSize: '24px' },
                  '.ql-editor p': { marginBottom: '15px' },
                }}
              >
                <ReactQuill
                  value={part?.readingPassage}
                  readOnly={true}
                  theme={'bubble'}
                  style={{ marginBottom: '0px', lineHeight: '1.5' }}
                />
              </Box>
            </>
          )}

          <Container maxW="container.lg" px={4} py={6}>
            {/* Render question groups */}
            {part?.questionGroups?.map((group) => (
              <TakeTestGroup
                key={group.id}
                questionGroup={group}
                scrollToQuestion={scrollToQuestion}
                onQuestionAnswered={onQuestionAnswered}
                testId={testId}
              />
            ))}
          </Container>
        </Box>
      )}
    </>
  );
}

export default TakeTestPart;
