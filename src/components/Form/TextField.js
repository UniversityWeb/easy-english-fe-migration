import { Controller, useFormContext } from "react-hook-form";
import { memo } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
} from "@chakra-ui/react";

const TextField = ({
  control,
  fieldName,
  label,
  visible = true,
  disable = false,
  readOnly = false,
  type = "text",
  className = "col-xs-12 col-sm-12 col-md-3 col-lg-2",
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
                <Input
                  id={fieldName}
                  readOnly={readOnly}
                  variant="outline"
                  {...field}
                  value={field.value || ""}
                  type={type}
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

export default memo(TextField);
