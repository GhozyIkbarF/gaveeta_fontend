import React, { useState, useEffect } from 'react'
import { Box, Flex, Text, Input, FormLabel, InputGroup, Button } from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react'
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useToast } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { formatMoneyIDR, formatToIDR, convertToIndonesianDate, getThisMonth } from '../validation/format';
import Loading from '../Components/Loading';
import API from '../Service';
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import logoGaveeta from '../Assets/logo-gaveeta.png'

export default function Data() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    // const [payment, setPayment] = useState([])
    let [pendapatan, setPendapatan] = useState(0)
    // let pendapatan = 0;

    const {
        handleSubmit,
        setValue,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm(
        {
            //   resolver: yupResolver(CREATE_PESANAN_MASUK_VALIDATION),
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

    const getDataInit = async (data) => {
        setLoading(true)
        setData([]);
        try {
            const res = await API.getOrderPerMonth(data);
            setData(res.data);
        } catch (err) {
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
                totalPendapatan += element.payment;
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
                    <Flex align="center" minWidth="100%" flexWrap="nowrap">
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
                Header: 'phone',
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
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        state,
        setGlobalFilter
    } = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        usePagination
    );

    const { globalFilter, pageIndex } = state;

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
        doc.text('Gaveeta Packaging', doc.internal.pageSize.getWidth() / 4 + 6, 25, { align: 'left' });

        // Set font styles for address, telephone, email, website
        doc.setFont('times', 'normal');
        doc.setFontSize(11);

        // Add address
        const address = 'Garen RT 03/04 No. 50A, Pandeyan, Ngemplak, Boyolali, Jawa Tengah 57375';
        doc.text(address, doc.internal.pageSize.getWidth() / 4 + 6, 32, { align: 'left' });

        // Add telephone and email
        const telephone = '0812 2617 4781';
        const email = 'gaveeta.creative@gmail.com';
        doc.text(`Telp: ${telephone}   Email: ${email}`, doc.internal.pageSize.getWidth() / 4 + 6, 37, { align: 'left' });

        // Add website and Facebook
        const website = 'www.kotakkado.web.id';
        const facebook = 'gaveeta aneka kado';
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
            <Box position='relative' pt='5' borderRadius='lg'  bg='white' w='full' mt='5'>
                <Flex flexDirection='column' align='center'>
                    <form onSubmit={handleSubmit(getDataInit)}>
                        <FormLabel textAlign='center' htmlFor="date">Cari pesanan perbulan</FormLabel>
                        <InputGroup>
                            <Input type="month" id="date" name="date" {...register('date')} borderEndRadius='none' max={getThisMonth()} />
                            <Button color='white' bgColor='teal' cursor='pointer' type="submit" borderLeftRadius='none'>Cari</Button>
                        </InputGroup>
                    </form>
                </Flex>
                <Box p='5'>
                    <TableContainer py="8" bgColor='white' borderRadius={'md'} overflowX='auto'>
                        {data.length !== 0 &&
                            <>
                                <Flex w='full' justifyContent='space-between' direction={{ base: 'column', md: 'row' }} gap='3' p='5'>
                                    <Button
                                        bgColor='teal'
                                        color='white'
                                        onClick={handlePrintPDF}
                                    >
                                        cetak PDF
                                    </Button>
                                </Flex>
                            </>
                        }
                        <Table variant='simple' size='lg' {...getTableProps()}>
                            <Thead bg='blackAlpha.900' >
                                {headerGroups.map((headerGroup) => (
                                    <Tr {...headerGroup.getHeaderGroupProps()} >
                                        {headerGroup.headers.map((column, index) => (
                                            <Th
                                                {...column.getHeaderProps()}
                                                color='white'
                                                borderTopLeftRadius={index === 0 ? 'lg' : 0}
                                                borderTopRightRadius={index === headerGroup.headers.length - 1 ? 'lg' : 0}
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
                                <Flex px='7' py='5' justifyContent='space-between'>
                                </Flex>
                                <Box my='3' pl='7'>
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
                            </>
                        }
                        {data.length < 1 && <Text textAlign={'center'} fontWeight={'bold'} fontSize={{ base:'xl', md: '3xl' }} mt={20}>data pesanan kosong</Text>}
                    </TableContainer>
                </Box>
            </Box>
        </>
    )
}
