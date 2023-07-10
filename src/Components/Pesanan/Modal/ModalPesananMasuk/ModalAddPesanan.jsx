import {
  Text,
  Flex,
  Spinner,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormLabel,
  Wrap,
  WrapItem,
  useToast,
  Textarea,
  useColorModeValue
} from '@chakra-ui/react'
import { MdInsertPhoto } from "react-icons/md";
import React, { useState, useEffect } from 'react'
import API from '../../../../Service';
import { yupResolver } from "@hookform/resolvers/yup";
import { formatInputMoneyIDR } from '../../../../validation/format';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { setRefresOrderMasuk } from '../../../../Features/Pesanan/PesananMasuk';
import { getDateToday } from '../../../../validation/format';
import { CREATE_PESANAN_MASUK_VALIDATION } from '../../../../validation';


export default function ModalAddPesananMasuk({ isOpen, onClose }) {
  const btnRef = React.useRef(null);
  const [isLoadingDesign, setIsLoadingDesign] = useState(false)
  const [isLoadingModel, setIsLoadingModel] = useState(false)
  const [finalDesign, setFinalDesign] = useState('')
  const [finalModel, setFinalModel] = useState('')
  const [pricePerItem, setPricePerItem] = useState("");

  const dispatch = useDispatch();
  const toast = useToast();

  const generateID = (prefix, length) => {
    const randomID = Math.random().toString(36).substring(2, length + 2);
    return prefix + randomID;
  }
  const id = generateID("ODR-", 6);

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm(
    {
      resolver: yupResolver(CREATE_PESANAN_MASUK_VALIDATION),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        address: "",
        quantity: '',
        pricePerItem: '',
        size: "",
        model: "",
        design: "",
        deadline: "",
        description: "",
        status: "masuk",
        company_id: 1,
      },
    }
  );


  const design = watch('design')
  const model = watch('model')
  const close = () => {
    onClose();
    reset();
    setPricePerItem('')
    setFinalDesign('')
    setFinalModel('')
    setIsLoadingDesign(false)
    setIsLoadingModel(false)
  };

  const handleChangePricePerItem = (event) => {
    const formattedValue = formatInputMoneyIDR(event.target.value);
    if (formattedValue === 'Rp.') {
      setPricePerItem('')
    } else {
      setPricePerItem(formattedValue);
    }
  };

  useEffect(() => {
    if (typeof pricePerItem === 'string') {
      setValue('pricePerItem', pricePerItem.replace(/[^0-9]/g, ''))
    }
  }, [pricePerItem]);


  useEffect(() => {
    const changeExtentionDesign = async () => {
      if (design.length === 0) return;
      setIsLoadingDesign(true)
      const image = await createImageBitmap(design[0]);
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
      setIsLoadingModel(true)
      const image = await createImageBitmap(model[0]);
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (model[0]) {
          const file = new File([blob], model[0].name, { type: 'image/webp' });
          setFinalModel(file)
        }
      }, 'image/webp');
    }
    changeExtentionModel()
  }, [model])

  useEffect(() => {
    setIsLoadingDesign(false)
    setIsLoadingModel(false)
  }, [finalDesign, finalModel])


  async function onSubmit(data) {
    try {
      const formData = new FormData();
      const formDataDesign = new FormData();
      const formDataModel = new FormData();

      formData.append('id', id);
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      formData.append('address', data.address);
      formData.append('description', data.description)
      formData.append('quantity', data.quantity)
      formData.append('pricePerItem', data.pricePerItem)
      formData.append('size', data.size)
      formData.append('deadline', data.deadline)
      formData.append('status', data.status)
      formData.append('company_id', data.company_id)
      await API.addPesananMasuk(formData)

      if (typeof (data.design) != 'string') {
        formDataDesign.append('design', finalDesign)
        formDataDesign.append('order_id', id)
        await API.addDesign(formDataDesign)
      }

      if (typeof (data.model) != 'string') {
        formDataModel.append('model', finalModel)
        formDataModel.append('order_id', id)
        await API.addModel(formDataModel)
      }

      dispatch(setRefresOrderMasuk())
      toast({
        title: "Add pesanan success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Add pesanan failed",
        description: "Something went wrong...",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
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

  console.log(errors);
  return (
    <>
      <Modal
        finalFocusRef={btnRef}
        scrollBehavior={'inside'}
        isOpen={isOpen}
        onClose={close}
        closeOnOverlayClick={false}
        size={{ sm: 'full', md: '2xl' }}
      >
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px)' />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent bg={useColorModeValue('white', '#1E2023')}>
            <ModalHeader borderBottom='1px' borderColor='gray.100'>Add order</ModalHeader>
            <ModalCloseButton onClose={close} />
            <ModalBody pb={6}>
              <Wrap spacing='10px' justify={'space-between'}>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Nama</FormLabel>
                  <Input type="text" name="name" {...register('name')} focusBorderColor='#00AA5D' />
                  {errors.name && <Text color={'red'} fontSize={'sm'}>{errors.name.message}</Text>}
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Email</FormLabel>
                  <Input type='email' name="email" {...register('email')}  focusBorderColor='#00AA5D'/>
                  {errors.email && <Text color={'red'} fontSize={'sm'}>{errors.email.message}</Text>}
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>No HP</FormLabel>
                  <Input type="number" name="phone" {...register('phone')}  focusBorderColor='#00AA5D'/>
                  {errors.phone && <Text color={'red'} fontSize={'sm'}>{errors.phone.message}</Text>}
                </WrapItem>
                <WrapItem w='100%' display='flex' flexDirection='column'>
                  <FormLabel>Alamat</FormLabel>
                  <Textarea type="text" name="address" {...register('address')}  focusBorderColor='#00AA5D'/>
                  {errors.address && <Text color={'red'} fontSize={'sm'}>{errors.address.message}</Text>}
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Jumlah pesanan</FormLabel>
                  <Input type="number" name="quantity" {...register('quantity')} focusBorderColor='#00AA5D'/>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Harga peritem</FormLabel>
                  <Input type="text" name="pricePerItem" value={pricePerItem} onChange={handleChangePricePerItem} focusBorderColor='#00AA5D'/>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Ukuran</FormLabel>
                  <Input type="text" name="size" {...register('size')} focusBorderColor='#00AA5D'/>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Deadline</FormLabel>
                  <Input type="date" name="deadline" {...register('deadline')} placeholder='Deadline' min={getDateToday()}  focusBorderColor='#00AA5D'/>
                </WrapItem>
                <WrapItem w='100%' display='flex' flexDirection='column'>
                  <FormLabel>Deskripsi</FormLabel>
                  <Textarea type="text" name="description" {...register('description')} focusBorderColor='#00AA5D'/>
                </WrapItem>
                <WrapItem w='100%' display='flex' flexDirection='column'>
                  {isLoadingDesign &&
                    <Flex w='full' justifyContent='center' align='center' h='80'>
                      <Spinner />
                    </Flex>}
                  {finalDesign && (
                    <>
                      <Image
                        borderRadius='lg'
                        h='auto'
                        w='full'
                        objectFit='cover'
                        src={URL.createObjectURL(finalDesign)}
                        alt="design"
                      />

                      <Button
                        onClick={removeSelectedDesign}
                        color='white'
                        w='full'
                        cursor='pointer'
                        mt='1'
                        p='15'
                        colorScheme="red"
                      >
                        Hapus desain
                      </Button>
                    </>

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
                        w='full'
                        className='hidden'
                        accept="image/*"
                      />
                      <Text
                        fontWeight='bold'
                      >
                        Desain
                      </Text>
                    </FormLabel> : null}
                </WrapItem>
                <WrapItem w='100%' display='flex' flexDirection='column'>
                  {isLoadingModel &&
                    <Flex w='full' justifyContent='center' align='center' h='80'>
                      <Spinner />
                    </Flex>}
                  {finalModel && (
                    <>
                      <Image
                        borderRadius='lg'
                        h='auto'
                        w='full'
                        objectFit='cover'
                        src={URL.createObjectURL(finalModel)}
                        alt="model"
                      />

                      <Button
                        onClick={removeSelectedModel}
                        color='white'
                        w='full'
                        cursor='pointer'
                        mt='1'
                        p='15'
                        colorScheme="red"
                      >
                        Hapus model
                      </Button>
                    </>
                  )}
                  {finalModel === "" ?
                    <FormLabel
                      py='2'
                      htmlFor="fileInputModel"
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
                        id='fileInputModel'
                        w='full'
                        className='hidden'
                        accept="image/*"
                      />
                      <Text
                        fontWeight='bold'
                      >Model</Text>
                    </FormLabel> : null}
                </WrapItem>
              </Wrap>
            </ModalBody>

            <ModalFooter gap={3} borderTop='1px' borderColor='gray.100'>
              <Button
                disabled={isSubmitting}
                onClick={isSubmitting ? null : close}
              >
                Batal
              </Button>
              {!isLoadingDesign && !isLoadingModel ?
                <Button colorScheme='green' isLoading={isSubmitting} type="submit">
                  Simpan
                </Button>
                : null}
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}