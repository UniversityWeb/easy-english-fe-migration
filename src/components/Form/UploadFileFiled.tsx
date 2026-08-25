import { Controller, useFormContext } from "react-hook-form";
import { memo, useState } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  Input,
  Button,
  Flex,
  Text,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { X } from "lucide-react";

const UploadFileField = ({
  control,
  fieldName,
  label,
  visible = true,
  disable = false,
  readOnly = false,
  accept = "image/*",
  className = "col-xs-12 col-sm-12 col-md-3 col-lg-2",
}) => {
  const {
    formState: { errors },
  } = useFormContext();
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (onChange) => {
    onChange(null);
    setPreview(null);

    const input = document.getElementById(fieldName);
    if (input) {
      input.value = "";
    }
  };

  return (
    <>
      {visible ? (
        <Box className={className}>
          <Controller
            name={fieldName}
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <FormControl
                isInvalid={errors && errors[fieldName]}
                isDisabled={disable}
              >
                <FormLabel htmlFor={fieldName}>{label}</FormLabel>
                <Input
                  type="file"
                  id={fieldName}
                  readOnly={readOnly}
                  accept={accept}
                  display="none"
                  {...field}
                  onChange={(e) => handleFileChange(e, onChange)}
                />
                <Flex alignItems="center" gap={2}>
                  <Button
                    as="label"
                    htmlFor={fieldName}
                    variant="outline"
                    cursor="pointer"
                  >
                    Choose File
                  </Button>
                  <Text noOfLines={1}>
                    {value ? value.name : "No file chosen"}
                  </Text>
                </Flex>

                {preview && (
                  <Box position="relative" mt={4}>
                    <Image
                      src={preview}
                      alt="Preview"
                      maxH="200px"
                      objectFit="contain"
                      borderRadius="md"
                    />
                    <IconButton
                      icon={<X size={16} />}
                      size="sm"
                      position="absolute"
                      top={1}
                      right={1}
                      colorScheme="red"
                      onClick={() => handleRemove(onChange)}
                      aria-label="Remove image"
                    />
                  </Box>
                )}

                {errors && errors[fieldName] && (
                  <FormErrorMessage>
                    {errors[fieldName]?.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            )}
          />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(UploadFileField);
