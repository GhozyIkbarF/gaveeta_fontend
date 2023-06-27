import {
  Box,
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
  Center,
  Image,
  Textarea,
} from '@chakra-ui/react'
// import webpConverter from 'webp-converter';
import { MdInsertPhoto } from "react-icons/md";
import React, { useState, useEffect } from 'react'
import API from '../../Service'
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { changeDataPegawai } from '../../Features/Pegawai';

export default function ModalEditPegawai({ isOpen, onClose }) {
  const initialRef = React.useRef(null)

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
      // resolver: yupResolver(CREATE_POST_VALIDATION),
      defaultValues: {
        name: "",
        phone: "",
        email: "",
        gender: "Male",
        address: "",
        photo: "",
      },
    }
  );

  const photo = watch("photo");

  const close = () => {
    onClose();
    reset();
  };


  const toast = useToast();
  async function onSubmit(data) {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      formData.append('address', data.address);
      formData.append('gender', data.gender);
      formData.append('photo', data.photo[0]);
      const res = await API.createPegawai(formData)
      dispatch(changeDataPegawai())
      toast({
        title: "Create pegawai success",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      toast({
        title: "Create pewagai failed",
        description: "Something went wrong...",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  }

  const removeSelectedImage = () => {
    setValue('photo', '');
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
                    <FormLabel>nama</FormLabel>
                    <Input type="text" id="name" {...register('name')} placeholder='Nama' required />
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" id="email" {...register('email')} placeholder='Email' />
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Phone</FormLabel>
                    <Input type="text" id="phone" {...register('phone')} placeholder='Phone' required />
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select name='gender' {...register('gender')} required>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Select>
                  </FormControl>
                </WrapItem>
                <WrapItem w='full'>
                  <FormControl>
                    <FormLabel>Alamat</FormLabel>
                    <Textarea type="text" id="address" {...register('address')} placeholder='Alamat' required />
                  </FormControl>
                </WrapItem>
                <WrapItem w='100%'>
                  <FormControl>
                    {photo && (
                      <Box>
                        <Image
                          borderRadius='lg'
                          h='auto'
                          w='full'
                          objectFit='cover'
                          src={URL.createObjectURL(photo[0])}
                          alt="ssadas"
                        />
                        <Center>
                          <Button
                            onClick={removeSelectedImage}
                            className=" text-white w-full cursor-pointer mt-1 p-15"
                            colorScheme="red"
                          >
                            Remove Image
                          </Button>
                        </Center>
                      </Box>
                    )}
                    {photo == "" ?
                      <label
                        htmlFor="fileInput"
                        className="bg-blue-500 cursor-pointer border-white rounded-lg h-10  flex items-center justify-center  text-white "
                      >
                        <MdInsertPhoto />
                        <Input
                          {...register("photo")}
                          type="file"
                          id="fileInput"
                          className="hidden"
                          accept="image/*"
                        />
                        <p className="font-semibold">Photo</p>
                      </label> : null}

                  </FormControl>
                </WrapItem>
              </Wrap>
            </ModalBody>
            <ModalFooter borderTop='1px' borderColor='gray.100'>
              <Button colorScheme='blue' mr={3} isLoading={isSubmitting} type="submit">
                Save
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={isSubmitting ? null : close}
                variant="ghost"
              >Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}
