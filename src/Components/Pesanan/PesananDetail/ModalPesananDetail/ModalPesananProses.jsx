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
    ModalContent,
    ModalHeader,
    ModalFooter,
    FormControl,
    FormLabel,
    Button,
    useToast,
    ModalBody,
    Flex,
    Spinner,
    UnorderedList,
    ListItem,
} from '@chakra-ui/react'
import { useMediaQuery } from "@chakra-ui/react";
import { MdInsertPhoto } from "react-icons/md";
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../../../../Service';
import { formatInputMoneyIDR, formatToIDR, getDateToday } from '../../../../validation/format';
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';
import InputImage, {ButtonRemoveImage, ReviewImage} from '../../../InputImage';



export default function ModalPesananProses({ isOpen, onClose, status, totalHarga, DP }) {
    const initialRef = React.useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const [konfirTotalHarga, setKonfirTotalHarga] = useState(false)
    const [finalBuktiBayar, setFinalBuktiBayar] = useState('')
    const [money, setMoney] = useState("");
    const [checkDP, setCheckDP] = useState(false)
    const [checkBP, setCheckBP] = useState(false)
    const [checkLunas, setCheckLunas] = useState(false)
    const [checkOngkir, setCheckOngkir] = useState(false)

    const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");
    const { dataDetailOrder } = useSelector(state => state.pesananDetail)

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
                name: dataDetailOrder.name,
                phone: dataDetailOrder.phone,
                address: dataDetailOrder.address,
                id: dataDetailOrder.id,
                status: '',
                payment: '',
                buktiBayar: "",
                endDate: '',
            },
        }
    );

    const navigate = useNavigate();
    const toast = useToast();
    const downPayment = Number(DP)
    const buktiBayar = watch('buktiBayar')


    const close = () => {
        onClose();
        reset();
    };

    const handleChangeMoney = (event) => {
        const formattedValue = formatInputMoneyIDR(event.target.value);
        if (formattedValue === 'Rp.') {
            setMoney('')
        } else {
            setMoney(formattedValue);
        }
    };

    useEffect(() => {
        if (status === 'masuk') {
            setValue('status', 'proses')
        } else if (status === 'proses') {
            setValue('status', 'selesai')
            setValue('endDate', getDateToday())
        }
    }, [])

    useEffect(() => {
        const formatMoney = Number(money.replace(/[^0-9]/g, ''))
        if (status === 'masuk') {
            setValue('payment', formatMoney)
        } else if (status === 'proses') {
            setValue('payment', formatMoney + downPayment)
        }
    }, [money])


    useEffect(() => {
        const changeExtentionBuktiImage = async () => {
            if (buktiBayar.length === 0) return;
            setIsLoading(true);
            const image = await createImageBitmap(buktiBayar[0]);
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0);
            canvas.toBlob((blob) => {
                const file = new File([blob], buktiBayar[0].name, { type: 'image/webp' });
                setFinalBuktiBayar(file)
            }, 'image/webp');
        }
        changeExtentionBuktiImage()
    }, [buktiBayar])

    useEffect(() => {
        setIsLoading(false)
    }, [finalBuktiBayar]);

    async function onSubmit(data, e) {
        e.preventDefault();
        setCheckLunas(false)
        setCheckBP(false)
        if (totalHarga === 0) {
            setKonfirTotalHarga(true)
        } else if (dataDetailOrder.status === 'masuk' && Number(data.payment) < (totalHarga / 2)) {
            setCheckDP(true)
        } else if (dataDetailOrder.status === 'masuk' && Number(data.payment) > totalHarga) {
            setCheckDP(false)
            setCheckLunas(true)
        } else if (dataDetailOrder.status === 'proses' && dataDetailOrder.shippingCost == null) {
            setCheckDP(false)
            setCheckLunas(false)
            setCheckOngkir(true)
        } else if (dataDetailOrder.status === 'proses' && data.payment < (totalHarga + parseInt(dataDetailOrder.shippingCost)) || data.payment > (totalHarga + parseInt(dataDetailOrder.shippingCost))) {
            setCheckOngkir(false)
            setCheckDP(false)
            setCheckLunas(true)
        } else if (finalBuktiBayar.length < 1) {
            setCheckOngkir(false)
            setCheckDP(false)
            setCheckLunas(false)
            setCheckBP(true)
        }
        else {
            try {
                const formBuktiBayar = new FormData();
                if (typeof (data.buktiBayar) != 'string') {
                    formBuktiBayar.append('buktiBayar', finalBuktiBayar);
                    formBuktiBayar.append('order_id', data.id);
                    await API.addBuktiBayar(formBuktiBayar);
                }

                await API.updateOrder(data)
                toast({
                    title: "proses pesanan success",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right",
                });
                close();
                if (status === 'masuk') {
                    navigate('/pesananproses')
                } else if (status === 'proses') {
                    navigate('/pesananselesai')
                }
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
        {name:'Uang muka', data:formatToIDR(DP)},
        {name:'Biaya ongkir', data:dataDetailOrder.shippingCost > 0 ? formatToIDR(dataDetailOrder.shippingCost) : dataDetailOrder.shippingCost == 0 ? 'gratis' : 'biaya ongkir belum ditentukan'},
        {name:'Harga total', data:totalHarga === 0
        ? 'Tentukan jumlah dan harga per item terlebih dahulu'
        : dataDetailOrder.shippingCost !== null
            ? formatToIDR(totalHarga + parseInt(dataDetailOrder.shippingCost))
            : formatToIDR(totalHarga)},
        {name:'Kurang bayar', data:dataDetailOrder.shippingCost ? `${formatToIDR(totalHarga + parseInt(dataDetailOrder.shippingCost) - DP)}` : formatToIDR(totalHarga - DP)},
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
                        <ModalHeader fontSize={{ base: 'md', md: 'lg' }}>Proses pesanan</ModalHeader>
                        <ModalBody pb={5}>
                            <Wrap spacing='10px' justify={'space-between'}>
                                <WrapItem w='full' display={'flex'} flexDir={'column'}>
                                    <UnorderedList>
                                        <ListItem>Sebelum pesanan diproses pastikan bahwa data pesanan yang anda masukkan sebelumnya sudah lengkap dan benar!!!</ListItem>
                                        <ListItem>{status == 'masuk' ? 'Pesanan akan masuk ke tabel pesanan proses' : 'Pesanan akan masuk ke tabel pesanan selesai'}</ListItem>
                                    </UnorderedList>
                                    {status === 'proses' && checkOngkir ? <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} color={'red'}>Tentukan ongkir terlebih dahulu</Text> : null}
                                </WrapItem>
                                {status === 'masuk' ?
                                    <WrapItem w='full'>
                                        <Flex flexDirection='column' w='full'>
                                            <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>Harga total:</Text>
                                            <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>{totalHarga === 0 ? 'tentukan jumlah dan harga peritem dahulu' : formatToIDR(totalHarga)}</Text>
                                        </Flex>
                                    </WrapItem>
                                    :
                                    <>
                                    {paymentData.map((value, i) => {
                                        return (
                                            <WrapItem w={{ base: 'full', md: '40%' }}>
                                                <Flex flexDirection='column' w='full'>
                                                    <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>{value.name}</Text>
                                                    <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>{value.data}</Text>
                                                </Flex>
                                            </WrapItem>
                                        )
                                    })}
                                    </>
                                }
                                <WrapItem w={{ base: 'full' }}>
                                    <FormControl>
                                        <FormLabel>{status === 'masuk' ? 'Uang muka' : 'Pelunasan'}</FormLabel>
                                        <Input type="text" value={money} onChange={handleChangeMoney} placeholder='masukkan nominal' focusBorderColor='#00AA5D' required />
                                        {checkDP && <Text color='red'>minimal DP 1/2 dari total harga</Text>}
                                        {checkLunas && <Text color='red'>jumlah pembayaran tidak sesuai</Text>}
                                    </FormControl>
                                </WrapItem>
                                <WrapItem w='100%'>
                                    <FormControl>
                                        {isLoading &&
                                            <Flex w='full' justifyContent='center' align='center' h='80'>
                                                <Spinner />
                                            </Flex>}
                                        {finalBuktiBayar && (
                                            <Box>
                                                <ReviewImage alt={'buktiBayar'} src={finalBuktiBayar}/>
                                                <ButtonRemoveImage handle={removeSelectedBuktiBayar} image={'bukti bayar'}/>
                                            </Box>
                                        )}
                                        {finalBuktiBayar === "" ?
                                            <Flex flexDirection='column' w='full'>
                                                <InputImage inputId={'fileInput'} inputName={'Bukti pembayaran'} registerName={{...register("buktiBayar")}}/> 
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
                            {!isLoading && (
                                buktiBayar ?
                                    <Button colorScheme='green' isLoading={isSubmitting} type="submit">
                                        Proses
                                    </Button>
                                    :
                                    <Button colorScheme='green' type="submit">
                                        Proses
                                    </Button>
                            )}
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