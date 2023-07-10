import React, { useState, useEffect } from 'react'
import {
    Box,
    Flex,
    Text,
    Input,
    FormLabel,
    InputGroup,
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
    formatMoneyIDR,
    formatToIDR,
    convertToIndonesianDate,
    getThisMonth
} from '../validation/format';
import Loading from '../Components/Loading';
import API from '../Service';
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import logoGaveeta from '../Assets/logo-gaveeta.png'

export default function Data() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [company, setCompany] = useState([])
    let [pendapatan, setPendapatan] = useState(0)

    console.log(data);
    const toast = useToast();
    const {
        handleSubmit,
        setValue,
        register,
        watch,
    } = useForm(
        {
            defaultValues: {
                date: ''
            },
        }
    );
    const valueDate = watch('date')
    const date = new Date()
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dateToday = `${year}-${month}`;

    //function get api
    const getDataInit = async (data) => {
        setLoading(true)
        setData([]);
        try {
            const res = await API.getOrderPerMonth(data);
            setData(res.data.orderPerMonth);
            setCompany(res.data.company);
        } catch (err) {
            toast({
                title: "Something went wrong",
                description: "Something went wrong...",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-right",
            });
            console.error(err);
        }
        setLoading(false)
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setData([])
        pendapatan = 0
        setValue('date', dateToday)
        getDataInit({ 'date': dateToday })
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

    const columns = useMemo(
        () => [
            {
                Header: 'Nama',
                accessor: 'name',
                Cell: ({ cell: { row } }) => (
                    <Flex
                        align="center"
                        minWidth="100%"
                        flexWrap="nowrap">
                        <Flex direction="column">
                            <Text
                                fontSize="md"
                                fontWeight="bold"
                                minWidth="100%"
                            >
                                {row.original.name}
                            </Text>
                        </Flex>
                    </Flex>
                ),
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

    const generatePDF = () => {

        // Create a new jsPDF instance
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        })

        doc.addImage(logoGaveeta, 'PNG', 27, 15, 28, 28);
        // Set font styles
        doc.setFont('times', 'bold');
        doc.setFontSize(36);

        // Add institution name
        doc.text(company.name, doc.internal.pageSize.getWidth() / 4 + 6, 25, { align: 'left' });

        // Set font styles for address, telephone, email, website
        doc.setFont('times', 'normal');
        doc.setFontSize(11);

        // Add address
        const address = company.address;
        doc.text(address, doc.internal.pageSize.getWidth() / 4 + 6, 32, { align: 'left' });

        // Add telephone and email
        const telephone = company.phone;
        const email = company.email;
        doc.text(`Telp: ${telephone}   Email: ${email}`, doc.internal.pageSize.getWidth() / 4 + 6, 37, { align: 'left' });

        // Add website and Facebook
        const website = company.website;
        const facebook = company.facebook;
        doc.text(`Website: ${website}   Facebook: ${facebook}`, doc.internal.pageSize.getWidth() / 4 + 6, 42, { align: 'left' });

        doc.setLineWidth(1);
        doc.line(25, 45, 185, 45);

        const monthYear = convertToIndonesianDate(valueDate).toLowerCase().slice(2, convertToIndonesianDate(valueDate).length)
        doc.text(`Data pesanan bulan ${monthYear} `, doc.internal.pageSize.getWidth() / 2, 53, { align: 'center' });

        const headers = [['No', 'Nama', 'No.Hp', 'Deskripsi', 'Jumlah', 'Harga peritem', 'Total pembayaran']];
        const dataTable = [];

        if (data.length > 0) {
            data.forEach((element, index) => {
                dataTable.push(
                    [index + 1, element.name, element.phone, element.description, element.quantity, formatToIDR(element.pricePerItem), formatToIDR(element.payment)],
                )
            })
            dataTable.push(['', '', '', '', '', '', formatToIDR(pendapatan)])
        }

        const tableConfig = {
            head: headers,
            body: dataTable,
            startY: 58,
            styles: {
                halign: 'center',
                font: 'times',
                fontSize: 10,
            },
            headStyles: {
                fillColor: '#000000',
                color: '#ffffff',
            }
        };

        doc.autoTable(tableConfig);
        window.open(doc.output('bloburl'))
    };

    const handlePrintPDF = () => {
        generatePDF()
    }
    return (
        <>
            {loading && <Loading />}
            <Box p={{ base: 0, lg: 5 }} minH={{ base: '90vh', lg: 'min-content' }}>
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
                        <Text pl='5' fontWeight='bold' fontSize='lg'>Laporan Bulanan</Text>
                        <Flex w='full' justifyContent='space-between' direction={{ base: 'column', md: 'row' }} gap='3' p={5}>
                            <Button
                                colorScheme='green'
                                color='white'
                                onClick={handlePrintPDF}
                            >
                                cetak PDF
                            </Button>
                            <form onSubmit={handleSubmit(getDataInit)}>
                                <InputGroup>
                                    <Input
                                        type="month"
                                        id="date"
                                        name="date"
                                        {...register('date')}
                                        borderEndRadius='none'
                                        max={getThisMonth()}
                                        focusBorderColor='#00AA5D'
                                    />
                                    <Button
                                        color='white'
                                        bgColor='black'
                                        cursor='pointer'
                                        type="submit"
                                        borderLeftRadius='none'
                                    >
                                        Cari
                                    </Button>
                                </InputGroup>
                            </form>
                        </Flex>
                        <Table
                            variant='simple'
                            size='lg'
                            {...getTableProps()}>
                            <Thead bg='blackAlpha.900' >
                                {headerGroups.map((headerGroup) => (
                                    <Tr {...headerGroup.getHeaderGroupProps()} >
                                        {headerGroup.headers.map((column, index) => (
                                            <Th
                                                {...column.getHeaderProps()}
                                                color='white'
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
                                            {row.cells.map((cell) => {
                                                return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
                                            })}
                                        </Tr>
                                    );
                                })}
                                {data.length !== 0 &&
                                    <Tr>
                                        <Td>
                                            <Text fontWeight='bold' fontSize='lg'>Total: {data.length}</Text>
                                        </Td>
                                        {[...new Array(4)]
                                            .map(
                                                () =>
                                                    <Td></Td>
                                            )}
                                        <Td>
                                            <Text fontWeight='bold'>{`${formatMoneyIDR(pendapatan)}`}</Text>
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
                                <Box my='3' pl='7'>
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
