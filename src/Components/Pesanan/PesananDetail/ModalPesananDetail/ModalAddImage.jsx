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
  FormLabel,
  Button,
  Input,
  useToast,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { useMediaQuery } from "@chakra-ui/react";
import { MdInsertPhoto } from "react-icons/md";
import React, { useState, useEffect } from 'react'
import API from '../../../../Service';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { setRefreshDetailPesanan } from '../../../../Features/Pesanan/PesananDetail';


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
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    const changeExtentionDesign = async () => {
      if (design.length === 0) return;
      const image = await createImageBitmap(design[0]);
      setIsLoading(true)
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (design[0]) {
          const file = new File([blob], design[0].name, { type: 'image/webp' });
          setFinalDesign(file)
        }
      }, 'image/webp');
    }

    changeExtentionDesign();
  }, [design]);


  useEffect(() => {
    const changeExtentionModel = async () => {
      if (model.length === 0) return;

      const image = await createImageBitmap(model[0]);
      setIsLoading(true)
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        const file = new File([blob], model[0].name, { type: 'image/webp' });
        setFinalModel(file)
      }, 'image/webp');
    }
    changeExtentionModel()
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

  async function onSubmit(data) {
    try {

      const formData = new FormData();
      if (typeImage === 'design') {
        if (typeof (data.design) != 'string') {
          formData.append('design', finalDesign);
          formData.append('order_id', dataDetailOrder.id);
          await API.addDesign(formData)
        }
        toast({
          title: "Add new design success",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        if (typeof (data.model) != 'string') {
          formData.append('model', finalModel);
          formData.append('order_id', dataDetailOrder.id);
          await API.addModel(formData)
        }
        toast({
          title: "Add new model success",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });
      }
      dispatch(setRefreshDetailPesanan())
      setFinalDesign('')
      setFinalDesign('')
      close();
    } catch (error) {
      if (typeImage === 'design') {
        toast({
          title: "Add new design failed",
          description: "Something went wrong...",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        toast({
          title: "Add new model failed",
          description: "Something went wrong...",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    }
  }

  const removeSelectedDesign = () => {
    setValue('design', '');
    setFinalDesign('')
  };
  const removeSelectedModel = () => {
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
            {typeImage === 'design' ? <ModalHeader fontSize={{ base: 'md', md: 'lg' }} borderBottom='1px' borderColor='gray.100'>Add new design</ModalHeader> : <ModalHeader fontSize={{ base: 'md', md: 'lg' }} borderBottom='1px' borderColor='gray.100'>Add new model</ModalHeader>}
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
                      <Image
                        w='full'
                        objectFit='cover'
                        src={URL.createObjectURL(finalDesign)}
                        alt="ssadas"
                      />
                      <Center>
                        <Button
                          onClick={removeSelectedDesign}
                          className=" text-white w-full cursor-pointer mt-1 p-15"
                          colorScheme="red"
                        >
                          Remove design
                        </Button>
                      </Center>
                    </Box>
                  )}
                  {finalDesign === "" ?
                    <FormLabel
                      py='2'
                      htmlFor="fileInputDesign"
                      w='full'
                      bg='green.500'
                      cursor='pointer'
                      borderColor='white'
                      borderRadius='lg'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      color='white'
                    >
                      <MdInsertPhoto />
                      <Input
                        {...register("design")}
                        type="file"
                        id="fileInputDesign"
                        className="hidden"
                        accept="image/*"
                        required
                      />
                      <p className="font-semibold">Design</p>
                    </FormLabel> : null}
                </Box>
                :
                <Box align='center'>
                  {finalModel && (
                    <Box w='full'>
                      <Image
                        w='full'
                        objectFit='cover'
                        src={URL.createObjectURL(finalModel)}
                        alt="ssadas"
                      />
                      <Center>
                        <Button
                          onClick={removeSelectedModel}
                          className=" text-white w-full cursor-pointer mt-1 p-15"
                          colorScheme="red"
                        >
                          Remove model
                        </Button>
                      </Center>
                    </Box>
                  )}
                  {finalModel === "" ?
                    <FormLabel
                      py='2'
                      htmlFor="fileInputDesign"
                      w='full'
                      bg='green.500'
                      cursor='pointer'
                      borderColor='white'
                      borderRadius='lg'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      color='white'
                    >
                      <MdInsertPhoto />
                      <Input
                        {...register("model")}
                        type="file"
                        id="fileInputDesign"
                        className="hidden"
                        accept="image/*"
                        required
                      />
                      <p className="font-semibold">Model</p>
                    </FormLabel> : null}
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