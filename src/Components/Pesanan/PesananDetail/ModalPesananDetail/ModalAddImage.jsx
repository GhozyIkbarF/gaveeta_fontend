import {
  Box,
  Image,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useToast,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { useMediaQuery } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react'
import API from '../../../../Service';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { setRefreshDetailPesanan } from '../../../../Features/Pesanan/PesananDetail';
import InputImage, {ButtonRemoveImage, ReviewImage} from '../../../InputImage';


export default function ModalAddImage({ isOpen, onClose }) {
  const initialRef = React.useRef(null)
  const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");
  const [isLoading, setIsLoading] = useState(false)
  const [finalDesign, setFinalDesign] = useState('')
  const [finalModel, setFinalModel] = useState('')

  const { dataDetailOrder, typeImage } = useSelector(state => state.pesananDetail);

  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm(
    {

      defaultValues: {
        design: "",
        model: "",
      },
    }
  );

  const design = watch('design')
  const model = watch('model')

  const changeExtentionImage = async (paramImage, param) => {
    if (paramImage.length === 0) return;
    const image = await createImageBitmap(paramImage[0]);
    setIsLoading(true)
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0);
    canvas.toBlob((blob) => {
      if (paramImage[0]) {
        const file = new File([blob], paramImage[0].name, { type: 'image/webp' });
        if(param === 'design') {
          setFinalDesign(file)
        }else{
          setFinalModel(file)
        }
      }
    }, 'image/webp');
  }

  useEffect(() => {
    changeExtentionImage(design, 'design');
  }, [design]);

  useEffect(() => {
    changeExtentionImage(model, 'model')
  }, [model])

  useEffect(() => {
    setIsLoading(false)
  }, [finalDesign, finalModel])


  const close = () => {
    onClose();
    reset();
    setFinalDesign('')
    setFinalModel('')
    setIsLoading(false)
  };

  const toast = useToast();
  const itemToast = (title, status) => toast({
    title: title,
    status: status,
    duration: 2000,
    isClosable: true,
    position: "top-right",
  });

  const onSubmit = async (data, e) =>{
    e.preventDefault()
    try {

      const formData = new FormData();
      if (typeImage === 'design') {
        if (typeof (data.design) != 'string') {
          formData.append('design', finalDesign);
          formData.append('order_id', dataDetailOrder.id);
          await API.addDesign(formData)
        }
        itemToast('Add new design success', 'success')
      } else {
        if (typeof (data.model) != 'string') {
          formData.append('model', finalModel);
          formData.append('order_id', dataDetailOrder.id);
          await API.addModel(formData)
        }
        itemToast('Add new model success', 'success')
      }
      dispatch(setRefreshDetailPesanan())
      setFinalDesign('')
      setFinalDesign('')
      close();
    } catch (error) {
      if (typeImage === 'design') {
        itemToast('Add new design failed', 'error')
      } else {
        itemToast('Add new model failed', 'error')
      }
    }
  }

  const handleRemoveSelectedDesign = () => {
    setValue('design', '');
    setFinalDesign('')
  };
  const handleRemoveSelectedModel = () => {
    setValue('model', '');
    setFinalModel('')
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        scrollBehavior={'inside'}
        isOpen={isOpen}
        onClose={close}
        closeOnOverlayClick={false}
        size={{ sm: 'full', md: 'lg' }}
        isCentered
      >
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px)' />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent maxW={isSmallerThanSm ? '320px' : 'lg'}>
            <ModalHeader 
              fontSize={{ base: 'md', md: 'lg' }} 
              borderBottom='1px' 
              borderColor='gray.100'
            >
              {typeImage === 'design' ? 'Add new design': 'Add new model'}
            </ModalHeader>
            <ModalBody>
              {isLoading &&
                <Flex w='full' justifyContent='center' align='center' h='80'>
                  <Spinner />
                </Flex>
              }
              {typeImage === 'design' ?
                <Box align='center'>
                  {finalDesign && (
                    <Box >
                      <ReviewImage alt={'design'} src={finalDesign}/>
                      <ButtonRemoveImage handle={handleRemoveSelectedDesign} image={'desain'}/>
                    </Box>
                  )}
                  {finalDesign === "" ?
                  <InputImage inputId={"fileInputDesign"} registerName={{...register('design')}} inputName={'Desain'}/>
                    : null}
                </Box>
                :
                <Box align='center'>
                  {finalModel && (
                    <Box w='full'>
                      <ReviewImage alt={'model'} src={finalModel}/>
                      <ButtonRemoveImage handle={handleRemoveSelectedModel} image={'model'}/>
                    </Box>
                  )}
                  {finalModel === "" ?
                    <InputImage inputId={"fileInputModel"} registerName={{...register('model')}} inputName={'Model'}/>
                   : null}
                </Box>
              }
            </ModalBody>
            <ModalFooter gap='3' mt='3' borderTop='1px' borderColor='gray.100'>
              <Button
                disabled={isSubmitting}
                onClick={isSubmitting ? null : close}
              >
                Cancel
              </Button>
              {
                finalDesign &&
                <Button
                  colorScheme='green'
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
              }

              {
                finalModel &&
                <Button
                  colorScheme='green'
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
              }
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}