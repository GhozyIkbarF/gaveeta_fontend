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
import React from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeDataPegawai } from '../../Features/Pegawai'
import API from '../../Service'

export default function AlertDeletePegawai({ onClose, isOpen }) {
  const cancelRef = React.useRef()
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast()

  const { IdAction } = useSelector(state => state.pegawai)

  async function handleDelete() {
    setIsFetching(true);
    try {
      await API.deletePegawai(IdAction);
      toast({
        title: "Delete Pegawai success",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
      onClose();
      dispatch(changeDataPegawai())
    } catch (error) {
      toast({
        title: "Delete Pegawai failed",
        description: "Something went wrong...",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
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
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Pegawai
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
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                colorScheme='red'
                mr={3}
                isLoading={isFetching}
                type="submit"
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}