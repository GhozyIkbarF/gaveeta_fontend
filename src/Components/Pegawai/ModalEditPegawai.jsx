import {
    Box,
    Image,
    Center,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Select,
    FormControl,
    FormLabel,
    Wrap,
    WrapItem,
    useToast,
    Textarea,
    Avatar,
} from '@chakra-ui/react'
import { MdInsertPhoto } from "react-icons/md";
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form';
import { changeDataPegawai } from '../../Features/Pegawai';
import API from '../../Service'
import { object } from 'yup';

export default function ModalEditPegawai({ isOpen, onClose }) {
    const [divisi, setDivisi] = useState('Programmer')
    const [profilePicture, setProfilePicture] = useState()
    const btnRef = React.useRef(null);
    const { dataEditPegawai,  refreshEditPegawai } = useSelector(state => state.pegawai)


    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            id:"",
            name: "",           
            phone: "",
            email: "",
            gender: "",
            address:"",
            photo: "",
          },
    });

    const dispatch = useDispatch();
    const toast = useToast();

    const photo = watch("photo");

    const close = () => {
        onClose();
        reset();
    };

    useEffect(() => {
        setValue('id', dataEditPegawai.id);
        setValue('name', dataEditPegawai.name);
        setValue('email', dataEditPegawai.email);
        setValue('phone', dataEditPegawai.phone);
        setValue('address', dataEditPegawai.address)
        setValue('gender', dataEditPegawai.gender);
        setValue('photo', dataEditPegawai.photo);
    }, [refreshEditPegawai]);


    async function onSubmit(data) {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('phone', data.phone);
            formData.append('email',  data.email);
            formData.append('address', data.address);
            formData.append('gender', data.gender);
            if(typeof(data.photo) != 'string'){
                formData.append('photo', photo[0]);
            }else if(data.photo == ''){
                formData.append('photo', 'hapus foto');
            }else{
                formData.append('photo', data.photo);
            }
            const res = await API.updatePegawai(data.id, formData)
            dispatch(changeDataPegawai())
            toast({
                title: "Edit pegawai success",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "bottom-right",
            });
            close();
        } catch (error) {
            console.log(error.message);
            toast({
                title: "Edit pegawai failed",
                description: "Something went wrong...",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom-right",
            });
        }
    }


    const ButtonDelete = () => {
        const removeSelectedImage = () => {
            setValue('photo', '');
        };
        return (
            <Center>
                <Button
                    onClick={removeSelectedImage}
                    className=" text-white w-full cursor-pointer mt-1 p-15"
                    colorScheme="red"
                >
                    Remove Image
                </Button>
            </Center>
        )
    }
    
    useEffect(() => {
        if (typeof (photo) == 'object') {
            setProfilePicture(
                <Box>
                    <Image
                         borderRadius='lg'
                         h='auto'
                         w='full'
                         objectFit='cover'
                        src={URL.createObjectURL(photo[0])}
                        alt="ssadas"
                    />
                    <ButtonDelete />
                </Box>
            )
        } else if (typeof (photo) == 'string' && photo != '') {
            setProfilePicture(
            <Box>
                <Center>
                <Image
                    borderRadius='lg'
                    h='auto'
                    w='full'
                    objectFit='cover'
                    src={photo}
                    alt="ssadas"
                />
                </Center>
                <ButtonDelete />
            </Box>)
        } else {
            setProfilePicture(
                <Box>
                    <Avatar src={'https://bit.ly/broken-link'} w="full" h='auto' borderRadius="12px" me="18px" mb='1' />
                </Box>
            )
        }

    }, [photo])



    return (
        <>
            <Modal
                finalFocusRef={btnRef}
                scrollBehavior={'inside'}
                isOpen={isOpen}
                onClose={close}
                closeOnOverlayClick={false}
                size={{ sm: 'full', md: '2xl' }}
            >
                <ModalOverlay
                bg='blackAlpha.300'
                backdropFilter='blur(10px)' />
                <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    <ModalHeader borderBottom='1px' borderColor='gray.100'>Edit your account</ModalHeader>
                    <ModalCloseButton onClose={close} />
                        <ModalBody pb={6}>
                            <Wrap spacing='30px' justify={'space-between'}>
                                <WrapItem w={{ base: 'full', md: '45%' }}>
                                    <FormControl>
                                        <FormLabel>nama</FormLabel>
                                        <Input
                                            name="name"
                                            {...register('name')}
                                            required
                                        />
                                    </FormControl>
                                </WrapItem>
                                <WrapItem w={{ base: 'full', md: '45%' }}>
                                    <FormControl>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            name="email"
                                            {...register('email')}
                                            type='email'
                                            required
                                        />
                                    </FormControl>
                                </WrapItem>
                                <WrapItem w={{ base: 'full', md: '45%' }}>
                                    <FormControl>
                                        <FormLabel>Phone</FormLabel>
                                        <Input
                                            name="phone"
                                            {...register('phone')}
                                            required
                                        />
                                    </FormControl>
                                </WrapItem>
                                <WrapItem w={{ base: 'full', md: '45%' }}>
                                    <FormControl>
                                        <FormLabel>Divisi</FormLabel>
                                        <Input
                                            value={divisi}
                                            onChange={(e) => setDivisi(e.target.value)}
                                        />
                                    </FormControl>
                                </WrapItem>
                                <WrapItem w={{ base: 'full', md: '45%' }}>
                                    <FormControl>
                                        <FormLabel>Gender</FormLabel>
                                        <Select name='gender' {...register('gender')}>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </Select>
                                    </FormControl>
                                </WrapItem>
                                <WrapItem w='full'>
                                    <FormControl>
                                        <FormLabel>Alamat</FormLabel>
                                        <Textarea
                                            name="address"
                                            {...register('address')}
                                            required
                                        />
                                    </FormControl>
                                </WrapItem>
                                <WrapItem w='100%'>
                                    <FormControl>
                                        {profilePicture}
                                        {photo == '' ?
                                            <label
                                                htmlFor="fileInput"
                                                className="bg-blue-500 cursor-pointer border-white rounded-lg h-10  flex items-center justify-center  text-white "
                                            >
                                                <MdInsertPhoto />
                                                <Input
                                                    {...register("photo")}
                                                    type="file"
                                                    id="fileInput"
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                                <p className="font-semibold">Photo</p>
                                            </label> : null}
                                    </FormControl>
                                </WrapItem>
                            </Wrap>
                        </ModalBody>

                        <ModalFooter borderTop='1px' borderColor='gray.100'>
                            <Button
                                colorScheme='blue'
                                mr={3}
                                isLoading={isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                            <Button
                                disabled={isSubmitting}
                                onClick={isSubmitting ? null : close}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                </ModalContent>
                </form>
            </Modal>
        </>
    )
}

