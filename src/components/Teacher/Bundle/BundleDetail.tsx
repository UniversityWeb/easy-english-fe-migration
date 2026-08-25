import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import React, { forwardRef } from 'react';

import { Box, Button } from '@chakra-ui/react';
import FormDataWrapper from '~/components/Form/FormDataWrapper';
import SelectCourseField from '~/components/Form/SelectCourseField';
import TextField from '~/components/Form/TextField';
import UploadFileFiled from '~/components/Form/UploadFileFiled';
import TextAreaField from '~/components/Form/TextAreaField';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getDataCourse } from '~/store/courseSlice';
import bundleService from '~/services/bundleService';
import { useNavigate, useParams } from 'react-router-dom';
import useCustomToast from '~/hooks/useCustomToast';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import config from '~/config';

const EditingForm = forwardRef(({ data = {} }, ref) => {
  const schema = yup.object().shape({
    //BundleName: yup.string().required(),
  });
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);
  console.log('courseData', courseData);
  // Kiểm tra nếu courseData là mảng và không có phần tử nào
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
    <FormDataWrapper methods={methods}>
      <SelectCourseField
        fieldName="courseIds"
        control={control}
        errors={errors}
        courses={courseData?.filter((course) => course?.status === 'PUBLISHED')}
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
      <UploadFileFiled
        fieldName="imagePreview"
        control={control}
        errors={errors}
        label="Bundle price"
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

const BundleDetail = () => {
  const [data, setData] = useState(null);
  const formRef = useRef(null);
  const { bundleId } = useParams();
  const { successToast, errorToast } = useCustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBundle();
  }, []);

  const fetchBundle = async () => {
    try {
      const response = await bundleService.getBundleById(bundleId);
      if (response) {
        setData(response);
      }
    } catch (error) {
      console.error('Error fetching enroll bundles:', error);
    }
  };

  const handleSave = useCallback(() => {
    formRef.current?.submitForm(async (data) => {
      const updateBundle = await bundleService.updateBundle(data.id, data);
      if (updateBundle) {
        successToast(`Bundle updated successfully.`);

        navigate(config.routes.bundle);
      } else {
        errorToast(`An error occurred while updating the bundle .`);
      }
    });
  }, []);
  // Chỉ render khi `data` có giá trị
  if (!data) return null;

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
          <EditingForm ref={formRef} data={data} />

          <Button mt={6} colorScheme="blue" onClick={handleSave} type="submit">
            Save
          </Button>
        </Box>
      </div>
    </RoleBasedPageLayout>
  );
};

export default BundleDetail;
