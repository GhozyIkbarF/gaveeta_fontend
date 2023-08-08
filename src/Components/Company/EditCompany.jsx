import React, { useState, useEffect } from 'react'
import {
    Box,
    Input,
    Button,
    Flex,
    Text,
    Icon,
    FormLabel,
    Wrap,
    WrapItem,
    Textarea,
    useColorModeValue,
    useToast,
    HStack
} from '@chakra-ui/react';
import { FaEnvelopeOpenText, FaTrashAlt } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';
import API from '../../Service';
import { yupResolver } from "@hookform/resolvers/yup";
import { UPDATE_COMPANY_VALIDATION } from '../../validation';

export default function EditCompany() {
    const [loading, setLoading] = useState(false)
    const [bank_accounts, setBankAccounts] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm(
        {
            resolver: yupResolver(UPDATE_COMPANY_VALIDATION),
            defaultValues: {
                name: '',
                address: "",
                phone: '',
                bank_accounts: [],
                email: "",
                website: "",
                facebook: "",
            }
        }
    );
    const navigate = useNavigate();
    const toast = useToast();

    const getDataInit = async () => {
        setLoading(true)
        try {
            const res = await API.getCompany();
            if (res) {
                setValue('name', res.data.name);
                setValue('address', res.data.address);
                setValue('phone', res.data.phone);
                setValue('email', res.data.email);
                setValue('website', res.data.website);
                setValue('facebook', res.data.facebook);
                setBankAccounts(res.data.bank_accounts)
            }
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

    async function onSubmit(data) {
        try {
            const res = await API.updateCompany(data)
            if(res){
                navigate('/company')
            }
            toast({
                title: "Update company data success",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            toast({
                title: "Update company data failed",
                description: "Something went wrong...",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-right",
            });
        }
    }

    const handleCencel = () => {
        navigate('/company')
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getDataInit()
    }, []);

    useEffect(() => {
        setValue('bank_accounts', bank_accounts)
    },[bank_accounts])

    const handleChange = (index, event) => {
        const name = event.target.name;
        const values = [...bank_accounts];
        values[index][name] = event.target.value;
        setBankAccounts(values);
    };

    const handleAddFields = () => {
        setBankAccounts([...bank_accounts, { bank_name: '', number: '', company_id: 1, }]);
    };

    const handleRemoveFields = (index) => {
        const values = [...bank_accounts];
        values.splice(index, 1);
        setBankAccounts(values);
    };

    const inputField = [
        { label: "Nama perusahaan", type: "text", name: "name" },
        { label: "No HP", type: "number", name: "phone" },
        { label: "Email", type: "email", name: "email" },
        { label: "Website", type: "text", name: "website" },
        { label: "Facebook", type: "text", name: "facebook" },
    ]
    return (
        <>
            {loading && <Loading />}
            <Box py={{ base: 0, lg: 5 }} >
                <Flex
                    justify={'center'}
                    position='relative'
                    w='full'
                    bg={useColorModeValue('white', '#1E2023')}
                    minH="50vh"
                    mt={{ base: 0, lg: 5 }}
                    py={{ base: 10, lg:20 }}
                    px='5'
                    borderRadius={{base:'none' ,lg:'md'}}
                >
                    <Flex 
                        flexDir={'column'} 
                        justify={'center'} 
                        w={{ base: 'full', lg: '90%' }}
                    >
                        <Text
                            fontWeight={'bold'}
                            fontSize={{ base: '2xl', lg: 'sxl' }}
                            mb={{ base: 5, md: 10 }}
                        >
                            Edit data perusahaan
                        </Text>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Flex
                                w={'full'}
                                align={'center'}
                                flexDir={'column'}
                            >
                                <Wrap w={'full'} justify={'space-between'}>
                                        <WrapItem w={{ base: 'full', md: '48%' }} display='flex' flexDirection='column'>
                                            <FormLabel>Nama perusahaan</FormLabel>
                                            <Input type='text' name='name' {...register('name')} required />
                                            {errors.name && <Text color={'red'} fontSize={'sm'}>{errors.name.message}</Text>}
                                        </WrapItem>
                                        <WrapItem w={{ base: 'full', md: '48%' }} display='flex' flexDirection='column'>
                                            <FormLabel>email</FormLabel>
                                            <Input type='email' name='name' {...register('email')} required />
                                            {errors.email && <Text color={'red'} fontSize={'sm'}>{errors.email.message}</Text>}
                                        </WrapItem>
                                        <WrapItem w={{ base: 'full', md: '48%' }} display='flex' flexDirection='column'>
                                            <FormLabel>No HP</FormLabel>
                                            <Input type='number' name='phone' {...register('phone')} required />
                                            {errors.phone && <Text color={'red'} fontSize={'sm'}>{errors.phone.message}</Text>}
                                        </WrapItem>
                                        <WrapItem w={{ base: 'full', md: '48%' }} display='flex' flexDirection='column'>
                                            <FormLabel>Website</FormLabel>
                                            <Input type='text' name='website' {...register('website')} required />
                                        </WrapItem>
                                        <WrapItem w={{ base: 'full', md: '48%' }} display='flex' flexDirection='column'>
                                            <FormLabel>Facebook</FormLabel>
                                            <Input type='text' name='facebook' {...register('facebook')} required />
                                        </WrapItem>
                                    <WrapItem w='100%' display='flex' flexDirection='column'>
                                        <FormLabel>Alamat</FormLabel>
                                        <Textarea type="text" name="address" {...register('address')} placeholder='Alamat' required />
                                    </WrapItem>
                                    <WrapItem w='100%' mt={10} display='flex' flexDirection='column'>
                                        <Text fontWeight={'bold'} fontSize={'xl'} pt={5}>Akun bank</Text>
                                    </WrapItem>
                                    {bank_accounts.map((inputField, index) => (
                                            <Flex w={'full'} gap={3} align={'end'} justifyContent={'space-between'}>
                                                <WrapItem w={'full'} display='flex' flexDirection='column'>
                                                    {index === 0 ? <FormLabel>Nama bank</FormLabel> : null}
                                                    <Input
                                                        type="text"
                                                        name='bank_name'
                                                        value={inputField.bank_name}
                                                        onChange={(event) => handleChange(index, event)}
                                                        required
                                                        />
                                                </WrapItem>
                                                <WrapItem w={'full'} display='flex' flexDirection='column'>
                                                    {index === 0 ? <FormLabel>No rekening</FormLabel> : null}
                                                    <Input
                                                        type="text"
                                                        name='number'
                                                        value={inputField.number}
                                                        onChange={(event) => handleChange(index, event)}
                                                        required
                                                    />
                                                </WrapItem>
                                                {index === 0 ?
                                                    <Button type="button" fontSize={'xl'} colorScheme='green' onClick={handleAddFields}>+</Button>
                                                    :
                                                    <Button type="button" fontSize={'xl'} colorScheme='red' onClick={() => handleRemoveFields(index)}>-</Button>
                                                }
                                            </Flex>
                                    ))}
                                </Wrap>
                                    <Flex w={'full'} justify={'start'} gap={3} mt={10}>
                                        <Button
                                            variant='outline'
                                            disabled={isSubmitting}
                                            onClick={handleCencel}
                                        >
                                            Batal
                                        </Button>
                                        <Button colorScheme='green' isLoading={isSubmitting} type="submit">Simpan</Button>
                                    </Flex>
                            </Flex>
                        </form>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}
