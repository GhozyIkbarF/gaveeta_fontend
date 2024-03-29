import React, { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Text, Flex, Button, Input, useColorModeValue } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Select } from '@chakra-ui/react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import { useDisclosure } from '@chakra-ui/react'
import API from '../../../../Service';
import { actionPesananMasuk, setDataOrder } from '../../../../Features/Pesanan/PesananMasuk';
import ActionOrder from '../Row/ActionOrder';
import RowDesign from '../Row/RowDesign';
import ModalAddPesananMasuk from '../../Modal/ModalPesananMasuk/ModalAddPesanan';
import AlertDeletePesananMasuk from '../../Modal/ModalDeletePesanan';
import ModalDesign from '../../Modal/ModalPesananProses/ModalDesign';
import Loading from '../../../Loading';
import { actionPesananProses } from '../../../../Features/Pesanan/PesananProses';


export default function TabelPesananMasuk() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    const { pathname } = useLocation();

    const { actionOrderMasuk, refreshOrderMasuk } = useSelector(state => state.pesananMasuk);
    const { actionOrderProses } = useSelector(state => state.pesananProses);

    const dispatch = useDispatch();

    const getDataInit = async () => {
        setLoading(true)
        const res = await API.getAllOrderMasuk();
        setData(res.data);
        dispatch(setDataOrder(res.data));
        setLoading(false)
    };

    useEffect(() => {
        getDataInit();
    }, []);

    useEffect(() => {
        getDataInit();
    }, [refreshOrderMasuk]);

    const handleAddPesananMasuk = (action) => (e) => {
        e.preventDefault();
        dispatch(actionPesananProses(action))
        dispatch(actionPesananMasuk(action))
        onOpen()
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Nama',
                accessor: 'name',
            },
            {
                Header: 'No HP',
                accessor: 'phone',
            },
            {
                Header: 'deskripsi',
                accessor: 'description',
            },
            {
                Header: 'desain',
                Cell: ({ cell: { row } }) => (
                    <RowDesign link={row.original.designs} onOpen={onOpen} id={row.original.id} />
                )
            },
            {
                Header: 'Aksi',
                Cell: ({ row }) => (
                    <ActionOrder id={row.original.id} onOpen={onOpen} />
                )
            },

        ],
        []
    );


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        state,
        setGlobalFilter,
        setPageSize
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const { globalFilter, pageIndex, pageSize } = state;


    return (
        <>
        {loading && <Loading/>}
        <Box 
            mt={{ base:0, lg:5 }} 
            mb={{ base:0, lg:10 }} 
            pt={{ base:0, lg:5 }}
            minH={{ base:'100vh', lg:'fit-content' }}
            bg={{ base:'white', lg:'transparent' }}
        >
            <TableContainer overflowX='auto' px='5' py="8" bg={useColorModeValue('white', '#1E2023')} shadow={'lg'} borderRadius={'md'} >
                <Text pl='5' fontWeight='bold' fontSize='lg'>Total Pesanan Masuk: {data.length}</Text>
                <Flex w='full' justifyContent='space-between' direction={{ base: 'column', md: 'row' }} gap='3' p='5'>
                    <Button
                        colorScheme='green'
                        onClick={handleAddPesananMasuk('create')}
                    >
                        + Pesanan 
                    </Button>
                    <Flex>
                        <Select
                            borderEndRadius='none'
                            w="25%"
                            value={pageSize}
                            onChange={e => {
                                setPageSize(Number(e.target.value))
                            }}
                        >
                            {[5, 10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                     {pageSize}
                                </option>
                            ))}
                        </Select>
                        <Input
                            borderLeftRadius='none'
                            placeholder='search...'
                            size='md'
                            width='auto'
                            value={globalFilter || ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </Flex>
                </Flex>
                <Table variant='simple' size='md' {...getTableProps()}>
                    <Thead bg={'blackAlpha.900'}>
                        {headerGroups.map((headerGroup) => (
                            <Tr {...headerGroup.getHeaderGroupProps()} >
                                {headerGroup.headers.map((column, index) => (
                                    <Th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        color='white'
                                        textAlign='center'
                                        borderLeftRadius={index === 0 ? 'lg' : 0}
                                        borderRightRadius={index === headerGroup.headers.length - 1 ? 'lg' : 0}
                                    >
                                        {column.render("Header")}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <Tr {...row.getRowProps()}>
                                    {row.cells.map((cell, index) => {
                                        return (
                                            <Td
                                                key={index}
                                                {...cell.getCellProps()}
                                                textAlign='center'
                                                w={index !== 0 ? 'auto' : '20%'}
                                            >
                                                {cell.render('Cell')}
                                            </Td>
                                        )
                                    })}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
                <Flex my='3' px='7' justify='space-between' gap='2' alignItems='center' w='full'>
                    <Box>
                        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                            <FaAngleLeft />
                        </Button>
                        <span>
                            {' '}Page{' '}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>{' '}
                        </span>
                        <Button onClick={() => nextPage()} disabled={!canNextPage}>
                            <FaAngleRight />
                        </Button>
                    </Box>
                    <Box>
                        <span>
                            Go to page:{' '}
                            <Input
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                                    gotoPage(page)
                                }}
                                style={{ width: '100px' }}
                            />
                        </span>
                    </Box>
                </Flex>
                {actionOrderMasuk === 'create' && (<ModalAddPesananMasuk isOpen={isOpen} onClose={onClose} />)}
                {actionOrderMasuk === 'delete' && <AlertDeletePesananMasuk onClose={onClose} isOpen={isOpen} />}
                {actionOrderProses === 'design' && pathname === '/pesananmasuk' ? <ModalDesign onClose={onClose} isOpen={isOpen} /> : null}
            </TableContainer>
        </Box>
        </>
    )
}




