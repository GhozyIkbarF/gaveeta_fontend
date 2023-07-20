import {
    Modal,
    ModalOverlay,
    ModalContent,
    Button,
    useColorModeValue
} from '@chakra-ui/react'
import { useMediaQuery } from "@chakra-ui/react";
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector, } from 'react-redux';
import { setActionDetailOrder } from '../../../../Features/Pesanan/PesananDetail';
import { formatToIDR, convertToIndonesianDate } from '../../../../validation/format';
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import logoGaveeta from '../../../../Assets/logo-gaveeta.png'
import { useReactToPrint } from 'react-to-print';
import Invoice from '../Invoice';


export default function ModalActionDetail({ isOpen, onOpen, onClose, status }) {
    const initialRef = React.useRef(null)
    const componentRef = useRef();
    const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");
    const { dataDetailOrder } = useSelector(state => state.pesananDetail)

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
    // const Invoice = () => {
    //     navigate(`/pesananmasuk_invoice/${dataDetailOrder.id}`);
    // };

    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    //     documentTitle: 'invoice',
    //     pageStyle: 'print',
    // });


    const generatePDF = (dataDetailOrder) => {

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        doc.addImage(logoGaveeta, 'PNG', 27, 15, 28, 28);
        doc.setFont('times', 'bold');
        doc.setFontSize(36);

        doc.text(`${dataDetailOrder.company.name}`, doc.internal.pageSize.getWidth() / 4 + 6, 25, { align: 'left' });

        doc.setFont('times', 'normal');
        doc.setFontSize(11);

        const address = dataDetailOrder.company.address;
        doc.text(address, doc.internal.pageSize.getWidth() / 4 + 6, 32, { align: 'left' });

        const telephone = dataDetailOrder.company.phone;
        const email = dataDetailOrder.company.email
        doc.text(`Telp: ${telephone}   Email: ${email}`, doc.internal.pageSize.getWidth() / 4 + 6, 37, { align: 'left' });

        const website = dataDetailOrder.company.website;
        const facebook = dataDetailOrder.company.facebook;
        doc.text(`Website: ${website}   Facebook: ${facebook}`, doc.internal.pageSize.getWidth() / 4 + 6, 42, { align: 'left' });

        doc.setLineWidth(1);
        doc.line(25, 45, 185, 45);

        doc.setFont('times', 'bold');
        doc.setFontSize(14);
        doc.text('Data pesanan:', doc.internal.pageSize.getWidth() / 2, 52, { align: 'center' });


        doc.setFont('times', 'normal');
        doc.setFontSize(12);

        const totalBiaya = dataDetailOrder.quantity * dataDetailOrder.pricePerItem;
        let tableContent = [
            ['Kode pesanan', ':', dataDetailOrder.id],
            ['Nama', ':', dataDetailOrder.name],
            ['No. Hp', ':', dataDetailOrder.phone],
            ['Alamat', ':', dataDetailOrder.address],
            ['Deskripsi', ':', dataDetailOrder.description ? dataDetailOrder.description : 'deskripsi kosong'],
            ['Jumlah', ':', dataDetailOrder.quantity ? `${dataDetailOrder.quantity} pcs` : 0],
        ];

        if (dataDetailOrder.status === 'selesai') {
                tableContent.push(['Harga peritem', ':', dataDetailOrder.pricePerItem ? formatToIDR(dataDetailOrder.pricePerItem) : 'harga peritem belum ditentukan']);
                tableContent.push(['Ongkos kirim', ':', formatToIDR(dataDetailOrder.shippingCost)]);
                tableContent.push(['Total biaya', ':', totalBiaya !== null && totalBiaya > 0 ? formatToIDR(totalBiaya + parseInt(dataDetailOrder.shippingCost)) : 'total biaya belum ditentukan']);
                tableContent.push(['Keterangan', ':', 'Lunas']);
            } else {
                tableContent.push(['Harga peritem', ':', dataDetailOrder.pricePerItem ? formatToIDR(dataDetailOrder.pricePerItem) : 'harga peritem belum ditentukan']);
                tableContent.push(['Total biaya', ':', totalBiaya !== null && totalBiaya > 0 ? formatToIDR(totalBiaya) : 'total biaya belum ditentukan']);
                tableContent.push(['Deadline', ':', dataDetailOrder.deadline ? convertToIndonesianDate(dataDetailOrder.deadline) : 'deadline belum ditentukan']);
                tableContent.push(['Keterangan', ':', 'Total biaya belum termasuk ongkos kirim']);
        }

        doc.autoTable({
            body: tableContent,
            head: false,
            styles: {
                cellPadding: 2,
                font: 'times',
                fontSize: 12,
            },
            columnStyles: {
                0: { cellWidth: 30, fontWeight: 'bold' },
                1: { cellWidth: 5 },
                2: { cellWidth: 125, halign: 'left' },
            },
            startY: 57,
            margin: { left: 25, }
        });

        window.open(doc.output('bloburl'))
    };


    const handlePDF = () => {
        generatePDF(dataDetailOrder)
        onClose()
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
                    <Button
                        py='6'
                        borderRadius="0"
                        fontWeight='bold'
                        borderBottom='1px'
                        variant="no-effects"
                        onClick={handleProses}
                    >
                        Proses pesanan
                    </Button>
                ) : status === 'proses' ? (
                    <Button
                        py='6'
                        borderRadius="0"
                        fontWeight='bold'
                        borderBottom='1px'
                        variant="no-effects"
                        onClick={handleProses}
                    >
                        Pesanan selesai
                    </Button>
                ) : null}
                {status === 'proses' ?
                    <Button
                        py='6'
                        borderRadius="0"
                        fontWeight='bold'
                        borderBottom='1px'
                        variant="no-effects"
                        onClick={handleLihatUangMuka}
                    >
                        Lihat uang muka
                    </Button> : null
                }
                {status === 'proses' ?
                    <Button
                        py='6'
                        borderRadius="0"
                        fontWeight='bold'
                        borderBottom='1px'
                        variant="no-effects"
                        onClick={handleBiayaOngkir}
                    >
                        Tentukan biaya ongkir
                    </Button> : null
                }
                {status !== 'masuk' ?
                    <Button
                        py='6'
                        borderRadius="0"
                        fontWeight='bold'
                        borderBottom='1px'
                        variant="no-effects"
                        onClick={handlePDF}
                    >
                        Cetak laporan
                    </Button> : null
                }
                {status === 'masuk' || status === 'proses' ?
                   <Invoice/> : null
                }
                <Button
                    py='6'
                    borderRadius="0"
                    borderBottom={'1px'}
                    fontWeight='bold'
                    variant="no-effects"
                    onClick={handleDelete}
                >
                    Hapus pesanan
                </Button>
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


