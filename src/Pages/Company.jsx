import React, { useState, useEffect } from 'react'
import { Box, Button, Flex, Text, useColorModeValue, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading';
import API from '../Service';

export default function Company() {
    const [loading, setLoading] = useState(false)
    const [company, setCompany] = useState([]);

    const navigate = useNavigate();
    const toast = useToast();

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
                duration: 2000,
                isClosable: true,
                position: "top-right",
            });
        }
        setLoading(false)
    };
    useEffect(() => {
        getDataInit()
    }, [])

    const handleEdit = () => {
        navigate('/company_setting')
    }

    const RowTable = ({ value }) => {
        const data = [
            { title: 'Name', value:value.name},
            { title: 'Alamat', value:value.address},
            { title: 'No HP', value:value.phone},
            { title: 'Email', value:value.email},
            { title: 'Website', value:value.website},
            { title: 'Facebook', value:value.facebook},
        ]
        return (
            <>
                {data?.map((data, i) => (
                    <tr key={i}>
                        <td className="py-2" style={{ verticalAlign: 'top' }}>{data.title}</td>
                        <td className="py-2 px-2" style={{ verticalAlign: 'top' }}>:</td>
                        <td className="py-2">{data.value}</td>
                    </tr>
                ))}
            </>
        )
    }
    const RowTableBankAccount = ({ data }) => {
        return (
            <>
                {data?.map((data, i) => (
                    <tr key={i}>
                        <td className="py-2" style={{ verticalAlign: 'top' }}>{data.bank_name}</td>
                        <td className="py-2 px-2" style={{ verticalAlign: 'top' }}>:</td>
                        <td className="py-2">{data.number}</td>
                    </tr>
                ))}
            </>
        )
    }

    return (
        <>
            {loading && <Loading />}
            <Box p={{ base: 0, lg: 5 }} >
                <Box
                    position='relative'
                    w='full'
                    bg={useColorModeValue('white', '#1E2023')}
                    minH="50vh"
                    mt={{ base: 0, lg: 5 }}
                    py={{ base: 10, md: 18 }}
                    px='5'
                    borderRadius={{ base: 'none', lg: 'md' }}
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
                                <RowTable value={company}/>
                            </tbody>
                        </table>
                        <Text>Akun bank</Text>
                        <table className="table-auto mb-5 text-base sm:text-lg md:text-md lg:text-lg overflow-x-scroll">
                            <tbody>
                                <RowTableBankAccount data={company.bank_accounts}/>
                            </tbody>
                        </table>
                        <Button
                            onClick={handleEdit}
                            mb={5}
                        >
                            Edit
                        </Button>
                    </Flex>
                </Box>
            </Box>
        </>
    )
}
