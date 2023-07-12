import {
    Button,
    Flex,
} from "@chakra-ui/react";
import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
        if(pathname === '/pesananmasuk'){
            navigate(`/pesananmasuk_detail/${id}`)
        }else if(pathname === '/pesananproses'){
            navigate(`/pesananproses_detail/${id}`)
        }else if(pathname === '/pesananselesai'){
            navigate(`/pesananselesai_detail/${id}`)
        }
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
                colorScheme="gray"
                p={3}
                onClick={ActionDetail(id)}
            >
                Detail
            </Button>
            {pathname === '/pesanan_proses' && 
            <Button
                colorScheme='green' 
                color={'white'}
                p="3" 
                onClick={handleSetProgres(id, 'setProgres')}
            > 
                Progres
            </Button>
            }
        </Flex>
    );
}

