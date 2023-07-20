import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useToast
  } from '@chakra-ui/react'
  import { useMediaQuery } from "@chakra-ui/react";
  import React from 'react'
  import { useState } from 'react'
  import { useNavigate } from 'react-router-dom'
  import API from '../../../Service'
  
  export default function AlertDeletePesanan({ id, onClose, isOpen, statusOrder }) {
    const cancelRef = React.useRef()
    const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");
    const [isFetching, setIsFetching] = useState(false);
  
    const navigate = useNavigate();
    const toast = useToast()

  
    async function handleDelete() {
      setIsFetching(true);
      try {
        await API.deleteOrder(id);
        toast({
          title: "Delete pesanan success",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });

        onClose();
        if( statusOrder === 'masuk' ){
          navigate('/pesananmasuk')
        }else if( statusOrder === 'proses'){
          navigate('/pesananproses')
        }else if( statusOrder === 'selesai'){
          navigate('/pesananselesai')
        }
        
      } catch (error) {
        toast({
          title: "Delete pesanan failed",
          description: "Something went wrong...",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
        onClose();
      }
      setIsFetching(false);
    }
  
    return (
      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent maxW={isSmallerThanSm ? '320px' :'md' }>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Pesanan
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Apa kamu yakin? Anda tidak dapat membatalkan tindakan ini setelahnya.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  disabled={isFetching}
                  onClick={isFetching ? null : onClose}
                >
                  Batal
                </Button>
                <Button
                  colorScheme='red'
                  mr={3}
                  isLoading={isFetching}
                  type="submit"
                  ml={3}
                  onClick={handleDelete}
                >
                  Hapus
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }