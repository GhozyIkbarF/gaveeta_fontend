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
import { formatInputMoneyIDR, formatMoneyIDR, getDateToday } from '../../../../validation/format';
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';



export default function ModalPesananProses({ isOpen, onClose, status, totalHarga, DP }) {
    const initialRef = React.useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const [konfirBuktiBayar, setKonfirBuktiBayar] = useState(false)
    const [konfirTotalHarga, setKonfirTotalHarga] = useState(false)
    const [finalBuktiBayar, setFinalBuktiBayar] = useState('')
    const [money, setMoney] = useState("");
    const [checkDP, setCheckDP] = useState(false)
    const [checkBP, setCheckBP] = useState(false)
    const [checkLunas, setCheckLunas] = useState(false)

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
            // resolver: yupResolver(CREATE_POST_VALIDATION),
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
        } else if (dataDetailOrder.status === 'proses' && data.payment < totalHarga || data.payment > totalHarga) {
            setCheckDP(false)
            setCheckLunas(true)
        } else if (finalBuktiBayar.length < 1) {
            setCheckDP(false)
            setCheckLunas(false)
            setCheckBP(true)
        }
        else {
            try {
                console.log(data)
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
                    position: "bottom-right",
                });
                close();
                if (status === 'masuk') {
                    navigate('/pesanan_proses')
                } else if (status === 'proses') {
                    navigate('/pesanan_selesai')
                }
            } catch (error) {
                toast({
                    title: "Proses pesanan failed",
                    description: "Something went wrong...",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right",
                });
            }
        }
    }

    const removeSelectedBuktiBayar = () => {
        setValue('buktiBayar', '');
        setFinalBuktiBayar('')
    };


    // const handleToggleBuktiBayar = (e) => {
    //     e.preventDefault();
    //     setKonfirBuktiBayar(false)
    // }
    const handleToggleTotalHarga = (e) => {
        e.preventDefault();
        setKonfirTotalHarga(false)
    }
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
                                <WrapItem w='full'>
                                    <UnorderedList>
                                        <ListItem>Sebelum pesanan diproses pastikan bahwa data pesanan yang anda masukkan sebelumnya sudah lengkap dan benar!!!</ListItem>
                                        <ListItem>{status == 'masuk' ? 'Pesanan akan masuk ke tabel pesanan proses' : 'Pesanan akan masuk ke tabel pesanan selesai'}</ListItem>
                                    </UnorderedList>
                                </WrapItem>
                                {status === 'masuk' ?
                                    <WrapItem w='full'>
                                        <Flex flexDirection='column' w='full'>
                                            <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>Harga total:</Text>
                                            {totalHarga === 0 ? <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>tentukan jumlah dan harga peritem dahulu</Text> : <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>{formatMoneyIDR(totalHarga)}</Text>}
                                        </Flex>
                                    </WrapItem>
                                    :
                                    <>
                                        <WrapItem w={{ base: 'full', md: '40%' }}>
                                            <Flex flexDirection='column' w='full'>
                                                <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>Harga total:</Text>
                                                {totalHarga === 0 ? <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>tentukan jumlah dan harga peritem dahulu</Text> : <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>{formatMoneyIDR(totalHarga)}</Text>}
                                            </Flex>
                                        </WrapItem>
                                        <WrapItem w={{ base: 'full', md: '45%' }}>
                                            <Flex flexDirection='column' w='full'>
                                                <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>Uang muka:</Text>
                                                {<Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>{formatMoneyIDR(DP)}</Text>}
                                            </Flex>
                                        </WrapItem>
                                        <WrapItem w={{ base: 'full', md: '40%' }}>
                                            <Flex flexDirection='column' w='full'>
                                                <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>Kurang bayar:</Text>
                                                {<Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>{formatMoneyIDR(totalHarga - DP)}</Text>}
                                            </Flex>
                                        </WrapItem>
                                    </>
                                }
                                <WrapItem w={{ base: 'full' }}>
                                    <FormControl>
                                        {status === 'masuk' ? <FormLabel>Pembayaran awal</FormLabel> : <FormLabel>Pelunasan</FormLabel>}
                                        <Input type="text" value={money} onChange={handleChangeMoney} placeholder='masukkan nominal' required />
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
                                                <Image
                                                    borderRadius='lg'
                                                    h='auto'
                                                    w='full'
                                                    objectFit='cover'
                                                    src={URL.createObjectURL(finalBuktiBayar)}
                                                    alt="ssadas"
                                                />
                                                <Center>
                                                    <Button
                                                        onClick={removeSelectedBuktiBayar}
                                                        className=" text-white w-full cursor-pointer mt-1 p-15"
                                                        colorScheme="red"
                                                    >
                                                        Remove bukti payment
                                                    </Button>
                                                </Center>
                                            </Box>
                                        )}
                                        {finalBuktiBayar === "" ?
                                            <Flex flexDirection='column' w='full'>
                                                <label
                                                    htmlFor="fileInputDesign"
                                                    className="bg-blue-500 cursor-pointer border-white rounded-lg h-10  flex items-center justify-center  text-white "
                                                >
                                                    <MdInsertPhoto />
                                                    <Input
                                                        {...register("buktiBayar")}
                                                        type="file"
                                                        id="fileInputDesign"
                                                        className="hidden"
                                                        accept="image/*"
                                                    />
                                                    <p className="font-semibold">Bukti payment</p>
                                                </label>
                                                {checkBP && <Text color='red'>sertakan bukti payment</Text>}
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