import {
  Image,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  useToast,
  ModalBody,
} from '@chakra-ui/react'
import { useMediaQuery } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react'
import API from '../../../../Service';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { setRefreshDetailPesanan } from '../../../../Features/Pesanan/PesananDetail';


export default function ModalRemoveImage({ isOpen, onClose }) {
  const initialRef = React.useRef(null)
  const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");
  const dispatch = useDispatch();
  const [image, setImage] = useState('')
  const { typeImage, IdRemoveImage, allDesignItems, allModelItems, refreshModalRemoveImage } = useSelector(state => state.pesananDetail);
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const close = () => {
    onClose();
    reset();
  };

  const toast = useToast();

  useEffect(() => {
    if (typeImage === 'design') {
      const dataFilterDesign = allDesignItems.filter(value => value.id === IdRemoveImage)[0]
      if (dataFilterDesign != null || dataFilterDesign != undefined) {
        setImage(dataFilterDesign.design)
      }
    } else if (typeImage === 'model') {
      const dataFilterModel = allModelItems.filter(value => value.id === IdRemoveImage)[0]
      if (dataFilterModel != null || dataFilterModel != undefined) {
        setImage(dataFilterModel.model)
      }
    }
  }, [refreshModalRemoveImage])

  async function onSubmit() {
    try {
      if (typeImage === 'design') {
        await API.deleteDesign(IdRemoveImage)
        toast({
          title: "Delete design success",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        await API.deleteModel(IdRemoveImage)
        toast({
          title: "Delete model success",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
      }
      dispatch(setRefreshDetailPesanan())
      close();
    } catch (error) {
      if (typeImage === 'design') {
        toast({
          title: "Delete design failed",
          description: "Something went wrong...",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        toast({
          title: "Delete model failed",
          description: "Something went wrong...",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  }
  
  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        scrollBehavior={'inside'}
        isOpen={isOpen}
        onClose={close}
        size={{ sm: 'xs', md: 'lg' }}
      >
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px)' />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent maxW={isSmallerThanSm ? '320px' : 'lg'}>

            {typeImage === 'design' ?
              <ModalHeader 
                justifyItems='center' 
                borderBottom='1px' 
                borderColor='gray.100'>
                  Desain pesanan
              </ModalHeader>
              :
              <ModalHeader 
                justifyItems='center' 
                borderBottom='1px' 
                borderColor='gray.100'>
                  Model pesanan
              </ModalHeader>
            }
            <ModalCloseButton onClose={close} />
            <ModalBody>
              <Image
                h='auto'
                w='full'
                objectFit='cover'
                src={image}
                alt="ssadas"
              />
            </ModalBody>
            <ModalFooter 
              gap='3' 
              borderTop='1px' 
              borderColor='gray.100'>
              <Button  
                colorScheme='red' 
                isLoading={isSubmitting} 
                type="submit">
                  Hapus
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}