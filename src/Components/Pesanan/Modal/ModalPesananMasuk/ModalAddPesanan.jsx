import {
  Text,
  Flex,
  Spinner,
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
import React, { useState, useEffect } from 'react'
import API from '../../../../Service';
import { yupResolver } from "@hookform/resolvers/yup";
import { formatInputMoneyIDR, getDateToday } from '../../../../validation/format';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { setRefresOrderMasuk } from '../../../../Features/Pesanan/PesananMasuk';
import { CREATE_PESANAN_MASUK_VALIDATION } from '../../../../validation';
import InputImage,{ ReviewImage, ButtonRemoveImage } from '../../../InputImage';



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
  const id = generateID("odr", 6);

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

  const changeExtentionImage = async (paramImage, param) => {
    if (paramImage.length === 0) return;
    const image = await createImageBitmap(paramImage[0]);
    if(param === 'design'){
      setIsLoadingDesign(true);
    }else{
      setIsLoadingModel(true)
    }
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
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      close();
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Add pesanan failed",
        description: "Something went wrong...",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
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


  // const InputRequired = ({label, name, error, errorMessage, input}) => {

  //   const InputItem = () => {
  //     if(input ==){

  //     }
  //   }
  //   return(
  //     <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
  //       <FormLabel>{label}</FormLabel>
  //       {input === 'input' ? <Input type="text" name={name} {...register({name})} focusBorderColor='#00AA5D' /> 
  //       : 
  //       <Textarea type="text" name={name} {...register({name})} focusBorderColor='#00AA5D' />
  //       }
  //       {error && <Text color={'red'} fontSize={'sm'}>{errorMessage}</Text>}
  //     </WrapItem>
  //   )
  // }
  // const InputRequired = [
  //   {label:'Nama', name:'name', error: errors.name, errorMessage:errors.name.message ,input:'input' },
  //   {label:'Email', name:'email', error: errors.email, errorMessage:errors.email.message ,input:'input' },
  //   {label:'No Hp', name:'phone', error: errors.phone, errorMessage:errors.phone.message ,input:'input' },
  //   {label:'Alamat', name:'address', error: errors.address, errorMessage:errors.address.message ,input:'textarea' },
  //   ]

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
                {/* <InputRequired label={'Nama'} name={'name'} error={errors.name} errorMessage={errors.name.message} input={'input'}/> */}
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Nama</FormLabel>
                  <Input type="text" name="name" {...register('name')} focusBorderColor='#00AA5D' />
                  {errors.name && <Text color={'red'} fontSize={'sm'}>{errors.name.message}</Text>}
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Email</FormLabel>
                  <Input type='email' name="email" {...register('email')} focusBorderColor='#00AA5D' />
                  {errors.email && <Text color={'red'} fontSize={'sm'}>{errors.email.message}</Text>}
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>No HP</FormLabel>
                  <Input type="number" name="phone" {...register('phone')} focusBorderColor='#00AA5D' />
                  {errors.phone && <Text color={'red'} fontSize={'sm'}>{errors.phone.message}</Text>}
                </WrapItem>
                <WrapItem w='100%' display='flex' flexDirection='column'>
                  <FormLabel>Alamat</FormLabel>
                  <Textarea type="text" name="address" {...register('address')} focusBorderColor='#00AA5D' />
                  {errors.address && <Text color={'red'} fontSize={'sm'}>{errors.address.message}</Text>}
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Jumlah pesanan</FormLabel>
                  <Input type="number" name="quantity" {...register('quantity')} focusBorderColor='#00AA5D' />
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Harga peritem</FormLabel>
                  <Input type="text" name="pricePerItem" value={pricePerItem} onChange={handleChangePricePerItem} focusBorderColor='#00AA5D' />
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Ukuran</FormLabel>
                  <Input type="text" name="size" {...register('size')} focusBorderColor='#00AA5D' />
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                  <FormLabel>Deadline</FormLabel>
                  <Input type="date" name="deadline" {...register('deadline')} placeholder='Deadline' min={getDateToday()} focusBorderColor='#00AA5D' />
                </WrapItem>
                <WrapItem w='100%' display='flex' flexDirection='column'>
                  <FormLabel>Deskripsi</FormLabel>
                  <Textarea type="text" name="description" {...register('description')} focusBorderColor='#00AA5D' />
                </WrapItem>
                <WrapItem w='100%' display='flex' flexDirection='column'>
                  {isLoadingDesign &&
                    <Flex w='full' justifyContent='center' align='center' h='80'>
                      <Spinner />
                    </Flex>}
                  {finalDesign && (
                    <>
                    <ReviewImage alt={'design'} src={finalDesign}/>
                    <ButtonRemoveImage handle={handleRemoveSelectedDesign} image={'design'}/>
                    </>

                  )}
                  {finalDesign === "" ? <InputImage inputId={"fileInputDesign"} registerName={{...register('design')}} inputName={'Desain'}/>: null}
                </WrapItem>
                <WrapItem w='100%' display='flex' flexDirection='column'>
                  {isLoadingModel &&
                    <Flex w='full' justifyContent='center' align='center' h='80'>
                      <Spinner />
                    </Flex>}
                  {finalModel && (
                    <>
                    <ReviewImage alt={'model'} src={finalModel}/>
                    <ButtonRemoveImage handle={handleRemoveSelectedModel} image={'model'}/>
                    </>
                  )}
                  {finalModel === "" ? <InputImage inputId={"fileInputModel"} registerName={{...register('model')}} inputName={'Model'}/> : null}
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