import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import React, { forwardRef } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import FormDataWrapper from '~/components/Form/FormDataWrapper';
import SelectCourseField from '~/components/Form/SelectCourseField';
import TextField from '~/components/Form/TextField';
import TextAreaField from '~/components/Form/TextAreaField';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getDataCourse } from '~/store/courseSlice';
import bundleService from '~/services/bundleService';
import useCustomToast from '~/hooks/useCustomToast';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

const EditingForm = forwardRef(({ data = {} }, ref) => {
  const schema = yup.object().shape({
    //BundleName: yup.string().required(),
  });
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);

  useEffect(() => {
    if (isEmpty(courseData)) {
      dispatch(getDataCourse());
    }
  }, []);

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      ...data,
    },
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  useImperativeHandle(ref, () => ({
    submitForm: (onValid, onInvalid) => handleSubmit(onValid, onInvalid)(),
  }));

  const watchData = useWatch({
    control,
    name: ['courseIds'],
  });

  console.log('data', data);

  return (
    <FormDataWrapper methods={methods} style={{ width: '100%' }}>
      <SelectCourseField
        fieldName="courseIds"
        control={control}
        errors={errors}
        courses={courseData}
        className="col-xs-12 col-md-12" // chỉnh độ dài
      />
      <TextField
        fieldName="name"
        control={control}
        errors={errors}
        label="Bundle Name"
        disable={false}
        className="col-xs-12 col-md-12" // chỉnh độ dài
      />

      <TextAreaField
        fieldName="desc"
        control={control}
        errors={errors}
        label="Bundle description"
        disable={false}
        className="col-xs-12 col-md-12" // chỉnh độ dài
      />
      <TextField
        fieldName="price"
        control={control}
        errors={errors}
        label="Bundle price"
        disable={false}
        className="col-xs-12 col-md-12" // chỉnh độ dài
        type="number"
      />

      {/* <div>{watchData[0]}</div>
      <button onClick={methods.handleSubmit(handleSave)} type="submit">
        Submit
      </button> */}
    </FormDataWrapper>
  );
});

const NewBundle = () => {
  const formRef = useRef(null);
  const { successToast, errorToast } = useCustomToast();
  const navigate = useNavigate();
  const handleSave = useCallback(() => {
    formRef.current?.submitForm(async (data) => {
      const updateBundle = await bundleService.createBundle(data);
      if (updateBundle) {
        successToast(`Bundle updated successfully.`);
        navigate(config.routes.bundle);
      } else {
        errorToast(`An error occurred while updating the bundle .`);
      }
    });
  }, []);

  return (
    <RoleBasedPageLayout>
      <div>
        <Box
          width="1000px"
          mx="auto"
          display="flex"
          flexDirection="column"
          alignItems="center"
          minHeight="100vh"
          py={8}
        >
          <EditingForm ref={formRef} data={[]} />

          <Button mt={6} colorScheme="blue" onClick={handleSave} type="submit">
            Save
          </Button>
        </Box>
      </div>
    </RoleBasedPageLayout>
  );
};

export default NewBundle;
