import {
  Textarea,
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
  FormControl,
  FormLabel,
  Wrap,
  Stack,
  WrapItem,
  useToast
} from '@chakra-ui/react'
import { Radio, RadioGroup } from '@chakra-ui/react'
// import {
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   MenuItemOption,
//   MenuGroup,
//   MenuOptionGroup,
//   MenuDivider,
// } from '@chakra-ui/react'
// import { ChevronDownIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form';
import { setRefreshDetailPesanan } from '../../../../Features/Pesanan/PesananDetail';
import API from '../../../../Service';
import { yupResolver } from "@hookform/resolvers/yup";
import { UPDATE_PESANAN_MASUK_VALIDATION } from '../../../../validation';
import { formatToIDR, formatInputMoneyIDR } from '../../../../validation/format';
import { getDateToday } from '../../../../validation/format';


export default function ModalEditPesananMasuk({ isOpen, onClose }) {
  const initialRef = React.useRef(null)
  const { dataDetailOrder, refreshDetailPesanan } = useSelector(state => state.pesananDetail)
  const [pricePerItem, setPricePerItem] = useState("");
  const [shippingCost, setShippingCost] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm(
    {
      resolver: yupResolver(UPDATE_PESANAN_MASUK_VALIDATION),
    }
  );

  const dispatch = useDispatch();
  const toast = useToast();

  const close = () => {
    onClose();
    reset();
  };

  const handleChangePricePerItem = (event) => {
    const formattedValue = formatInputMoneyIDR(event.target.value);
    if (formattedValue == 'Rp. ') {
      setPricePerItem('')
    } else {
      setPricePerItem(formattedValue);
    }
  };

  // const handleChangeShippingCost = (event) => {
  //   const formattedValue = formatInputMoneyIDR(event.target.value);
  //   if (formattedValue == 'Rp. ') {
  //     setShippingCost('')
  //   } else {
  //     setShippingCost(formattedValue);
  //   }
  // }

  useEffect(() => {
    setValue('id', dataDetailOrder.id);
    setValue('name', dataDetailOrder.name);
    setValue('phone', dataDetailOrder.phone);
    setValue('email', dataDetailOrder.email);
    setValue('address', dataDetailOrder.address);
    setValue('quantity', dataDetailOrder.quantity);
    setValue('pricePerItem', dataDetailOrder.pricePerItem);
    setValue('size', dataDetailOrder.size);
    setValue('deadline', dataDetailOrder.deadline);
    setValue('description', dataDetailOrder.description);
    if (dataDetailOrder.status === 'proses') {
      setValue('shippingCost', dataDetailOrder.shippingCost)
      setShippingCost(formatToIDR(dataDetailOrder.shippingCost))
    }

    setPricePerItem(formatToIDR(dataDetailOrder.pricePerItem))
  }, [refreshDetailPesanan]);

  useEffect(() => {
    if (typeof pricePerItem === 'string') {
      setValue('pricePerItem', pricePerItem.replace(/[^0-9]/g, ''))
    }
    if (typeof shippingCost === 'string') {
      setValue('shippingCost', shippingCost.replace(/[^0-9]/g, ''))
    }
  }, [shippingCost, pricePerItem]);


  async function onSubmit(data) {
    try {
      const res = await API.updateOrder(data)
      dispatch(setRefreshDetailPesanan())
      toast({
        title: "Edit pesanan success",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Edit pesanan failed",
        description: "Something went wrong...",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  }


  return (
    <>
      <Modal
        pb='80'
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={close}
        closeOnOverlayClick={false}
        scrollBehavior='inside'
        size={{ sm: 'full', md: '2xl' }}
      >
        <ModalOverlay/>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader borderBottom='1px' borderColor='gray.100'>Edit Pesanan</ModalHeader>
            <ModalCloseButton onClose={close} />
            <ModalBody pb={6}>
              <Wrap spacing='10px' justify={'space-between'}>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>nama pemesan</FormLabel>
                    <Input type="text" name="name" {...register('name')} placeholder='Nama'  />
                    {errors.name && <Text color={'red'} fontSize={'sm'}>{errors.name.message}</Text> }
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="email" {...register('email')} placeholder='Email' />
                    {errors.email && <Text color={'red'} fontSize={'sm'}>{errors.email.message}</Text>}
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Phone</FormLabel>
                    <Input type="number" name="phone" {...register('phone')} placeholder='Phone'  />
                    {errors.phone && <Text color={'red'} fontSize={'sm'}>{errors.phone.message}</Text> }                                                                    
                  </FormControl>
                </WrapItem>
                <WrapItem w='100%'>
                  <FormControl>
                    <FormLabel>Alamat</FormLabel>
                    <Textarea type="text" name="address" {...register('address')} placeholder='Alamat' />
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Jumlah pesanan</FormLabel>
                    <Input type="number" name="quantity" {...register('quantity')} placeholder='Jumlah pesanan' />
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Harga peritem</FormLabel>
                    <Input type="text" name="pricePeritem" value={pricePerItem} onChange={handleChangePricePerItem} placeholder='Harga peritem' />
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Ukuran</FormLabel>
                    <Input type="text" name="size" {...register('size')} placeholder='Size' />
                  </FormControl>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }}>
                  <FormControl>
                    <FormLabel>Deadline</FormLabel>
                    <Input type="date" name="deadline" {...register('deadline')} placeholder='Deadline' min={getDateToday()} />
                  </FormControl>
                </WrapItem>
                <WrapItem w='100%'>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea type="text" name="description" {...register('description')} placeholder='Description' />
                  </FormControl>
                </WrapItem>
              </Wrap>
            </ModalBody>
            <ModalFooter gap='3' borderTop='1px' borderColor='gray.100'>
              <Button
                disabled={isSubmitting}
                onClick={isSubmitting ? null : close}
              >
                Cancel
              </Button>
              <Button
                colorScheme='blue'
                mr={3}
                isLoading={isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}