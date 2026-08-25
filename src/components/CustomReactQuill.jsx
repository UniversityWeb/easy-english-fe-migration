import ReactQuill from 'react-quill';
import { Box } from '@chakra-ui/react';
import React from 'react';
import 'react-quill/dist/quill.snow.css';

const REACT_QUILL_MODULES = {
  toolbar: [
    [{ align: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ header: [1, 2, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const CustomReactQuill = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  theme = 'snow',
  height = '350px',
  width = '100%',
  readOnly = false,
}) => {
  return (
    <Box
      sx={{
        '.quill': { height: 'auto' },
        '.ql-container': { height },
        '.ql-editor': { minHeight: height, width, lineHeight: '1.5' },
        '.ql-toolbar': { backgroundColor: 'white', padding: '5px' },
        '.ql-size-small': { fontSize: '16px' },
        '.ql-size-large': { fontSize: '18px' },
        '.ql-size-huge': { fontSize: '24px' },
        '.ql-editor p': { marginBottom: '15px' },
      }}
    >
      <ReactQuill
        theme={theme}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={REACT_QUILL_MODULES}
        style={{ marginBottom: '0px', lineHeight: '1.5' }}
        readOnly={readOnly}
      />
    </Box>
  );
};

export default CustomReactQuill;
