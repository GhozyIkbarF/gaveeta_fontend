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
import { formatMoneyIDR, convertToIndonesianDate, indonesiaDateTime } from '../../../validation/format';


//cakra component
import { useDisclosure } from '@chakra-ui/react'
import { Box, Text, Flex, Image, SimpleGrid, Button, Icon, useColorModeValue } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react'

// icon
import { FaPencilAlt, FaArrowLeft } from "react-icons/fa";
import { FaEllipsisV } from 'react-icons/fa';


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

    const Data = ({ title, data }) => {
        return (
            <Flex w='full' flexDirection='column' mb='5'>
                <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>{title}</Text>
                <Text fontSize={{ base: 'md', md: 'lg' }}>{data}</Text>
            </Flex>
        )
    }

    const Progres = ({ progres, quantity }) => {
        return (
            <Text fontSize={{ base: 'md', md: 'lg' }}>{`${Math.floor((progres / quantity) * 100)}% / ${progres} picies`}</Text>
        )
    }

    return (
        <Box px={{ base: 0, lg: 5 }}>
            <Flex 
                mt={{ base: 0, lg: 10 }} 
                pt={5} w='full' 
                minH={{ base: '100vh', lg: 'fit-content' }} 
                flexDirection='column' 
                align='center' 
                bg={useColorModeValue('white', '#1E2023')} 
                borderRadius={{ base: 'none', lg: 'md' }}
            >
                <Flex 
                    w={{ base: 'full', lg: '90%' }} 
                    justifyContent='space-between' 
                    px={{ base: 0, lg: 5 }} 
                    align='center'
                >
                    <Button 
                        onClick={() => navigate(-1)} 
                        fontWeight='bold' 
                        variant="no-effects" 
                        gap='2'
                    >
                        <FaArrowLeft /> 
                    </Button>
                    <Text fontWeight='bold'>Detail Pesanan</Text>
                    <Box>
                        {!displayAction ? null : <Button fontWeight='bold' fontSize='md' transform={{ base: "rotate(0deg)", lg: "rotate(90deg)" }} variant="no-effects" gap='1' onClick={handleAction()}><FaEllipsisV /></Button>}
                        {actionDetailOrder === '2action' && <ModalActionDetail isOpen={isOpen} onOpen={onOpen} onClose={onClose} status={data.status} />}
                        {actionDetailOrder === 'proses' &&
                            (
                                data.status === 'masuk' ? <ModalPesananProses isOpen={isOpen} onOpen={onOpen} onClose={onClose} totalHarga={totalHarga} id={data.id} status={data.status} /> :
                                    <ModalPesananProses isOpen={isOpen} onOpen={onOpen} onClose={onClose} totalHarga={totalHarga} DP={data.payment} id={data.id} status={data.status} />
                            )
                        }
                        {data.status === 'proses' && actionDetailOrder === 'ongkir' ? <ModalOngkir isOpen={isOpen} onOpen={onOpen} onClose={onClose} id={data.id} status={data.status} shippingCost={data.shippingCost} /> : null}
                        {data.status === 'proses' && actionDetailOrder === 'lihatDP' ? <ModalDownPayment isOpen={isOpen} onOpen={onOpen} onClose={onClose} totalHarga={totalHarga} DP={data.payment} id={data.id} status={data.status} /> : null}
                        {actionDetailOrder === 'delete' && <AlertDeletePesanan id={data.id} isOpen={isOpen} onClose={onClose} statusOrder={data.status} />}
                    </Box>
                </Flex>
                {isLoading ?
                    <Flex flexDirection='column' px='5' py="8" borderRadius={'md'} w={{ base: 'full', lg: '90%' }}>
                        <Tabs align='center' colorScheme='green'>
                            <TabList gap='2'>
                                <Tab fontWeight='bold' gap='1'>Data</Tab>
                                <Tab fontWeight='bold' gap='1'>Desain</Tab>
                                <Tab fontWeight='bold' gap='1'>Model</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel align='start'>
                                    <Flex>
                                        <Flex w='96%' flexDirection='column' justifyContent='start' align='start'>
                                            <Data title={'Nama'} data={data.name}/>
                                            <Data title={'Nomer HP'} data={data.phone}/>
                                            <Data title={'Email'} data={!data.email ? 'Tidak ada' : `${data.email}`}/>
                                            <Data title={'Alamat'} data={data.address}/>
                                            <Data title={'Deskripsi'} data={!data.description ? 'deskripsi pesanan belum dibuat' : data.description}/>
                                            {data.status === 'proses' ?
                                                <Flex w='full' flexDirection='column' mb='5'>
                                                    <Text fontWeight='bold' fontSize={{ base: 'lg', md: 'xl' }}>Progres</Text>
                                                    <Progres progres={data.progres || 0} quantity={data.quantity} />
                                                </Flex> : null
                                            }
                                            <Data title={'Jumlah'} data={data.quantity == null || data.quantity < 1 ? 'jumlah belum ditetapkan' : `${data.quantity} pieces`}/>
                                            <Data title={'Ukuran'} data={!data.size ? 'ukuran belum ditetapkan' : data.size}/>
                                            <Data title={'Deadline'} data={!data.deadline ? 'deadline belum ditetapkan' : convertToIndonesianDate(data.deadline)}/>
                                            <Data title={'Harga peritem'} data={data.pricePerItem == null || data.pricePerItem < 1 ? 'harga belum ditetapkan' : formatMoneyIDR(data.pricePerItem)}/>
                                            <Data title={'Total Harga'} data={totalHarga == null || totalHarga < 1 ? 'tentukan jumlah dan harga peritem dahulu' : formatMoneyIDR(totalHarga)}/>
                                            {data.status === 'proses' ?
                                            <Data title={'Uang muka'} data={data.payment == null || data.payment < 1 ? 'tentukan jumlah dan harga peritem dahulu' : formatMoneyIDR(data.payment)}/>: null
                                            }
                                            {data.status === 'masuk' ?
                                                <Data title={'Di input pada'} data={indonesiaDateTime(data.created_at)}/> : null
                                            }
                                        </Flex>
                                        <Flex>
                                            <Button fontWeight='bold' variant="no-effects" color={{ base: 'black', md: 'green.500' }} gap='1' onClick={ActionUpdate(id)}>
                                                <Icon as={FaPencilAlt} display={{ base: 'block', md: 'none' }} />
                                                <Text display={{ base: 'none', md: 'block' }}>Ubah</Text>
                                            </Button>
                                        </Flex>
                                    </Flex>
                                    {actionDetailOrder === 'edit' && (<ModalEditPesananMasuk onClose={onClose} isOpen={isOpen} />)}
                                </TabPanel>
                                <TabPanel>
                                    <Flex
                                        mb='5'
                                        w='full'
                                        align='center'
                                        justifyContent='space-between'
                                        flexDirection={{ base: 'column', md: 'row' }}
                                        gap={{ base: '3', md: '0' }}
                                    >
                                        <Text
                                            fontWeight='bold'
                                            display={{ base: 'none', md: 'block' }}
                                        >
                                            koleksi desain pesanan
                                        </Text>
                                        <Button
                                            color='green.500'
                                            bg='transparent'
                                            fontWeight='bold'
                                            variant="no-effects"
                                            w='120px'
                                            onClick={handleAddImage('design')}
                                        >
                                            + Desain Baru
                                        </Button>
                                    </Flex>
                                    <SimpleGrid
                                        w='full'
                                        columns={3}
                                        gap={1}
                                        justify='center'
                                    >
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
                                    <Flex
                                        mb='5'
                                        w='full'
                                        align='center'
                                        justifyContent='space-between'
                                        flexDirection={{ base: 'column', md: 'row' }}
                                        gap={{ base: '3', md: '0' }}
                                    >
                                        <Text
                                            fontWeight='bold'
                                            display={{ base: 'none', md: 'block' }}
                                        >
                                            koleksi model pesanan
                                        </Text>
                                        <Button
                                            color='green.500'
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
