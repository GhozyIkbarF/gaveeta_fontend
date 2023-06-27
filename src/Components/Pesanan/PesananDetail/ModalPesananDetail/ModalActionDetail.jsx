import {
    Modal,
    ModalOverlay,
    ModalContent,
    Button,
} from '@chakra-ui/react'
import { useMediaQuery } from "@chakra-ui/react";
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setActionDetailOrder } from '../../../../Features/Pesanan/PesananDetail';
import { formatToIDR, convertToIndonesianDate } from '../../../../validation/format';
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import logoGaveeta from '../../../../Assets/logo-gaveeta.png'



export default function ModalActionDetail({ isOpen, onOpen, onClose, status }) {
    const initialRef = React.useRef(null)
    const [isSmallerThanSm] = useMediaQuery("(max-width: 640px)");
    const { dataDetailOrder } = useSelector(state => state.pesananDetail)
    console.log(dataDetailOrder);

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

    const generatePDF = (value) => {

        // Create a new jsPDF instance
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        doc.addImage(logoGaveeta, 'PNG', 27, 15, 28, 28);
        // Set font styles
        doc.setFont('times', 'bold');
        doc.setFontSize(36);

        // Add institution name
        doc.text(`${dataDetailOrder.company.name}`, doc.internal.pageSize.getWidth() / 4 + 6, 25, { align: 'left' });

        // Set font styles for address, telephone, email, website
        doc.setFont('times', 'normal');
        doc.setFontSize(11);

        // Add address
        const address = dataDetailOrder.company.address;
        doc.text(address, doc.internal.pageSize.getWidth() / 4 + 6, 32, { align: 'left' });

        // Add telephone and email
        const telephone = dataDetailOrder.company.phone;
        const email = dataDetailOrder.company.email
        doc.text(`Telp: ${telephone}   Email: ${email}`, doc.internal.pageSize.getWidth() / 4 + 6, 37, { align: 'left' });

        // Add website and Facebook
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


        const totalBiaya = value.quantity * value.pricePerItem;

        const tableContent = [
            ['Nama', ':', value.name],
            ['No. Hp', ':', value.phone],
            ['Alamat', ':', value.address],
            ['Deskripsi', ':', value.description ? value.description : 'deskripsi kosong'],
            ['Jumlah', ':', value.quantity ? `${value.quantity} pcs` : 0],
            ['Deadline', ':', value.deadline ? convertToIndonesianDate(value.deadline) : 'deadline belum ditentukan'],
            ['Harga peritem', ':', value.pricePerItem ? formatToIDR(value.pricePerItem) : 'harga peritem belum ditentukan'],
        ];

        if (dataDetailOrder.status !== 'selesai') {
            if (dataDetailOrder.shippingCost == null) {
                tableContent.push(['Uang muka', ':', value.payment ? formatToIDR(value.payment) : 0]);
                tableContent.push(['Total biaya', ':', totalBiaya !== null && totalBiaya > 0 ? formatToIDR(totalBiaya) : 'total biaya belum ditentukan']);
                tableContent.push(['Keterangan', ':', 'total biaya belum termasuk ongkos kirim']);
            } else if (dataDetailOrder.shippingCost === 0) {
                tableContent.push(['Uang muka', ':', value.payment ? formatToIDR(value.payment) : 0]);
                tableContent.push(['Ongkos kirim', ':', 'Gratis']);
                tableContent.push(['Total biaya', ':', totalBiaya !== null && totalBiaya > 0 ? formatToIDR(totalBiaya) : 'total biaya belum ditentukan']);
                tableContent.push(['Keterangan', ':', 'total biaya sudah termasuk ongkos kirim']);
            } else if (dataDetailOrder.shippingCost > 0) {
                tableContent.push(['Uang muka', ':', value.payment ? formatToIDR(value.payment) : 0]);
                tableContent.push(['Ongkos kirim', ':', formatToIDR(dataDetailOrder.shippingCost)]);
                tableContent.push(['Total biaya', ':', totalBiaya !== null && totalBiaya > 0 ? formatToIDR(totalBiaya + dataDetailOrder.shippingCost) : 'total biaya belum ditentukan']);
                tableContent.push(['Keterangan', ':', 'total biaya sudah termasuk ongkos kirim']);
            }
        } else {
            if (dataDetailOrder.shippingCost == null) {
                tableContent.push(['Total biaya', ':', totalBiaya !== null && totalBiaya > 0 ? formatToIDR(totalBiaya) : 'total biaya belum ditentukan']);
                tableContent.push(['Keterangan', ':', 'total biaya belum termasuk ongkos kirim']);
            } else if (dataDetailOrder.shippingCost === 0) {
                tableContent.push(['Ongkos kirim', ':', 'Gratis']);
                tableContent.push(['Total biaya', ':', totalBiaya !== null && totalBiaya > 0 ? formatToIDR(totalBiaya) : 'total biaya belum ditentukan']);
                tableContent.push(['Keterangan', ':', 'lunas']);
            } else if (dataDetailOrder.shippingCost > 0) {
                tableContent.push(['Ongkos kirim', ':', formatToIDR(dataDetailOrder.shippingCost)]);
                tableContent.push(['Total biaya', ':', totalBiaya !== null && totalBiaya > 0 ? formatToIDR(totalBiaya + dataDetailOrder.shippingCost) : 'total biaya belum ditentukan']);
                tableContent.push(['Keterangan', ':', 'lunas']);
            }
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

        // Save the PDF with a file name
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
            <ModalContent maxW={isSmallerThanSm ? '260px' : 'md'}>
                {status === 'masuk' ? (
                    <Button
                        py='6'
                        borderRadius="0"
                        fontWeight='bold'
                        borderBottom='1px'
                        variant="no-effects"
                        onClick={handleProses}
                    >
                        proses pesanan
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
                        Print laporan
                    </Button> : null
                }
                <Button
                    py='6'
                    borderRadius="0"
                    fontWeight='bold'
                    variant="no-effects"
                    onClick={handleDelete}
                >
                    Delete pesanan
                </Button>
                <Button
                    py='6'
                    borderTop='1px'
                    borderColor='black'
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


