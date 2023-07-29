import {
    Modal,
    ModalOverlay,
    ModalContent,
    Button,
    useColorModeValue
} from '@chakra-ui/react'
import { useMediaQuery } from "@chakra-ui/react";
import React from 'react'
import { useDispatch, useSelector, } from 'react-redux';
import { setActionDetailOrder } from '../../../../Features/Pesanan/PesananDetail';
import { generatePDFLaporanPembayaran } from '../../../../Features/Utils';
import Invoice from '../Invoice';


export default function ModalActionDetail({ isOpen, onOpen, onClose, status }) {
    const initialRef = React.useRef(null)
    const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");
    const { dataDetailOrder } = useSelector(state => state.pesananDetail)

    const dispatch = useDispatch();

    const handleProses = () => {
        onClose();
        dispatch(setActionDetailOrder('proses'));
        onOpen();
    };

    const handleLihatUangMuka = () => {
        onClose();
        dispatch(setActionDetailOrder('lihatDP'));
        onOpen();
    }
    const handleBiayaOngkir = () => {
        onClose();
        dispatch(setActionDetailOrder('ongkir'));
        onOpen();
    }

    const handleDelete = () => {
        onClose();
        dispatch(setActionDetailOrder("delete"));
        onOpen();
    };

    const handlePDF = () => {
        generatePDFLaporanPembayaran(dataDetailOrder)
        onClose()
    }

    const MenuButton = ({action, handle}) => {
        return (
            <Button
                py='6'
                borderRadius="0"
                fontWeight='bold'
                borderBottom='1px'
                variant="no-effects"
                onClick={handle}
            >
                {action}
            </Button>
        )
    }

    return (
        <Modal
            initialFocusRef={initialRef}
            scrollBehavior={'outside'}
            isOpen={isOpen}
            onClose={onClose}
            isCentered
        >
            <ModalOverlay />
            <ModalContent maxW={isSmallerThanSm ? '260px' : 'md'} bg={useColorModeValue('white', '#1E2023')}>
                {status === 'masuk' ? (
                    <MenuButton handle={handleProses} action={'Proses pesanan'}/>
                ) : status === 'proses' ? (
                    <MenuButton handle={handleProses} action={'Pesanan selesai'}/>
                ) : null}
                {status === 'proses' ? <MenuButton handle={handleLihatUangMuka} action={'Lihat uang muka'}/> : null}
                {status === 'proses' ? <MenuButton handle={handleBiayaOngkir} action={'Tentukan biaya ongkir'}/> : null}
                {status !== 'masuk' ? <MenuButton handle={handlePDF} action={'Cetak laporan'}/> : null}
                {status === 'masuk' || status === 'proses' ?<Invoice /> : null}
                <MenuButton handle={handleDelete} action={'Hapus pesanan'}/>
                <Button
                    py='6'
                    borderRadius="0"
                    variant="no-effects"
                    color='red.500'
                    onClick={onClose}
                >
                    Batal
                </Button>
            </ModalContent>
        </Modal>
    )
}


