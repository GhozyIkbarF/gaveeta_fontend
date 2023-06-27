import React, { useEffect } from 'react'
import {
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormLabel,
    FormErrorMessage,
    Wrap,
    WrapItem,
    Button,
    Textarea,
} from '@chakra-ui/react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { setRefreshEditCompany } from '../../Features/Company';
import API from '../../Service';

export default function ModalEdit({ data, isOpen, onClose }) {
    const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");

    const { triggerEditData } = useSelector(state => state.company)
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { isSubmitting },
    } = useForm(
        {
            //   resolver: yupResolver(UPDATE_PESANAN_MASUK_VALIDATION),
            defaultValues: {
                name: '',
                address: "",
                phone: '',
                email: "",
                website: "",
                facebook: "",
            }
        }
    );
    const dispatch = useDispatch();
    const toast = useToast();

    const Close = () => {
        onClose();
        reset();
    }

    useEffect(() => {
        setValue('name', data.name);
        setValue('address', data.address);
        setValue('phone', data.phone);
        setValue('email', data.email);
        setValue('website', data.website);
        setValue('facebook', data.facebook);
    },[triggerEditData])

    async function onSubmit(data) {
        try {
            const res = await API.updateCompany(data)
            dispatch(setRefreshEditCompany())
            toast({
                title: "Update company data success",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom-right",
            });
            onClose();
        } catch (error) {
            console.log(error.message);
            toast({
                title: "Update company data failed",
                description: "Something went wrong...",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-right",
            });
        }
    }

    const EditInput = () => {
        return (
            <Wrap spacing='10px' justify={'space-between'}>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                    <FormLabel>nama pemesan</FormLabel>
                    <Input type="text" name="name" {...register('name')} placeholder='Nama' required />
                    <FormErrorMessage>
                        {/* {errors.name && errors.name.message} */}
                    </FormErrorMessage>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                    <FormLabel>phone</FormLabel>
                    <Input type="text" name="phone" {...register('phone')} placeholder='phone' required />
                    <FormErrorMessage>
                        {/* {errors.phone && errors.phone.message} */}
                    </FormErrorMessage>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                    <FormLabel>Email</FormLabel>
                    <Input type='email' name="email" {...register('email')} placeholder='Email' required />
                    <FormErrorMessage>
                        {/* {errors.email && errors.email.message} */}
                    </FormErrorMessage>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                    <FormLabel>Website</FormLabel>
                    <Input type='text' name="website" {...register('website')} placeholder='Website' required />
                    <FormErrorMessage>
                        {/* {errors.website && errors.website.message} */}
                    </FormErrorMessage>
                </WrapItem>
                <WrapItem w={{ base: 'full', md: '45%' }} display='flex' flexDirection='column'>
                    <FormLabel>Facebook</FormLabel>
                    <Input type='text' name="facebook" {...register('facebook')} placeholder='Facebook' required />
                    <FormErrorMessage>
                        {/* {errors.facebook && errors.facebook.message} */}
                    </FormErrorMessage>
                </WrapItem>
                <WrapItem w='100%' display='flex' flexDirection='column'>
                    <FormLabel>Alamat</FormLabel>
                    <Textarea type="text" name="address" {...register('address')} placeholder='Alamat' required />
                    <FormErrorMessage>
                        {/* {errors.address && errors.address.message} */}
                    </FormErrorMessage>
                </WrapItem>
            </Wrap>
        )
    }

    return (
        <>
            {isSmallerThanSm ?
                <Drawer
                    isOpen={isOpen}
                    placement='right'
                    onClose={Close}
                    size='full'
                    scrollBehavior={'inside'}
                >
                    <DrawerOverlay />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader borderBottom='1px' borderColor='gray.100'>Edit data perusahaan</DrawerHeader>
                            <DrawerBody>
                                <EditInput />
                            </DrawerBody>

                            <DrawerFooter borderTop='1px' borderColor='gray.100'>
                                <Button
                                    variant='outline'
                                    mr={3}
                                    disabled={isSubmitting}
                                    onClick={isSubmitting ? null : Close}
                                >
                                    Cancel
                                </Button>
                                <Button colorScheme='blue' isLoading={isSubmitting} type="submit">Save</Button>
                            </DrawerFooter>
                        </DrawerContent>
                    </form>
                </Drawer>
                :
                <Modal
                    scrollBehavior={'inside'}
                    isOpen={isOpen}
                    onClose={Close}
                    closeOnOverlayClick={false}
                    size={{ sm: 'full', md: '2xl' }}
                >
                    <ModalOverlay
                        bg='blackAlpha.300'
                        backdropFilter='blur(10px)' />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalContent>
                            <ModalHeader borderBottom='1px' borderColor='gray.100'>Edit data perusahaan</ModalHeader>
                            <ModalCloseButton onClose={onClose} />
                            <ModalBody pb={6}>
                                <EditInput />
                            </ModalBody>
                            <ModalFooter gap={3} borderTop='1px' borderColor='gray.100'>
                                <Button
                                    disabled={isSubmitting}
                                    onClick={isSubmitting ? null : Close}
                                >
                                    Cancel
                                </Button>
                                <Button colorScheme='blue' isLoading={isSubmitting} type="submit">
                                    Save
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </form>
                </Modal>}
        </>
    )
}
