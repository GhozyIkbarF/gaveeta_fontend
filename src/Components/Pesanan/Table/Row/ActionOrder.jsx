import {
    Icon,
    Button,
    Flex,
    useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { useDispatch,useSelector } from "react-redux";
import { actionPesananProses, setDataDetailOrderProses, setRefreshActionOrderProses  } from "../../../../Features/Pesanan/PesananProses";

export default function ActionOrder(props) {
    const { onOpen, id } = props;

    const pathname = useLocation().pathname;

    const  {dataOrderProses } = useSelector(state => state.pesananProses)
    
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const ActionDetail =(id) => (e) => {
        e.preventDefault();
        navigate(`/pesanan_detail/${id}`)
    }


    const handleSetProgres = (id, action) => (e) => {
        e.preventDefault();
        dispatch(actionPesananProses(action))
        const filterData = dataOrderProses.filter((value) => value.id === id)[0]
        dispatch(setDataDetailOrderProses(filterData));
        dispatch(setRefreshActionOrderProses());
        onOpen()
    }


    return (
        <Flex
            direction={{ sm: "column", md: "row" }}
            justify='center'
            gap={{ base:'1', md:'2' }}
        >
             <Button
                color='white' 
                bg={"#0078FF"}
                variant="no-effects"
                p={3}
                onClick={ActionDetail(id)}
            >
                detail & aksi
            </Button>
            {pathname === '/pesanan_proses' && 
            <Button
                color='white' 
                p="3" 
                bg='gray.500'
                variant="no-effects"
                onClick={handleSetProgres(id, 'setProgres')}
            > 
                <Icon as={FaPencilAlt} me="4px" />
            </Button>
            }
        </Flex>
    );
}

