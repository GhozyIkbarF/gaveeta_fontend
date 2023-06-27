import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import API from '../../../Service';
import {
    setDataDetailOrder,
    setAllDesignItems,
    setAllModelItems,
    setActionDetailOrder,
    setTypeDetailItem,
    setIdRemoveImage,
    setRefreshDetailPesanan,
    setRefreshModalRemoveImage
} from '../../../Features/Pesanan/PesananDetail'
import { formatMoneyIDR, convertToIndonesianDate } from '../../../validation/format';


//cakra component
import { useDisclosure } from '@chakra-ui/react'
import { Box, Text, Flex, Image, SimpleGrid, Button, Icon } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react'

// icon
import { MdDescription, MdPhoto } from 'react-icons/md';
import { FaPencilAlt, FaArrowLeft, FaCube } from "react-icons/fa";
import { AiOutlineEllipsis } from 'react-icons/ai';


//modal
import ModalActionDetail from './ModalPesananDetail/ModalActionDetail';
import ModalPesananProses from './ModalPesananDetail/ModalPesananProses';
import ModalDownPayment from './ModalPesananDetail/ModalDownPayment';
import ModalOngkir from './ModalPesananDetail/ModalOngkir.';
import AlertDeletePesanan from '../Modal/ModalDeletePesanan';
import ModalEditPesananMasuk from '../Modal/ModalPesananMasuk/ModalEditPesanan';
import ModalAddImage from './ModalPesananDetail/ModalAddImage'
import ModalRemoveImage from './ModalPesananDetail/ModalRemoveImage'


export default function PesananDetail() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState([]);
    const [designs, setDesigns] = useState([]);
    const [models, setModels] = useState([]);
    const [displayAction, setDisplayAction] = useState(true);
    
 
    const { actionDetailOrder, refreshDetailPesanan } = useSelector(state => state.pesananDetail);
    
    const url = useLocation();
    const pathname = url.pathname.includes("pesananproses_detail")
    const { id } = useParams();   
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getDataInit = async () => {
        setDisplayAction(false)
        try {
            const res = await API.getOrderDetail(id);
            setData(res.data);
            setDesigns(res.data.designs);
            setModels(res.data.model_orders);
            dispatch(setDataDetailOrder(res.data));
            dispatch(setAllDesignItems(res.data.designs));
            dispatch(setAllModelItems(res.data.model_orders));
        } catch (err) {
            console.error(err);
        }
        setDisplayAction(true)
        setIsLoading(true);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        getDataInit();
    }, []);

    useEffect(() => {
        getDataInit();
    }, [refreshDetailPesanan]);

    const totalHarga = (data.quantity * data.pricePerItem)


    //convert datetime to indonesia format-----
    const datetimeString = data.created_at;
    // Create a new date object from the datetime string
    const datetime = new Date(datetimeString);
    // Convert the date to Indonesian date and time format
    const optiondatetime = {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const indonesiaDateTimeString = datetime.toLocaleString('id-ID', optiondatetime);

    const ActionUpdate = () => (e) => {
        e.preventDefault();
        dispatch(setActionDetailOrder('edit'));
        dispatch(setRefreshDetailPesanan())
        onOpen()
    }

    const handleAction = () => (e) => {
        e.preventDefault();
        dispatch(setActionDetailOrder('2action'));
        onOpen()
    }

    const handleAddImage = (type) => (e) => {
        e.preventDefault();
        dispatch(setActionDetailOrder('addImage'));
        dispatch(setTypeDetailItem(type));
        onOpen();
    };

    const handleDeleteImage = (id, type) => (e) => {
        e.preventDefault();
        dispatch(setActionDetailOrder('removeImage'));
        dispatch(setIdRemoveImage(id));
        dispatch(setRefreshModalRemoveImage());
        dispatch(setTypeDetailItem(type));
        onOpen()
    };

    const Progres = ({progres, quantity}) => {
        return (
            <Text fontSize={{ base: 'md', md: 'lg' }}>{`${Math.floor((progres / quantity) * 100)}% / ${progres} picies`}</Text>
        )
    }

    return (
        <Box px={{ base: 0, lg:5 }}>
            <Flex mt={{ base: 5, lg:10 }} pt={5} w='full' minH={'80vh'} flexDirection='column'  align='center' bgColor={'white'} >
                <Flex w={{ base: 'full', lg: '90%' }} justifyContent='space-between' px={{ base: 0, lg:5 }} align='center'>
                    <Button onClick={() => navigate(-1)} fontWeight='bold' variant="no-effects" gap='2'><FaArrowLeft /> <Text display={{ base: 'none', md: 'block' }}>Kembali</Text></Button>
                    {data.status === 'masuk' && <Text fontWeight='bold'>Detail pesanan masuk</Text>}
                    {data.status === 'proses' && <Text fontWeight='bold'>Detail pesanan proses</Text>}
                    <Box>
                        {!displayAction ? null : <Button fontWeight='bold' fontSize='md' variant="no-effects" color='blue.500' gap='1' onClick={handleAction()}>Action</Button>}
                        {actionDetailOrder === '2action' && <ModalActionDetail isOpen={isOpen} onOpen={onOpen} onClose={onClose} status={data.status} />}
                        {actionDetailOrder === 'proses' &&
                            (
                                data.status === 'masuk' ? <ModalPesananProses isOpen={isOpen} onOpen={onOpen} onClose={onClose} totalHarga={totalHarga} id={data.id} status={data.status} /> :
                                    <ModalPesananProses isOpen={isOpen} onOpen={onOpen} onClose={onClose} totalHarga={totalHarga} DP={data.payment} id={data.id} status={data.status} />
                            )
                        }
                        {data.status === 'proses' && actionDetailOrder === 'ongkir' ?  <ModalOngkir isOpen={isOpen} onOpen={onOpen} onClose={onClose} id={data.id} status={data.status} shippingCost={data.shippingCost}/> : null}
                        {data.status === 'proses' && actionDetailOrder === 'lihatDP' ?  <ModalDownPayment isOpen={isOpen} onOpen={onOpen} onClose={onClose} totalHarga={totalHarga} DP={data.payment} id={data.id} status={data.status}/> : null}
                        {actionDetailOrder === 'delete' && <AlertDeletePesanan id={data.id} isOpen={isOpen} onClose={onClose} statusOrder={data.status} />}
                    </Box>
                </Flex>
                {isLoading ?
                    <Flex flexDirection='column' px='5' py="8" bgColor='white' borderRadius={'md'} w={{ base: 'full', lg: '90%' }}>
                        <Tabs align='center'>
                            <TabList gap='2'>
                                <Tab fontWeight='bold' gap='1'><MdDescription /> Data</Tab>
                                <Tab fontWeight='bold' gap='1'><MdPhoto /> Design</Tab>
                                <Tab fontWeight='bold' gap='1'><FaCube /> Model</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel align='start'>
                                    <Flex>
                                        <Flex w='96%' flexDirection='column' justifyContent='start' align='start'>
                                            <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Nama</Text>
                                                <Text fontSize={{ base: 'md', md: 'lg' }}>{data.name}</Text>
                                            </Flex>
                                            <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Nomer HP</Text>
                                                <Text fontSize={{ base: 'md', md: 'lg' }}>{data.phone}</Text>
                                            </Flex>
                                            <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Email</Text>
                                                <Text fontSize={{ base: 'md', md: 'lg' }}>{!data.email ? 'Tidak ada' : `${data.email}`}</Text>
                                            </Flex>
                                            <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Alamat</Text>
                                                <Text fontSize={{ base: 'md', md: 'lg' }}>{data.address}</Text>
                                            </Flex>
                                            <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Description</Text>
                                                {!data.description ? <Text fontSize={{ base: 'md', md: 'lg' }}>deskripsi pesanan belum dibuat</Text> : <Text fontSize={{ base: 'md', md: 'lg' }}>{data.description}</Text>}
                                            </Flex>
                                            {data.status === 'proses' &&
                                                <Flex w='full' flexDirection='column' mb='5'>
                                                    <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Progres</Text>
                                                    <Progres progres={data.progres || 0} quantity={data.quantity}  />
                                                </Flex>
                                            }
                                            <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Jumlah</Text>
                                                {data.quantity == null || data.quantity < 1 ? <Text fontSize={{ base: 'md', md: 'lg' }}>jumlah belum ditetapkan</Text> : <Text fontSize={{ base: 'md', md: 'lg' }}>{`${data.quantity} pieces`}</Text>}
                                            </Flex>
                                            <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Ukuran</Text>
                                                {!data.size ? <Text fontSize={{ base: 'md', md: 'lg' }}>ukuran belum ditetapkan</Text> : <Text fontSize={{ base: 'md', md: 'lg' }}>{data.size}</Text>}
                                            </Flex>
                                            <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Deadline</Text>
                                                {!data.deadline ? <Text fontSize={{ base: 'md', md: 'lg' }}>deadline belum ditetapkan</Text> : <Text fontSize={{ base: 'md', md: 'lg' }}>{convertToIndonesianDate(data.deadline)}</Text>}
                                            </Flex>
                                            <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Harga peritem</Text>
                                                {data.pricePerItem == null || data.pricePerItem < 1 ? <Text fontSize={{ base: 'md', md: 'lg' }}>harga belum ditetapkan</Text> : <Text fontSize={{ base: 'md', md: 'lg' }}>{formatMoneyIDR(data.pricePerItem)}</Text>}
                                            </Flex>
                                            <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Total Harga</Text>
                                                {totalHarga == null || totalHarga < 1 ? <Text fontSize={{ base: 'md', md: 'lg' }}>tentukan jumlah dan harga peritem dahulu</Text> : <Text fontSize={{ base: 'md', md: 'lg' }}>{formatMoneyIDR(totalHarga)}</Text>}
                                            </Flex>
                                            {data.status === 'proses' &&
                                                <Flex w='full' flexDirection='column' mb='5'>
                                                    <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Uang muka</Text>
                                                    {data.payment == null || data.payment < 1 ? <Text fontSize={{ base: 'md', md: 'lg' }}>tentukan jumlah dan harga peritem dahulu</Text> : <Text fontSize={{ base: 'md', md: 'lg' }}>{formatMoneyIDR(data.payment)}</Text>}
                                                </Flex>
                                            }
                                            {data.status === 'masuk' &&  <Flex w='full' flexDirection='column' mb='5'>
                                                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Di input pada</Text>
                                                <Text fontSize={{ base: 'md', md: 'lg' }}>{indonesiaDateTimeString}</Text>
                                            </Flex>
                                            }
                                        </Flex>
                                        <Flex>
                                            <Button fontWeight='bold' variant="no-effects" color={{ base: 'black', md: 'blue.500' }} gap='1' onClick={ActionUpdate(id)}>
                                                <Icon as={FaPencilAlt} display={{ base: 'block', md: 'none' }} />
                                                <Text display={{ base: 'none', md: 'block' }}>Edit</Text>
                                            </Button>
                                        </Flex>
                                    </Flex>
                                    {actionDetailOrder === 'edit' && (<ModalEditPesananMasuk onClose={onClose} isOpen={isOpen} />)}
                                </TabPanel>
                                <TabPanel>
                                    <Flex mb='5' w='full' align='center' justifyContent='space-between' flexDirection={{ base: 'column', md: 'row' }} gap={{ base: '3', md: '0' }}>
                                        <Text fontWeight='bold' display={{ base: 'none', md: 'block' }}>koleksi desain pesanan</Text>
                                        <Button
                                            color='blue.500'
                                            bg='transparent'
                                            fontWeight='bold'
                                            variant="no-effects"
                                            w='120px'
                                            onClick={handleAddImage('design')}
                                        >
                                            + Desain Baru
                                        </Button>
                                    </Flex>
                                    <SimpleGrid w='full' columns={3} gap={1} justify='center'>
                                        {designs.map((design, i) =>
                                            <Image
                                                key={i}
                                                w='full'
                                                h='auto'
                                                objectFit='contain'
                                                src={design.design}
                                                alt="design"
                                                _hover={{ filter: 'auto', brightness: '40%' }}
                                                cursor='pointer'
                                                onClick={handleDeleteImage(design.id, design.type)}
                                            />
                                        )}
                                    </SimpleGrid>
                                </TabPanel>
                                <TabPanel>
                                    <Flex mb='5' w='full' align='center' justifyContent='space-between' flexDirection={{ base: 'column', md: 'row' }} gap={{ base: '3', md: '0' }}>
                                        <Text fontWeight='bold' display={{ base: 'none', md: 'block' }}>koleksi model pesanan</Text>
                                        <Button
                                            color='blue.500'
                                            bg='transparent'
                                            fontWeight='bold'
                                            variant="no-effects"
                                            w='120px'
                                            onClick={handleAddImage('model')}
                                        >
                                            + Model Baru
                                        </Button>
                                    </Flex>
                                    <SimpleGrid w='full' columns={3} gap={1} justify='center'>
                                        {models.map((model, i) =>
                                            <Image
                                                key={i}
                                                w='full'
                                                h='auto'
                                                objectFit='contain'
                                                src={model.model}
                                                alt="design"
                                                _hover={{ filter: 'auto', brightness: '40%' }}
                                                cursor='pointer'
                                                onClick={handleDeleteImage(model.id, model.type)}
                                            />
                                        )}

                                    </SimpleGrid>
                                </TabPanel>
                            </TabPanels>
                            {actionDetailOrder === 'addImage' && (<ModalAddImage isOpen={isOpen} onClose={onClose} />)}
                            {actionDetailOrder === 'removeImage' && (<ModalRemoveImage isOpen={isOpen} onClose={onClose} />)}
                        </Tabs>
                    </Flex>
                    :
                    <Flex justifyContent='center' h='xl' align='center'>
                        <Spinner />
                    </Flex>
                }

            </Flex>
        </ Box>
    )
}
