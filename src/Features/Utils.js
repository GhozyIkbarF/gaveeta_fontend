import { createSlice } from "@reduxjs/toolkit";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import logoGaveeta from "../Assets/logo-gaveeta.png"
import { formatToIDR, convertToIndonesianDate } from "../validation/format";

export const username = localStorage.getItem('name');
export const userRole = localStorage.getItem('role');
const UtilsSlice = createSlice({
    name: "state",
    initialState: {
        displaySidebar: 'block'
    },
    reducers:{
        setDisplaySidebar: (state) => {
            state.displaySidebar = state.displaySidebar === 'block' ? 'none' : 'block';
        },
    },
});

export const {
    setDisplaySidebar,
} = UtilsSlice.actions;

export default UtilsSlice.reducer;

export const generatePDFLaporanPembayaran = (dataDetailOrder) => {

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
        tableContent.push(['Uang muka', ':',  formatToIDR(dataDetailOrder.payment)]);
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



export const generatePDFLaporan = ({data, company, pendapatan, paramMonth, startDate, endDate}) => {

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    })

    doc.addImage(logoGaveeta, 'PNG', 27, 15, 28, 28);
 
    doc.setFont('times', 'bold');
    doc.setFontSize(36);

    doc.text(company.name, doc.internal.pageSize.getWidth() / 4 + 6, 25, { align: 'left' });


    doc.setFont('times', 'normal');
    doc.setFontSize(11);

    const address = company.address;
    doc.text(address, doc.internal.pageSize.getWidth() / 4 + 6, 32, { align: 'left' });

    const telephone = company.phone;
    const email = company.email;
    doc.text(`Telp: ${telephone}   Email: ${email}`, doc.internal.pageSize.getWidth() / 4 + 6, 37, { align: 'left' });

    const website = company.website;
    const facebook = company.facebook;
    doc.text(`Website: ${website}   Facebook: ${facebook}`, doc.internal.pageSize.getWidth() / 4 + 6, 42, { align: 'left' });

    doc.setLineWidth(1);
    doc.line(25, 45, 185, 45);

    const monthYear = convertToIndonesianDate(paramMonth).toLowerCase().slice(2, convertToIndonesianDate(paramMonth).length)
    if(paramMonth.length !== 0){
        doc.text(`Data pesanan bulan ${monthYear} `, doc.internal.pageSize.getWidth() / 2, 53, { align: 'center' });
    }else{
        doc.text(`Data pesanan ${convertToIndonesianDate(startDate)} sampai ${convertToIndonesianDate(endDate)} `, doc.internal.pageSize.getWidth() / 2, 53, { align: 'center' });
    }

    const headers = [['No', 'Nama', 'No.Hp', 'Deskripsi', 'Jumlah', 'Harga peritem', 'Total pembayaran']];
    const dataTable = [];

    if (data.length > 0) {
        data.forEach((element, index) => {
            dataTable.push(
                [index + 1, element.name, element.phone, element.description, element.quantity, formatToIDR(element.pricePerItem), formatToIDR(element.payment)],
            )
        })
        dataTable.push(['', '', '', '', '', '', formatToIDR(pendapatan)])
    }

    const tableConfig = {
        head: headers,
        body: dataTable,
        startY: 58,
        styles: {
            halign: 'center',
            font: 'times',
            fontSize: 10,
        },
        headStyles: {
            fillColor: '#000000',
            color: '#ffffff',
        }
    };

    doc.autoTable(tableConfig);
    window.open(doc.output('bloburl'))
};