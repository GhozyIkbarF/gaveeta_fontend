import React, { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  Wrap,
  WrapItem,
  useToast,
  Textarea,
  Spinner,
} from '@chakra-ui/react'
import API from '../../Service'
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { changeDataPegawai } from '../../Features/Pegawai';
import InputImage, {ReviewImage, ButtonRemoveImage} from '../InputImage';
import { yupResolver } from "@hookform/resolvers/yup";
import { CREATE_PEGAWAI_VALIDATION } from '../../validation';

export default function ModalEditPegawai({ isOpen, onClose }) {
  const initialRef = React.useRef(null);
  const [finalPhoto, setFinalPhoto] = useState('');
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false)

  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm(
    {
      resolver: yupResolver(CREATE_PEGAWAI_VALIDATION),
      defaultValues: {
        name: "",
        phone: "",
        email: "",
        gender: "",
        address: "",
        photo: "",
      },
    }
  );

  const photo = watch("photo");

  const close = () => {
    setFinalPhoto(false)
    onClose();
    reset();
  };

  useEffect(() => {
    const changeExtentionDesign = async () => {
      if (photo.length === 0) return;
      setIsLoadingPhoto(true)
      const image = await createImageBitmap(photo[0]);
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (photo[0]) {
          const file = new File([blob], photo[0].name, { type: 'image/webp' });
          setFinalPhoto(file)
        }
      }, 'image/webp');
    }

    changeExtentionDesign();
  }, [photo]);

  useEffect(() => {
    setIsLoadingPhoto(false)
  }, [finalPhoto])


  const toast = useToast();
  async function onSubmit(data, e) {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      formData.append('address', data.address);
      formData.append('gender', data.gender);
      formData.append('photo', finalPhoto);
      await API.createPegawai(formData)
      dispatch(changeDataPegawai())
      toast({
        title: "Create pegawai success",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      close();
    } catch (err) {
      console.log(errors);
      toast({
        title: "Create pewagai failed",
        description: "Something went wrong...",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    }
  }

  const handleRemoveSelectedImage = () => {
    setValue('photo', '');
    setFinalPhoto('')
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        scrollBehavior={'inside'}
        isOpen={isOpen}
        onClose={close}
        size={{ sm: 'full', md: '2xl', xl: '3xl' }}
      >
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px)' />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader borderBottom='1px' borderColor='gray.100'>Tambah pegawai</ModalHeader>
            <ModalCloseButton onClose={close} />
            <ModalBody pb={6}>
              <Wrap spacing='30px' justify={'space-between'}>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Nama</FormLabel>
                    <Input type="text" id="name" {...register('name')} focusBorderColor='#00AA5D'/>
                    {errors.name && <Text color={'red'} fontSize={'sm'}>{errors.name.message}</Text>}
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" id="email" {...register('email')} focusBorderColor='#00AA5D'/>
                    {errors.email && <Text color={'red'} fontSize={'sm'}>{errors.email.message}</Text>}
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>No Hp</FormLabel>
                    <Input type="number" id="phone" {...register('phone')} focusBorderColor='#00AA5D'/>
                    {errors.phone && <Text color={'red'} fontSize={'sm'}>{errors.phone.message}</Text>}
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Jenis kelamin</FormLabel>
                    <Select name='gender' {...register('gender')} focusBorderColor='#00AA5D'>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </Select>
                    {errors.gender && <Text color={'red'} fontSize={'sm'}>{errors.gender.message}</Text>}
                  </FormControl>
                </WrapItem>
                <WrapItem w='full'>
                  <FormControl>
                    <FormLabel>Alamat</FormLabel>
                    <Textarea type="text" id="address" {...register('address')} focusBorderColor='#00AA5D'/>
                    {errors.address && <Text color={'red'} fontSize={'sm'}>{errors.address.message}</Text>}
                  </FormControl>
                </WrapItem>
                {isLoadingPhoto ?
                  <Flex w='full' justifyContent='center' align='center' h='80'>
                    <Spinner />
                  </Flex> : null}
                <WrapItem w='100%'>
                  <FormControl>
                    {finalPhoto && (
                      <Box>
                        <ReviewImage src={finalPhoto} alt={'photo'}/>
                        <ButtonRemoveImage handle={handleRemoveSelectedImage} image={'foto'}/>
                      </Box>
                    )}
                    {photo === "" ? <InputImage inputId={"fileInput"} registerName={{...register('photo')}} inputName={'Foto'}/> : null}
                    {errors.photo && <Text color={'red'} fontSize={'sm'}>{errors.photo.message}</Text>}
                  </FormControl>
                </WrapItem>
              </Wrap>
            </ModalBody>
            <ModalFooter borderTop='1px' gap={3} borderColor='gray.100'>
              <Button
                disabled={isSubmitting}
                onClick={isSubmitting ? null : close}
                variant="ghost"
              >
                Batal
              </Button>
              {isLoadingPhoto ? null : <Button colorScheme='green' mr={3} isLoading={isSubmitting} type="submit">
                Simpan
              </Button>}
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}
