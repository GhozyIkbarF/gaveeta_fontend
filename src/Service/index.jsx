import Delete from "./Delete";
import Get from "./Get";
import Post from "./Post";
import Update from "./Update";
import { PostLogin } from "./Post";
import { sendMessage } from "./Post";
import { UpdatePhoto } from "./Update";


//Get
const getOrderCounts = () => Get('beranda');
const getAllOrderMasuk = () => Get('ordersMasuk')
const getAllOrderProses = () => Get('ordersProses')
const getAllOrderSelesai = () => Get('ordersSelesai')
const getOrderDetail = (id) => Get(`orderDetail/${id}`)
const getOrderDesign = (id) => Get(`orderDesign/${id}`)
const getNumbersOrderPerYear = (param) => Get(`numbersOrderPerYear/${param}`)
const getOrderPerMonth = (data) => Post(`orderPerMonth`, data)
const getOrderReportPerDay = (startDate, endDate) => Get(`getOrderReportPerDay/${startDate}/${endDate}`)
const getAllPegawai = () => Get('employes')
const getPegawai = (id) => Get(`employe/${id}`)
const getCompany = () => Get(`company`)
const getOrdersPerDay = (data) => Post(`getOrdersPerDay`, data)
const signOut = () => Get('logout')

//Post
const login  = (data) => PostLogin('login', data)
const addPesananMasuk  = (data) => Post('orderMasuk', data)
const addDesign  = (data) => Post('design', data)
const addModel  = (data) => Post('model', data)
const addBuktiBayar  = (data) => Post('buktiBayar', data)
const sendProgres  = (data) => sendMessage(data)

const createPegawai = (data) => Post("employe", data);

//Update
const updateOrder = (data) => Update(`updateOrder/${data.id}`, data);
const updateProgres = (data) => Update(`updateProgres/${data.id}`, data);
const updateDownPayment = (id, data) => Post(`updateDownPayment/${id}`, data);
const updateShippingCost = (data) => Update(`updateShippingCost/${data.id}`, data);
const updatePegawai = (id, data) => Post(`employe/${id}`, data)
const updateCompany = (data) => Update(`company`, data)

//Delete
const deleteOrder = (id) => Delete(`order/${id}`);
const deleteDesign = (id) => Delete(`design/${id}`);
const deleteModel = (id) => Delete(`model/${id}`);
const deleteButktiBayar = (id) => Delete(`buktiBayar/${id}`);
const deletePegawai = (id) => Delete(`employe/${id}`);


const API = {
    login,
    signOut,
    addPesananMasuk,
    addDesign,
    addModel,
    addBuktiBayar,
    createPegawai,
    sendProgres,

    getOrderCounts, 
    getAllOrderMasuk,
    getAllOrderProses,
    getAllOrderSelesai,
    getOrderDetail,
    getOrderDesign,
    getAllPegawai,
    getPegawai,
    getCompany,
    getNumbersOrderPerYear,
    getOrdersPerDay,
    getOrderPerMonth,
    getOrderReportPerDay,

    updateOrder,
    updateProgres,
    updateDownPayment,
    updateShippingCost,
    updatePegawai,
    updateCompany,

    deleteDesign,
    deleteModel,
    deleteButktiBayar,
    deleteOrder,
    deletePegawai,
}

export default API;