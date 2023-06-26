import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { Box, Text, Flex, Button, Input } from '@chakra-ui/react'
import {
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import ActionTablePegawai from '../Components/Pegawai/Table/ActionTablePegawai';
import AlertDeletePegawai from '../Components/Pegawai/ModalDeletePegawai'
import ModalAddPegawai from '../Components/Pegawai/ModalAddPegawai'
import ModalEditPegawai from '../Components/Pegawai/ModalEditPegawai';
import Loading from '../Components/Loading';
import { actionPegawai, setEmployes } from '../Features/Pegawai';
import API from '../Service'

export default function Pegawai() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const { action, result } = useSelector(state => state.pegawai)

  const getDataInit = async () => {
    setLoading(true)
      const res = await API.getAllPegawai();
      setData(res.data);
      dispatch(setEmployes(res.data));
      setLoading(false)
  };
  useEffect(() => {
      window.scrollTo(0, 0);
      getDataInit();
  }, []);

    useEffect(() => {
    getDataInit();
  }, [result]);


  const columns = useMemo(
      () => [
          {
              Header: 'Nama',
              accessor: 'name',
              Cell: ({ cell: { row } }) =>( 
              <Flex align="center" minWidth="100%" flexWrap="nowrap">
                  <Avatar src={row.original.photo} w="50px" borderRadius="12px" me="18px" />
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
              Header: 'email',
              accessor: 'email',
          },
          {
              Header: 'action',
              Cell: ({ row }) => (
                  <ActionTablePegawai id={row.original.id} onOpen={onOpen}/>
              )
          },
          
      ],
      []
  );

  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
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

  const handleAddPegawai = (action) => (e) => {
    e.preventDefault();
    dispatch(actionPegawai(action))
    onOpen()
  }

  return (
    <>
    { loading && <Loading/>}
      <Box p={5} pt='5'>
          <TableContainer borderRadius={'md'} bgColor='white' shadow={'sm'} overflowX='auto' py='5' boxShadow='md'>
          <Text pl='5' fontWeight='bold' fontSize='lg'>Total jumlah pegawai: {data.length}</Text>
              <Flex w='full' justifyContent='space-between' direction={{ base: 'column', md: 'row' }} gap='3' p='5'>
                  <Button
                      colorScheme='messenger'
                      onClick={handleAddPegawai('create')}
                  >
                      Tambah Pesanan
                  </Button>
                  <Input
                      placeholder='search...'
                      size='md'
                      width='auto'
                      value={globalFilter || ''}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                  />
              </Flex>
              <Table variant='simple' size='lg' {...getTableProps()}>
                  <Thead>
                      {headerGroups.map((headerGroup) => (
                          <Tr {...headerGroup.getHeaderGroupProps()}>
                              {headerGroup.headers.map((column) => (
                                  <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
                              ))}
                          </Tr>
                      ))}
                  </Thead>
                  <Tbody {...getTableBodyProps()}>
                      {page.map((row, i) => {
                          prepareRow(row);
                          return (
                              <Tr {...row.getRowProps()}>
                                  {row.cells.map((cell) => {
                                      return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
                                  })}
                              </Tr>
                          );
                      })}
                  </Tbody>
              </Table>
              <Box my='2' pl='8'>
                  <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                  <FaAngleLeft/>
                  </Button>
                  <span>
                      {' '}Page{' '}
                      <strong>
                          {pageIndex + 1} of {pageOptions.length}
                      </strong>{' '}
                  </span>
                  <Button onClick={() => nextPage()} disabled={!canNextPage}>
                  <FaAngleRight/>
                  </Button>
              </Box>
              {action === 'create' && (<ModalAddPegawai isOpen={isOpen} onClose={onClose} />)}
              {action === 'delete' && <AlertDeletePegawai onClose={onClose} isOpen={isOpen} />}
              {action === 'edit' && (<ModalEditPegawai onClose={onClose} isOpen={isOpen}/>)}
          </TableContainer>
      </Box>
    </>
  )
}



