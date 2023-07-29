import {
    Button,
    Flex,
    FormControl,
    FormLabel,
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
import { useForm } from "react-hook-form"
import logoGaveeta from '../Assets/logo-gaveeta.png';
import API from '../Service';

export default function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const toast = useToast();


    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const {
        handleSubmit,
        register,
        reset,
        formState: { isSubmitting },
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
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('role', res.data.role);
            toast({
                title: "Login success",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            reset();
            window.location.pathname = "/dashboard"
        } catch (error) {
            toast({
                title: "Login failed",
                description: "Masukkkan email atau password yang benar",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
        }
    }


    return (
        <>
            <Stack 
                minH={'100vh'} 
                direction={'column-reverse' } 
                justifyContent='center'>
                {open ?
                    <>
                        <Flex 
                        align={'center'} 
                        justify={'center'}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack 
                                    spacing={4} 
                                    w={'full'} 
                                    maxW={'md'}>
                                    <FormControl id="email">
                                        <FormLabel>Email</FormLabel>
                                        <Input 
                                            type="email" 
                                            id="email" 
                                            {...register('email')} 
                                            required />
                                    </FormControl>
                                    <FormControl id="password">
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <Input 
                                                type={passwordVisible ? "text" : "password"} 
                                                id="password" {...register('password')} 
                                                required/>
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
                                        <Button 
                                            colorScheme={'green'} 
                                            variant={'solid'} 
                                            type="submit" 
                                            isLoading={isSubmitting}>
                                            Masuk
                                        </Button>
                                    </Stack>
                                </Stack>
                            </form>
                        </Flex>
                        <Flex align='center' justifyContent='center'>
                            <Image
                                alt={'Login Image'}
                                objectFit={'contain'}
                                src={logoGaveeta}
                            />
                        </Flex>
                    </>
                    :
                    <Flex 
                        w='full' 
                        justifyContent='center' 
                        align='center' 
                        h='full'>
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