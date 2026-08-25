import { memo } from "react";
import "./FormDataWrapper.scss";
import { FormProvider } from "react-hook-form";

const FormDataWrapper = ({
  children,
  methods,
  onSubmit = () => {},
  formRef,
  id = null,
  className,
  style,
}) => {
  return (
    <FormProvider {...methods}>
      <form
        className={`form-data-wrapper ${className}`}
        id={id}
        onSubmit={onSubmit}
        ref={formRef}
        style={style}
      >
        {children}
      </form>
    </FormProvider>
  );
};
export default memo(FormDataWrapper);
