import React from 'react';
import {
    Box,
    Text,
    Wrap,
    WrapItem,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import API from '../../../../Service';


const ModalSendProgres = (props) => {
    const { isOpen, onClose, id } = props;
    const finalRef = React.useRef(null)

    const accountSid = '124489577219312';
    const authToken = 'EAAHn7n6UZBIcBACcufBVyBZBvZAeCloHfx1OFJgZCvm2JmGZBQhONvatC7mZB2aE1tqUsUmgKTOttt7g3DomIvhZBcoZBjIywEH3AJVVJGAZCnspOew2ONBzfiLAnMFrryyA4kNaZBUWxTASfxrG8GfjbETnMfFCRmxPDW0O9xxTQLmIOp50qWsKNq8AUTErjscLlOQZCXnSZAlJQAZDZD';

    
    async function sendMessage(){
        const data = {
            messaging_product: 'whatsapp',
            to: '628882582864',
            type: 'template',
            template: {
              name: 'send_progress',
              language: {
                code: 'id'
              },
            },
            template_parameters: {
              '1': 'John Doe', // Replace with the actual name of the recipient
              '2': '50' // Replace with the actual progress percentage
            }
          };
          
        try {
          const res = await API.sendProgres(data)
          console.log(res.data)
        } catch (error) {
          console.error(error.message);
        }
      };
      
      
    return (
        <>
            <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }}>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px)' />
                <ModalContent>
                    <ModalHeader>Data progres</ModalHeader>
                    {/* <ModalCloseButton /> */}
                    <ModalBody>
                        <Wrap>
                            <WrapItem w='40%'>
                                <CircularProgress value={40} color='green.400' size={{ base: '90px', md: '120px' }}>
                                    <CircularProgressLabel>40%</CircularProgressLabel>
                                </CircularProgress>
                            </WrapItem>
                            <WrapItem w='50%'>
                                <Wrap>
                                    <WrapItem w='full'>
                                        <Text fontSize={{ base: 'xs', md: 'md' }}>jumlah Total Item yang dipesan: 100</Text>
                                    </WrapItem>
                                    <WrapItem w='full'>
                                        <Text fontSize={{ base: 'xs', md: 'md' }}>jumlah yang sudah diselesaikan: 40</Text>
                                    </WrapItem>
                                </Wrap>
                            </WrapItem>
                        </Wrap>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                        colorScheme='green' 
                        mr={3} 
                        onClick={sendMessage}
                        >
                            Send
                        </Button>
                        <Button mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalSendProgres;
