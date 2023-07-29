import React, { useState, useEffect } from 'react'
import {
    Box,
    Flex,
    Text,
    Input,
    Select,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    useToast,
    useColorModeValue
} from '@chakra-ui/react'
import {
    useTable,
    usePagination,
    useGlobalFilter
} from "react-table";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    formatToIDR,
    getThisMonth,
    getDateToday,
} from '../validation/format';
import { generatePDFLaporan } from '../Features/Utils';
import Loading from '../Components/Loading';
import API from '../Service';



export default function Data() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [company, setCompany] = useState([])
    const [selectReportData, setSelectReportData] = useState({select:'month', toggleInput: false})
    const [isDisabled, setIsDisabled] = useState(true)
    let [pendapatan, setPendapatan] = useState(0)

    const toast = useToast();
    const {
        setValue,
        watch,
    } = useForm(
        {
            defaultValues: {
                paramMonth: '',
                startDate: '',
                endDate: ''
            },
        }
    );
    const paramMonth = watch('paramMonth')
    const startDate = watch('startDate')
    const endDate = watch('endDate')

    const getDataInit = async (data) => {
        setLoading(true)
        setData([]);
        try {
            const res = await API.getOrderPerMonth(data);
            setValue('paramMonth', getThisMonth())
            setData(res.data.orderPerMonth);
            setCompany(res.data.company);
        } catch (err) {
            toast({
                title: "Get data order report failed",
                description: "Something went wrong...",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        }
        setLoading(false)
    };

    const handleOnChangeInputPerMonth = async (param) => {
        try {
            const res = await API.getOrderPerMonth({ 'date': param });
            if(res.data){
                setValue('paramMonth', param)
                setValue('startDate', '')
                setValue('endDate', '')
                setIsDisabled(true)
                setData(res.data.orderPerMonth);
                setCompany(res.data.company);
            }
        } catch (err) {
            toast({
                title: "Get data order report failed",
                description: "Something went wrong...",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        }
    }

    const handleOnChangeInputEndDate = async (param) => {
        try {
            const res = await API.getOrderReportPerDay(startDate, param);
            console.log(res.data);
            if(res.data){
                setValue('endDate', param)
                setValue('paramMonth', '')
                setData(res.data);
            }
        } catch (err) {
            toast({
                title: "Get data order report failed",
                description: "Something went wrong...",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        setValue('startDate', '')
        setValue('endDate', '')
        setData([])
        pendapatan = 0
        getDataInit({ 'date': getThisMonth() })
    }, []);

    useEffect(() => {
        let totalPendapatan = 0;
        if (data.length !== 0) {
            data.forEach(element => {
                totalPendapatan += parseInt(element.payment, 10);
            });
        }
        setPendapatan(totalPendapatan);
    }, [data]);

    const handlePrintPDF = () => {
        generatePDFLaporan({data, company, pendapatan, paramMonth, startDate, endDate})
    }

    const handleSelectReportData = (e) => {
        if (e.target.value === 'Day') {
            setSelectReportData({select:'Day', toggleInput: true})
        } else {
            setSelectReportData({select:'Month', toggleInput: false})
        }
    }

    const columns = useMemo(
        () => [
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
                Header: 'jumlah',
                accessor: 'quantity',
            },
            {
                Header: 'harga peritem',
                accessor: 'pricePerItem',
                Cell: ({ row }) => (
                    <Text>{formatToIDR(row.original.pricePerItem)}</Text>
                )
            },
            {
                Header: 'pendapatan',
                accessor: 'pembayaran',
                Cell: ({ row }) => (
                    <Text>{formatToIDR(row.original.payment)}</Text>
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
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        state,
    } = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        usePagination
    );

    const { pageIndex } = state;

    return (
        <>
            {loading && <Loading />}
            <Box py={{ base: 0, lg: 5 }} minH={{ base: '90vh', lg: 'min-content' }}>
                <Box
                    borderRadius='lg'
                    bg={useColorModeValue('white', '#1E2023')}
                    w='full'
                    minH={{ base: '100vh', lg: 'fit-content' }}
                    p={5}
                    mt={{ base: 0, lg: 5 }}>
                    <TableContainer
                        py="8"
                        bg={useColorModeValue('white', '#1E2023')}
                        borderRadius={'md'}
                        overflowX='auto'>
                        <Text pl='5' fontWeight='bold' fontSize='lg'>Laporan Pesanan</Text>
                        <Flex w='full' justifyContent='space-between' direction={{ base: 'column', md: 'row' }} gap='3' p={5}>
                            <Button
                                colorScheme='green'
                                color='white'
                                onClick={handlePrintPDF}
                            >
                                cetak
                            </Button>
                            <Flex gap={2}>
                                <Select
                                    minW={'85px'}
                                    maxW={'95px'}
                                    value={selectReportData.select}
                                    onChange={(e) => {
                                        handleSelectReportData(e);
                                    }}
                                >
                                    <option value='Month'>Bulan</option>
                                    <option value='Day'>Hari</option>
                                </Select>
                                {selectReportData.toggleInput ?
                                    <Flex gap={1} align={'center'}>
                                        <Input
                                            type="date"
                                            id="myDate"
                                            name="inputDateStart"
                                            min="2022-02-01"
                                            value={startDate}
                                            max={getDateToday()}
                                            onChange={(e) => {
                                                setValue('startDate', e.target.value)
                                                setValue('endDate', '')
                                                setIsDisabled(false)
                                            }} 
                                        />
                                        <Text>-</Text>
                                        <Input
                                            type="date"
                                            id="myDate"
                                            name="inputDateEnd"
                                            value={endDate}
                                            min={startDate}
                                            max={getDateToday()}
                                            isDisabled={isDisabled}
                                            onChange={(e) => {
                                                handleOnChangeInputEndDate(e.target.value)
                                            }}
                                        />
                                    </Flex>
                                    :
                                    <Input
                                        type="month"
                                        id="date"
                                        name="paramMonth"
                                        value={paramMonth}
                                        onChange={(e) => handleOnChangeInputPerMonth(e.target.value)}
                                        max={getThisMonth()}
                                        focusBorderColor='#00AA5D'
                                    />
                                }

                            </Flex>
                        </Flex>
                        <Table
                            variant='simple'
                            size='md'
                            {...getTableProps()}>
                            <Thead bg='blackAlpha.900' >
                                {headerGroups.map((headerGroup) => (
                                    <Tr {...headerGroup.getHeaderGroupProps()} >
                                        {headerGroup.headers.map((column, index) => (
                                            <Th
                                                {...column.getHeaderProps()}
                                                color='white'
                                                textAlign='center'
                                                borderLeftRadius={index === 0 ? 'lg' : 0}
                                                borderRightRadius={index === headerGroup.headers.length - 1 ? 'lg' : 0}
                                            >
                                                {column.render("Header")}
                                            </Th>
                                        ))}
                                    </Tr>
                                ))}
                            </Thead>

                            <Tbody {...getTableBodyProps()}>
                                {page.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <Tr key={i} {...row.getRowProps()}>
                                            {row.cells.map((cell, i) => {
                                                return <Td textAlign='center' key={i} {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
                                            })}
                                        </Tr>
                                    );
                                })}
                                {data.length !== 0 &&
                                    <Tr>
                                        <Td textAlign='center'>
                                            <Text fontWeight='bold'>Total: {data.length}</Text>
                                        </Td>
                                        {[...new Array(4)]
                                            .map(
                                                (index) =>
                                                    <Td key={index}></Td>
                                            )}
                                        <Td textAlign='center'>
                                            <Text fontWeight='bold'>{`${formatToIDR(pendapatan)}`}</Text>
                                        </Td>
                                    </Tr>
                                }
                            </Tbody>
                        </Table>
                        {data.length !== 0 &&
                            <>
                                <Flex
                                    px='7'
                                    py='5'
                                    justifyContent='space-between'>
                                </Flex>
                                <Box pl='7'>
                                    <Button
                                        onClick={() => previousPage()}
                                        disabled={!canPreviousPage}>
                                        <FaAngleLeft />
                                    </Button>
                                    <span>
                                        {' '}Page{' '}
                                        <strong>
                                            {pageIndex + 1} of {pageOptions.length}
                                        </strong>{' '}
                                    </span>
                                    <Button
                                        onClick={() => nextPage()}
                                        disabled={!canNextPage}>
                                        <FaAngleRight />
                                    </Button>
                                </Box>
                            </>
                        }
                        {data.length < 1 &&
                            <Text
                                textAlign={'center'}
                                fontWeight={'bold'}
                                fontSize={{ base: 'xl', md: '3xl' }}
                                mt={20}>
                                data pesanan kosong
                            </Text>
                        }
                    </TableContainer>
                </Box>
            </Box>
        </>
    )
}
