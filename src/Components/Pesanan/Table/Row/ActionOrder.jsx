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
    const textColor = useColorModeValue("gray.500", "white");

    const pathname = useLocation().pathname;

    const  {dataOrderProses } = useSelector(state => state.pesananProses)
    
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const ActionDetail =(id) => (e) => {
        e.preventDefault();
        navigate(`/pesananproses_detail/${id}`)
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
                p="3"
                bg={"blue.400"}
                variant="no-effects"
                onClick={ActionDetail(id)}
            >
                {/* <Icon as={FaEye} me="4px" /> */}
                detail and action
            </Button>
            {pathname === '/pesanan_proses' && 
            <Button
                color='white' 
                p="3" 
                bg={textColor}
                variant="no-effects"
                onClick={handleSetProgres(id, 'setProgres')}
            > 
                <Icon as={FaPencilAlt} me="4px" />
            </Button>
            }
            {/* {pathname === '/pesanan_selesai' && 
            } */}
        </Flex>
    );
}

