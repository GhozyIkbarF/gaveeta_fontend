import React, { useState, useEffect } from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
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

    const { refreshEditCompany } = useSelector(state => state.company)
    const getDataInit = async () => {
        setLoading(true)
        try {
            const res = await API.getCompany();
            setCompany(res.data);
        } catch (err) {
            console.log(err);
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
            <Box position='relative' w='full' minH="50vh" pt={{ base: 10, md: 18 }} px='5'>
                <Text fontWeight={'bold'} fontSize={{ base: '2xl', lg: '6xl' }} textAlign={'center'} mb={{ base: 5, md: 10 }}>Data perusahaan</Text>
                <Flex flexDir='column' w='full' align='start' fontSize={{ base: 'lg', lg: 'xl' }} pl={{ base: 0, lg: 20 }}>
                    <table className="table-auto mb-5">
                        <tbody>
                            <tr>
                                <td className="font-bold py-5">Name</td>
                                <td className="font-bold px-2 py-5">:</td>
                                <td className="font-bold py-5" >{company.name}</td>
                            </tr>
                            <tr>
                                <td className="font-bold py-5" style={{ verticalAlign: 'top' }}>Address</td>
                                <td className="font-bold py-5 px-2" style={{ verticalAlign: 'top' }}>:</td>
                                <td className="font-bold py-5">{company.address}</td>
                            </tr>
                            <tr>
                                <td className="font-bold py-5">Phone</td>
                                <td className="font-bold py-5 px-2">:</td>
                                <td className="font-bold py-5">{company.phone}</td>
                            </tr>
                            <tr>
                                <td className="font-bold py-5" style={{ verticalAlign: 'top' }}>Email</td>
                                <td className="font-bold py-5 px-2" style={{ verticalAlign: 'top' }}>:</td>
                                <td className="font-bold py-5">{company.email}</td>
                            </tr>
                            <tr>
                                <td className="font-bold py-5" style={{ verticalAlign: 'top' }}>Website</td>
                                <td className="font-bold py-5 px-2" style={{ verticalAlign: 'top' }}>:</td>
                                <td className="font-bold py-5">{company.website}</td>
                            </tr>
                            <tr>
                                <td className="font-bold py-5" style={{ verticalAlign: 'top' }}>Facebook</td>
                                <td className="font-bold py-5 px-2" style={{ verticalAlign: 'top' }}>:</td>
                                <td className="font-bold py-5">{company.facebook}</td>
                            </tr>
                        </tbody>
                    </table>

                    <Button
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                </Flex>
                <ModalEdit data={company} isOpen={isOpen} onClose={onClose} />
            </Box>
        </>
    )
}
