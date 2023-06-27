import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Image,
    InputGroup,
    InputRightElement,
    IconButton,
    useToast
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import logoGaveeta from '../Assets/logo-gaveeta.png';
import API from '../Service';

export default function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [open, setOpen] = useState(false);
    // const userId = localStorage.getItem('userId');
    // const navigate = useNavigate();
    const toast = useToast();


    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    }
    );

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            window.location.pathname = "/dashboard";
        } else {
            setOpen(true);
        }
    }, [])

    const onSubmit = async (data, e) => {
        e.preventDefault()
        try {
            const res = await API.login({
                email: data.email,
                password: data.password,
            })
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('userId', res.data.id);
            toast({
                title: "Login success",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            reset();
            window.location.pathname = "/beranda"
        } catch (error) {
            toast({
                title: "Login failed",
                description: "Password is wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        }
    }


    return (
        <>
            <Stack minH={'100vh'} direction={'column-reverse' } justifyContent='center'>
                {open ?
                    <>
                        <Flex align={'center'} justify={'center'}>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={4} w={'full'} maxW={'md'}>
                                    {/* <Heading fontSize={'2xl'}>Sign in to admin gaveeta</Heading> */}
                                    <FormControl id="email">
                                        <FormLabel>Email address</FormLabel>
                                        <Input type="email" id="email" {...register('email')} required />
                                    </FormControl>
                                    <FormControl id="password">
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <Input type={passwordVisible ? "text" : "password"} id="password" {...register('password')} required />
                                            <InputRightElement>
                                                <IconButton
                                                    variant="ghost"
                                                    onClick={handlePasswordVisibility}
                                                    icon={passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <Stack spacing={6}>
                                        {/* <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Remember me</Checkbox>
                                <Link color={'blue.500'}>Forgot password?</Link>
                            </Stack> */}
                                        <Button colorScheme={'blue'} variant={'solid'} type="submit" isLoading={isSubmitting}>
                                            Sign in
                                        </Button>
                                    </Stack>
                                </Stack>
                            </form>
                        </Flex>
                        <Flex align='center' justifyContent='center'>
                            <Image
                                alt={'Login Image'}
                                objectFit={'contain'}
                                // src={
                                //     'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
                                // }
                                src={logoGaveeta}
                            />
                        </Flex>
                    </>
                    :
                    <Flex w='full' justifyContent='center' align='center' h='full'>
                        <Image
                            h='44'
                            w='44'
                            alt={'Login Image'}
                            objectFit={'contain'}
                            src={logoGaveeta}
                        />
                    </Flex>
                    }
            </Stack>
        </>
    );
}