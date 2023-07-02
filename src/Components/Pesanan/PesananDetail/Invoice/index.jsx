import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, Flex, Button } from '@chakra-ui/react';
import ReactToPrint from 'react-to-print';
import API from '../../../../Service';
import Loading from '../../../Loading';

export default function Invoice() {
    const componentRef = useRef();
    const [orderer, setOrderer] = useState([]);
    const [company, setCompany] = useState([]);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    
    const getDataInit = async () => {
        setLoading(true)
        try {
            const res = await API.getOrderDetail(id);
            setOrderer(res.data);
            setCompany(res.data.company);
            console.log(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false)
    };
    useEffect(() => {
        getDataInit();
    }, [])


    return (
        <>
            {loading && <Loading />}
            <Flex flexDir={'column'} justifyContent={'center'} bgColor={'white'} minH={'95vh'} mt={{ base:0, lg:5 }} justify={'center'} p={10}>
                <ReactToPrint
                    trigger={() => {
                        return <Button colorScheme='blue' w={'28'} mb={5}>print invoce</Button>
                    }}
                    content={() => componentRef.current}
                    documentTitle='invoice'
                    pageStyle='print'
                />
                <div style={{ display: "none" }}>
                    <Box ref={componentRef} border={'1px'} w={'full'} p={10} mb={10} className='page-break'>
                        <Flex justifyContent={'space-between'}>
                            <Box mb={6} mt={2}>
                                <Text fontSize="xl" fontWeight="bold" mb={2}>
                                    Company Details
                                </Text>
                                <Text mb={2}>{company.name}</Text>
                                <Text mb={2}>{company.address}</Text>
                                <Text mb={2}>+{company.phone}</Text>
                            </Box>
                            <Text color={'red.500'} fontWeight={'extrabold'} fontSize={'3xl'}>INVOICE</Text>
                        </Flex>

                        <Box mb={6}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                Orderer Details
                            </Text>
                            <Text mb={2}>{orderer.name}</Text>
                            <Text mb={2}>{orderer.address}</Text>
                            <Text mb={2}>{orderer.phone}</Text>
                        </Box>

                        <Box mb={6}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                Item Details
                            </Text>
                            <Table variant='striped' colorScheme='greey.800'>
                                <Tbody>
                                    <Tr>
                                        <Td>Deskripsi</Td>
                                        <Td>:</Td>
                                        <Td>{orderer.description}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Jumlah</Td>
                                        <Td>:</Td>
                                        <Td>{orderer.quantity}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Harga peritem</Td>
                                        <Td>:</Td>
                                        <Td>{orderer.pricePerItem}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </Box>

                        <Box mt={6}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                Total
                            </Text>
                            <Text mb={2}>Total: {orderer.pricePerItem*orderer.quantity}</Text>
                        </Box>
                    </Box>
                </div>
            </Flex>
            <div style={{ display: "none" }}>
                    <Box ref={componentRef} border={'1px'} w={'full'} p={10} mb={10} className='page-break'>
                        <Flex justifyContent={'space-between'}>
                            <Box mb={6} mt={2}>
                                <Text fontSize="xl" fontWeight="bold" mb={2}>
                                    Company Details
                                </Text>
                                <Text mb={2}>{company.name}</Text>
                                <Text mb={2}>{company.address}</Text>
                                <Text mb={2}>+{company.phone}</Text>
                            </Box>
                            <Text color={'red.500'} fontWeight={'extrabold'} fontSize={'3xl'}>INVOICE</Text>
                        </Flex>

                        <Box mb={6}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                Orderer Details
                            </Text>
                            <Text mb={2}>{orderer.name}</Text>
                            <Text mb={2}>{orderer.address}</Text>
                            <Text mb={2}>{orderer.phone}</Text>
                        </Box>

                        <Box mb={6}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                Item Details
                            </Text>
                            <Table variant='striped' colorScheme='greey.800'>
                                <Tbody>
                                    <Tr>
                                        <Td>Deskripsi</Td>
                                        <Td>:</Td>
                                        <Td>{orderer.description}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Jumlah</Td>
                                        <Td>:</Td>
                                        <Td>{orderer.quantity}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Harga peritem</Td>
                                        <Td>:</Td>
                                        <Td>{orderer.pricePerItem}</Td>
                                    </Tr>
                                    {/* Add more rows for other items */}
                                </Tbody>
                            </Table>
                        </Box>

                        <Box mt={6}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                Total
                            </Text>
                            <Text mb={2}>Total: {orderer.pricePerItem*orderer.quantity}</Text>
                        </Box>
                    </Box>
                </div>
        </>
    )
}
