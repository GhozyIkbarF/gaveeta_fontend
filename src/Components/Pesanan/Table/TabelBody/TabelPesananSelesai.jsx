import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { Box, Text, Flex, Button, Input } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Select, useColorModeValue } from '@chakra-ui/react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import API from '../../../../Service';
import RowDesign from '../Row/RowDesign';
import ActionOrder from '../Row/ActionOrder';

//modal
import Loading from '../../../Loading';


export default function TabelPesananSelesai() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    const getDataInit = async () => {
        setLoading(true)
        try {
            const res = await API.getAllOrderSelesai();
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false)
    };

    useEffect(() => {
        getDataInit();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: 'kode',
                accessor: 'id',
            },
            {
                Header: 'Nama',
                accessor: 'name',
            },
            {
                Header: 'No Hp',
                accessor: 'phone',
            },
            {
                Header: 'deskripsi',
                accessor: 'description',
            },
            {
                Header: 'tgl selesai',
                accessor: 'endDate',
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
            minH={{ base:'100vh', lg:'fit-content' }}
            bg={{ base:'white', lg:'transparent' }}
            mt={{ base:0, lg:5 }} 
            mb={{ base:0, lg:10 }} 
            pt={{ base:0, lg:5 }}>
            <TableContainer px='5' py="8" bg={useColorModeValue('white', '#1E2023')} shadow={'lg'} borderRadius={'md'} overflowX='auto'>
                <Text pl='5' fontWeight='bold' fontSize='lg'>Total Pesanan Selesai: {data.length}</Text>
                <Flex justifyContent={'space-between'} align={'center'}>
                    <Flex w='auto' p='5'>
                        <Select
                            borderEndRadius='none'
                            w="auto"
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
                    <Thead bg='blackAlpha.900' >
                        {headerGroups.map((headerGroup) => (
                            <Tr {...headerGroup.getHeaderGroupProps()} >
                                {headerGroup.headers.map((column, index) => (
                                    <Th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        color='white'
                                        textAlign='center'
                                        borderLeftRadius={ index === 0 ? 'lg': 0}
                                        borderRightRadius={ index === headerGroup.headers.length - 1 ? 'lg' : 0}
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
                                                {...cell.getCellProps()}
                                                textAlign='center'
                                                w={ index !== 0 ? 'auto' : '20%' } 
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
                {/* {actionOrderSelesai=== 'design' && (<ModalDesign onClose={onClose} isOpen={isOpen} />)} */}
            </TableContainer>
        </Box>
        </>
    )
}




