import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Flex,
    Text,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    useToast,
} from '@chakra-ui/react'
import { MdAdd, MdRemove } from 'react-icons/md';
import { useMediaQuery } from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import { setRefreshOrderProses } from '../../../../Features/Pesanan/PesananProses';
import API from '../../../../Service';

export default function ModalInputProgres(props) {
    const { isOpen, onClose } = props
    const initialRef = React.useRef(null);
    const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");
    const [number, setNumber] = useState(0);

    const { dataDetailOrderProses, refreshActionOrderProses } = useSelector(state => state.pesananProses);
    const handleIncrement = () => {
        if(number < dataDetailOrderProses.quantity)
        setNumber(number + 1);
    };

    const handleDecrement = () => {
        if(number !== 0) setNumber(number - 1);
    };

    const {
        handleSubmit,
        register,
        setValue,
        reset,
        formState: { isSubmitting },
    } = useForm(
        {
            defaultValues: {
                progres: 0,
            }
        }
    );

    const dispatch = useDispatch();
    const toast = useToast();

    const close = () => {
        onClose();
        reset();
    };

    useEffect(() => {
        setValue('id', dataDetailOrderProses.id);
        if (dataDetailOrderProses.progres) {
            setValue('progres', dataDetailOrderProses.progres)
            setNumber(dataDetailOrderProses.progres)
        } else {
            setValue('progres', 0)
        }

    }, [refreshActionOrderProses])

    useEffect(() => {
        if (number) setValue("progres", number);
    }, [number]);


    async function onSubmit(data) {
        try {
            await API.updateProgres(data)
            toast({
                title: "Edit progres success",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "bottom-right",
            });
            dispatch(setRefreshOrderProses())
            close();
        } catch (error) {
            toast({
                title: "Edit progres failed",
                description: "Something went wrong...",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-right",
            });
        }
    }

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
    }


    return (
        <Modal
            initialFocusRef={initialRef}
            scrollBehavior={'outside'}
            isOpen={isOpen}
            onClose={close}
            size={{ sm: 'full', md: 'lg' }}
            isCentered
        >
            <ModalOverlay/>
            <ModalContent maxW={isSmallerThanSm ? '320px' : 'lg'}>
                <ModalHeader fontSize={{ base: 'md', md: 'lg' }}>Setting progres pesanan</ModalHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody>
                        <Flex flexDir='column' pt={6} pb={2} gap='4'>
                            <Box>
                                <Text>{`Jumlah pesanan ${dataDetailOrderProses.quantity} pcs`}</Text>
                                <Text>{`Jumlah yang sudah selesai ${!dataDetailOrderProses.progres ? 0 : dataDetailOrderProses.progres} pcs`}</Text> 
                            </Box>
                            <InputGroup size="md">
                                <InputLeftElement children={<MdRemove/>} onClick={handleDecrement}  cursor='pointer'/>
                                <Input type='number' value={number} textAlign='center' />
                                <InputRightElement children={<MdAdd />} onClick={handleIncrement} cursor='pointer'/>
                            </InputGroup>
                        </Flex>
                    </ModalBody>
                    <ModalFooter gap='3' mt='3'>
                        <Button
                            disabled={isSubmitting}
                            onClick={isSubmitting ? null : close}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme='blue'
                            isLoading={isSubmitting}
                            type="submit"
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

