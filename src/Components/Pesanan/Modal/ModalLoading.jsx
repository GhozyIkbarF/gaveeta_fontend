import {
    Modal,
    ModalOverlay,
    ModalContent,
    Spinner
} from '@chakra-ui/react'

import React from 'react'

export default function ModalLoading(props) {
    const { isOpen, onClose } = props;
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
        >
            <ModalOverlay
                bg='blackAlpha.900'
                backdropFilter='blur(10px)'>
                <ModalContent bg='transparent' display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </ModalContent>
            </ModalOverlay>
        </Modal>
    )
}
