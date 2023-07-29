import {
    Box,
    Text,
    Center,
    Image,
    Input,
    Wrap,
    WrapItem,
    Modal,
    ModalOverlay,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalFooter,
    FormControl,
    FormLabel,
    Button,
    useToast,
    ModalBody,
    Flex,
} from '@chakra-ui/react'
import { useMediaQuery } from "@chakra-ui/react";
import { MdInsertPhoto } from "react-icons/md";
import React, { useState, useEffect } from 'react'
import API from '../../../../Service';
import InputImage, { ButtonRemoveImage, ReviewImage } from '../../../InputImage';
import { formatInputMoneyIDR, formatMoneyIDR, formatToIDR } from '../../../../validation/format';
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshDetailPesanan } from '../../../../Features/Pesanan/PesananDetail';


export default function ModalDownPayment({ isOpen, onClose, status, totalHarga, DP }) {
    const initialRef = React.useRef(null)
    const [konfirTotalHarga, setKonfirTotalHarga] = useState(false)
    const [finalBuktiBayar, setFinalBuktiBayar] = useState('')
    const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");
    const [money, setMoney] = useState("");
    const [checkDP, setCheckDP] = useState(false)
    const [checkBP, setCheckBP] = useState(false)

    const { dataDetailOrder } = useSelector(state => state.pesananDetail);

    const {
        handleSubmit,
        reset,
        watch,
        setValue,
        register,
        formState: { isSubmitting },
    } = useForm(
        {
            defaultValues: {
                id: dataDetailOrder.id,
                id_DP: dataDetailOrder.bukti_bayars[0].id,
                name: dataDetailOrder.name,
                phone: dataDetailOrder.phone,
                address: dataDetailOrder.address,
                status: 'proses',
                payment: '',
                buktiBayar: "",
            },
        }
    );

    const dispatch = useDispatch();
    const toast = useToast();
    const buktiBayar = watch('buktiBayar')

    const close = () => {
        onClose();
        reset();
    };
    useEffect(() => {
        setValue('payment', dataDetailOrder.payment)
        setMoney(formatToIDR(dataDetailOrder.payment))
        if (dataDetailOrder.bukti_bayars[0]) {
            setFinalBuktiBayar(dataDetailOrder.bukti_bayars[0].buktiBayar)
        }
    }, [])

    const handleChangeMoney = (event) => {
        const formattedValue = formatInputMoneyIDR(event.target.value);
        if (formattedValue === 'Rp.') {
            setMoney('')
        } else {
            setMoney(formattedValue);
        }
    };


    useEffect(() => {
        if (money.length) setValue('payment', money.replace(/[^0-9]/g, ''))
    }, [money])


    useEffect(() => {
        const changeExtentionBuktiImage = async () => {
            if (buktiBayar.length === 0) return;

            const image = await createImageBitmap(buktiBayar[0]);
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0);
            canvas.toBlob((blob) => {
                if (buktiBayar[0]) {
                    const file = new File([blob], buktiBayar[0].name, { type: 'image/webp' });
                    setFinalBuktiBayar(file)
                }
            }, 'image/webp');
        }
        changeExtentionBuktiImage()
    }, [buktiBayar])

    async function onSubmit(data, e) {
        e.preventDefault();
        if (totalHarga === 0) {
            setKonfirTotalHarga(true)
        } else if (data.payment < (totalHarga / 2)) {
            setCheckDP(true)
        } else if (finalBuktiBayar.length < 1) {
            setCheckBP(true)
        } else {
            try {
                const formBuktiBayar = new FormData();
                if (typeof (data.buktiBayar) !== 'string') {
                    formBuktiBayar.append('buktiBayar', finalBuktiBayar);
                    formBuktiBayar.append('order_id', data.id);
                    formBuktiBayar.append('id', data.id_DP);
                    await API.updateDownPayment(data.id_DP, formBuktiBayar);
                }

                await API.updateOrder(data)
                toast({
                    title: "proses pesanan success",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                dispatch(setRefreshDetailPesanan())
                close();
            } catch (error) {
                toast({
                    title: "Proses pesanan failed",
                    description: "Something went wrong...",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
            }
        }
    }

    const removeSelectedBuktiBayar = () => {
        setValue('buktiBayar', '');
        setFinalBuktiBayar('')
    };

    const handleToggleTotalHarga = (e) => {
        e.preventDefault();
        setKonfirTotalHarga(false)
    }

    const paymentData = [
        {payment: 'Harga total', data:totalHarga === 0 ? 'tentukan jumlah dan harga peritem dahulu' : formatMoneyIDR(totalHarga)},
        {payment: 'Uang muka', data:formatMoneyIDR(DP)},
    ]
    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                scrollBehavior={'inside'}
                isOpen={isOpen}
                onClose={close}
                closeOnOverlayClick={false}
                size={{ sm: 'xs', md: 'lg' }}
            >
                <ModalOverlay />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalContent maxW={isSmallerThanSm ? '320px' : 'lg'}>
                        <ModalCloseButton onClose={reset} />
                        <ModalHeader fontSize={{ base: 'md', md: 'lg' }}>Uang muka</ModalHeader>
                        <ModalBody pb={5}>
                            <Wrap spacing='10px' justify={'space-between'}>
                                {paymentData?.map((value, i) => {
                                    return (
                                        <WrapItem key={i} w={{ base: 'full', md: '40%' }}>
                                            <Flex flexDirection='column' w='full'>
                                                <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>{value.payment}</Text>
                                                <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>{value.data}</Text>
                                            </Flex>
                                        </WrapItem>
                                    )
                                })}
                               
                                <WrapItem w={{ base: 'full' }}>
                                    <FormControl>
                                        <FormLabel>Edit uang muka</FormLabel>
                                        <Input type="text" value={money} onChange={handleChangeMoney} placeholder='masukkan nominal' required />
                                        {checkDP && <Text color='red'>minimal DP 1/2 dari total harga</Text>}
                                    </FormControl>
                                </WrapItem>
                                <WrapItem w='100%'>
                                    <FormControl>
                                        {finalBuktiBayar && (
                                            <Box>
                                                {typeof finalBuktiBayar !== 'string' ?
                                                    <ReviewImage alt={'buktiBayar'} src={finalBuktiBayar} />
                                                    :
                                                    <Image
                                                        borderRadius='lg'
                                                        h='auto'
                                                        w='full'
                                                        objectFit='cover'
                                                        src={finalBuktiBayar}
                                                        alt="ssadas"
                                                    />
                                                }
                                                <ButtonRemoveImage handle={removeSelectedBuktiBayar} image={'bukti pembayaran'} />
                                            </Box>
                                        )}
                                        {finalBuktiBayar === "" ?
                                            <Flex flexDirection='column' w='full'>
                                                <InputImage inputId={'fileInputDownpayment'} inputName={'Bukti Pembayaran'} registerName={{ ...register("buktiBayar") }} />
                                                {checkBP && <Text color='red'>sertakan bukti pembayaran</Text>}
                                            </Flex>
                                            : null}
                                    </FormControl>
                                </WrapItem>
                            </Wrap>
                        </ModalBody>
                        <ModalFooter gap='2'>
                            <Button
                                disabled={isSubmitting}
                                onClick={isSubmitting ? null : close}
                            >
                                Batal
                            </Button>
                            <Button colorScheme='green' isLoading={isSubmitting} type="submit">
                                Edit
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
            {konfirTotalHarga === true ?
                <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered>
                    <ModalOverlay />
                    <ModalContent maxW={isSmallerThanSm ? '320px' : 'lg'}>
                        <ModalHeader>konfirmasi</ModalHeader>
                        <ModalBody>
                            <Text>Lengkapi data jumlah pesanan dan harga peritem terlebih dahulu!!!</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button mr={3} onClick={handleToggleTotalHarga}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal> : null}
        </>
    )
}