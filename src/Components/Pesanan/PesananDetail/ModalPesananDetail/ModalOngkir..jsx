import {
    Text,
    Modal,
    ModalOverlay,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button,
    Stack,
    useToast,
    ModalBody,
    WrapItem,
    FormControl,
    Input,
    FormLabel,
    VStack
} from '@chakra-ui/react'
import { Radio, RadioGroup } from '@chakra-ui/react'
import { useMediaQuery } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react'
import API from '../../../../Service';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { setRefreshDetailPesanan } from '../../../../Features/Pesanan/PesananDetail';


export default function ModalOngkir({ isOpen, onClose, id, shippingCost }) {
    const initialRef = React.useRef(null)
    const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");
    const [radioValue, setRadioValue] = useState(null)

    const dispatch = useDispatch();
    const { typeImage, IdRemoveImage } = useSelector(state => state.pesananDetail);
    const {
        handleSubmit,
        reset,
        register,
        setValue,
        formState: { isSubmitting },
    } = useForm(
        {
            defaultValues: {
                id: id,
                shippingCost: shippingCost
            },
        }
    );

    const close = () => {
        onClose();
        reset();
    };

    const toast = useToast();

    async function onSubmit(value) {
        try {
            await API.updateShippingCost(value)
            toast({
                title: "Delete design success",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom-right",
            });
            dispatch(setRefreshDetailPesanan())
            close();
        } catch (error) {
            toast({
                title: "Delete model failed",
                description: "Something went wrong...",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-right",
            });
        }
    }

    useEffect(() => {
        if (shippingCost == 0) {
            setRadioValue('1')
            setValue('shippingCost', 0)
        } if (shippingCost > 1) {
            setRadioValue('2')
            setValue('shippingCost', shippingCost)
        }
    }, []);

    const handleChangeValueRadio = (value, e) => {
        if (value == 1) {
            setRadioValue('1')
            setValue('shippingCost', 0)
        } else if (value == 2) {
            setRadioValue('2')
            setValue('shippingCost', null)
        } else {
            setRadioValue(null)
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
                        <ModalHeader justifyItems='center' borderBottom='1px' borderColor='gray.100'>Desain pesanan</ModalHeader>
                        <ModalCloseButton onClose={close} />
                        <ModalBody>
                            <WrapItem w={{ base: 'full' }} mb={5}>
                                <Text>Tentukan biaya ongkir ketika pesanan sudah jadi dan siap dikirim</Text>
                            </WrapItem>
                            <WrapItem w={{ base: 'full' }}>
                                <VStack w={'full'} align={'start'}>
                                    <FormControl>
                                        <FormLabel>Biaya ongkir</FormLabel>
                                        <RadioGroup onChange={(value) => handleChangeValueRadio(value)} value={radioValue}>
                                            <Stack direction='row'>
                                                <Radio value='1'>Gratis</Radio>
                                                <Radio value='2'>Tidak Gratis</Radio>
                                            </Stack>
                                        </RadioGroup>
                                    </FormControl>
                                    {radioValue === '2' ?
                                        <FormControl>
                                            <FormLabel>Nominal</FormLabel>
                                            <Input
                                                type="number"
                                                {...register('shippingCost')}
                                                placeholder='masukkan nominal'
                                                required
                                            />
                                        </FormControl> : null
                                    }
                                </VStack>
                            </WrapItem>
                        </ModalBody>
                        <ModalFooter gap='3' borderTop='1px' borderColor='gray.100'>
                            <Button colorScheme='red' onClick={onClose}>
                                Batal
                            </Button>
                            <Button colorScheme='blue' isLoading={isSubmitting} type="submit">
                                Edit
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    )
}