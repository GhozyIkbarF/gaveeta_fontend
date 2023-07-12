import React, { useState, useEffect } from 'react'
import { Box, Button, Flex, Text, useColorModeValue, useToast } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import ModalEdit from '../Components/Company/ModalEdit';
import { setTriggerEditData } from '../Features/Company';
import Loading from '../Components/Loading';
import API from '../Service';

export default function Setting() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState(false)
    const [company, setCompany] = useState([]);
    const toast = useToast();

    const { refreshEditCompany } = useSelector(state => state.company)
    const getDataInit = async () => {
        setLoading(true)
        try {
            const res = await API.getCompany();
            setCompany(res.data);
        } catch (err) {
            toast({
                title: "Something went wrong",
                description: "Something went wrong...",
                status: "error",
                duration: 3500,
                isClosable: true,
                position: "top-right",
              });
        }
        setLoading(false)
    };
    const dispatch = useDispatch()
    useEffect(() => {
        window.scrollTo(0, 0);
        getDataInit()
    }, [])

    useEffect(() => {
        getDataInit()
    }, [refreshEditCompany])

    const handleEdit = () => {
        dispatch(setTriggerEditData())
        onOpen()
    }

    return (
        <>
            {loading && <Loading />}
            <Box p={{ base:0, lg:5 }} >
                <Box 
                    position='relative' 
                    w='full' 
                    bg={useColorModeValue('white', '#1E2023')} 
                    minH="50vh"
                    mt={{ base:0, lg:5 }} 
                    py={{ base: 10, md: 18 }} 
                    px='5'
                >
                    <Text 
                        fontWeight={'bold'} 
                        fontSize={{ base: '2xl', lg: '6xl' }} 
                        textAlign={'center'} 
                        mb={{ base: 5, md: 10 }}
                    >
                        Data perusahaan
                    </Text>
                    <Flex 
                        flexDir='column' 
                        w='full' align='start' 
                        fontSize={{ base: 'lg', lg: 'xl' }} 
                        pl={{ base: 0, lg: 20 }} 
                    >
                        <table className="table-auto mb-5 text-base sm:text-lg md:text-md lg:text-lg overflow-x-scroll">
                            <tbody>
                                <tr>
                                    <td className="py-5">Name</td>
                                    <td className="px-2 py-5">:</td>
                                    <td className="py-5" >{company.name}</td>
                                </tr>
                                <tr>
                                    <td className="py-5" style={{ verticalAlign: 'top' }}>Address</td>
                                    <td className="py-5 px-2" style={{ verticalAlign: 'top' }}>:</td>
                                    <td className="py-5">{company.address}</td>
                                </tr>
                                <tr>
                                    <td className="py-5">Phone</td>
                                    <td className="py-5 px-2">:</td>
                                    <td className="py-5">{company.phone}</td>
                                </tr>
                                <tr>
                                    <td className="py-5" style={{ verticalAlign: 'top' }}>Email</td>
                                    <td className="py-5 px-2" style={{ verticalAlign: 'top' }}>:</td>
                                    <td className="py-5">{company.email}</td>
                                </tr>
                                <tr>
                                    <td className="py-5" style={{ verticalAlign: 'top' }}>No Rekening</td>
                                    <td className="py-5 px-2" style={{ verticalAlign: 'top' }}>:</td>
                                    <td className="py-5">{company.no_rek}</td>
                                </tr>
                                <tr>
                                    <td className="py-5" style={{ verticalAlign: 'top' }}>Website</td>
                                    <td className="py-5 px-2" style={{ verticalAlign: 'top' }}>:</td>
                                    <td className="py-5">{company.website}</td>
                                </tr>
                                <tr>
                                    <td className="py-5" style={{ verticalAlign: 'top' }}>Facebook</td>
                                    <td className="py-5 px-2" style={{ verticalAlign: 'top' }}>:</td>
                                    <td className="py-5">{company.facebook}</td>
                                </tr>
                            </tbody>
                        </table>

                        <Button
                            onClick={handleEdit}
                            mb={5}
                        >
                            Edit
                        </Button>
                    </Flex>
                    <ModalEdit data={company} isOpen={isOpen} onClose={onClose} />
                </Box>
            </Box>
        </>
    )
}
