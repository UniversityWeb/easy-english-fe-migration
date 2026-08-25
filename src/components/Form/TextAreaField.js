import { Controller, useFormContext } from "react-hook-form";
import { memo } from "react";
import {
  FormControl,
  FormLabel,
  Textarea,
  FormErrorMessage,
  Box,
} from "@chakra-ui/react";

const TextAreaField = ({
  control,
  fieldName,
  label,
  visible = true,
  disable = false,
  readOnly = false,
  className = "col-xs-12 col-sm-12 col-md-3 col-lg-2",
  rows = 3,
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <>
      {visible ? (
        <Box className={className}>
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <FormControl
                isInvalid={errors && errors[fieldName]}
                isDisabled={disable}
              >
                <FormLabel htmlFor={fieldName}>{label}</FormLabel>
                <Textarea
                  id={fieldName}
                  readOnly={readOnly}
                  variant="outline"
                  rows={rows}
                  {...field}
                  value={field.value || ""}
                />
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

export default memo(TextAreaField);
