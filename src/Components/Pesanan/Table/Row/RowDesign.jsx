import React from 'react'
import { useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Text, Avatar } from '@chakra-ui/react';
import { actionPesananProses, setDesignsOrderProses } from '../../../../Features/Pesanan/PesananProses';
import { actionPesananMasuk } from '../../../../Features/Pesanan/PesananMasuk';

export default function RowDesign(props) {
    const { link, onOpen, id } = props;
    const pathname = useLocation()
    const dispatch = useDispatch()

    const arrayLinks = [];

    if(link[0] !== undefined) {
        link.forEach(element => {
            arrayLinks.push(element.design);
        });
    }


    const ActionShowProgres = (action, designs) => (e) => {
        e.preventDefault();
        dispatch(actionPesananMasuk(action))
        dispatch(actionPesananProses(action))
        dispatch(setDesignsOrderProses(designs))
        onOpen()
    }
    
    return (
        <>
        {link[0] === undefined || link[0] === null ? 
            <Text fontWeight='medium'>Kosong</Text>
            :
            <Avatar 
                src={link[0].design  }
                w="50px" 
                borderRadius="12px" 
                cursor='pointer' 
                onClick={ActionShowProgres('design', arrayLinks)}
            />
        }
        </>
    )
}
