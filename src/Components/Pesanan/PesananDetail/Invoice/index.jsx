import React, { useRef } from 'react';
import { Box, Text, Table, Tbody, Tr, Td, Flex, Button } from '@chakra-ui/react';
import {
    ListItem,
    UnorderedList,
} from '@chakra-ui/react'
import ReactToPrint from 'react-to-print';
import { useSelector } from 'react-redux';
import { formatToIDR } from '../../../../validation/format';

export default function Invoice() {
    const componentRef = useRef();

    const { dataDetailOrder } = useSelector(state => state.pesananDetail);

    return (
        <>
            <ReactToPrint
                trigger={() => {
                    return (
                        <Button
                            y='6'
                            borderRadius="0"
                            borderBottom={'1px'}
                            fontWeight='bold'
                            variant="no-effects"
                        >
                            {dataDetailOrder.status === 'masuk' ? 'Invoice uang muka' : 'Invoice pelunasan'}
                        </Button>
                    )
                }}
                content={() => componentRef.current}
                documentTitle={`invoice_${dataDetailOrder.name}`}
                pageStyle='print'
            />
            <div style={{ display: "none" }}>
                <Box ref={componentRef} w={'full'} p={10} mb={10} className='page-break' fontFamily="Roboto">
                    <Flex justifyContent={'space-between'}>
                        <Box mb={6} mt={2} pr={5}>
                            <Text mb={2}>{dataDetailOrder.company.name}</Text>
                            <Text mb={2}>{dataDetailOrder.company.address}</Text>
                            <Text mb={2}>{dataDetailOrder.company.phone}</Text>
                        </Box>
                        <Text color={'red.500'} fontWeight={'extrabold'} fontSize={'3xl'}>INVOICE</Text>
                    </Flex>

                    <Box mb={6}>
                        <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Data pemesan
                        </Text>
                        <Text mb={2}>Nama : {dataDetailOrder.name}</Text>
                        <Text mb={2}>Alamat : {dataDetailOrder.address}</Text>
                        <Text mb={2}>No Hp : {dataDetailOrder.phone}</Text>
                    </Box>

                    <Box mb={6}>
                        <Text fontSize="xl" fontWeight="bold" mb={2}>
                            Detail pesanan
                        </Text>
                        <Table variant='striped' colorScheme='greey.800'>
                            <Tbody>
                                {dataDetailOrder.status === 'proses' ?
                                    <Tr>
                                        <Td w={'25%'}>Kode pesanan</Td>
                                        <Td w={'5%'}>:</Td>
                                        <Td>{dataDetailOrder.id}</Td>
                                    </Tr> : null}
                                <Tr>
                                    <Td w={'25%'}>Deskripsi</Td>
                                    <Td w={'5%'}>:</Td>
                                    <Td>{dataDetailOrder.description}</Td>
                                </Tr>
                                <Tr>
                                    <Td>Jumlah</Td>
                                    <Td>:</Td>
                                    <Td>{dataDetailOrder.quantity}</Td>
                                </Tr>
                                <Tr>
                                    <Td>Harga peritem</Td>
                                    <Td>:</Td>
                                    <Td>{formatToIDR(dataDetailOrder.pricePerItem)}</Td>
                                </Tr>
                                {dataDetailOrder.status === 'proses' ? (
                                    <>
                                        <Tr>
                                            <Td>Ongkos kirim</Td>
                                            <Td>:</Td>
                                            <Td>{formatToIDR(parseInt(dataDetailOrder.shippingCost))}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Total Biaya</Td>
                                            <Td>:</Td>
                                            <Td>{formatToIDR(parseInt(dataDetailOrder.shippingCost) + (dataDetailOrder.quantity * dataDetailOrder.pricePerItem))}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Uang muka</Td>
                                            <Td>:</Td>
                                            <Td>{formatToIDR(dataDetailOrder.payment)}</Td>
                                        </Tr>
                                    </>
                                ) : null}
                            </Tbody>
                        </Table>
                    </Box>

                    <Flex mt={6} justifyContent={'space-between'}>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                {dataDetailOrder.status === 'masuk' ? 'Total' : 'Biaya pelunasan'}
                            </Text>
                            <Text mb={2}>{
                                dataDetailOrder.status === 'masuk' ?
                                    formatToIDR(dataDetailOrder.pricePerItem * dataDetailOrder.quantity) :
                                    formatToIDR(parseInt(dataDetailOrder.shippingCost) + parseInt((dataDetailOrder.quantity * dataDetailOrder.pricePerItem)) - parseInt(dataDetailOrder.payment))}
                            </Text>
                        </Box>
                        <Flex flexDir={'column'}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                Pembayaran
                            </Text>
                            {dataDetailOrder.company.bank_accounts.map((value, index)=> (
                                <Text key={index} mb={2}>{`${value.bank_name} : ${value.number}`}</Text>
                            ))}
                        </Flex>
                    </Flex>
                    {dataDetailOrder.status === 'masuk' ?
                        <Box mt={6}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                Catatan
                            </Text>
                            <UnorderedList>
                                <ListItem>Minimal pembayaran uang muka setengah dari total biaya</ListItem>
                                {dataDetailOrder.status === 'masuk' ? <ListItem>Total biaya belum termasuk ongkos kirim</ListItem> : null}
                            </UnorderedList>
                        </Box> : null}
                </Box>
            </div>
        </>
    )
}
