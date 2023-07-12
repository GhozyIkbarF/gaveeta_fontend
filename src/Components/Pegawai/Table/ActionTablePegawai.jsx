import {
    Avatar,
    Icon,
    Button,
    Flex,
    Td,
    Text,
    Tr,
    useColorModeValue
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrashAlt, FaEye  } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { actionPegawai, IdActionPegawai, setDataEditPegawai } from "../../../Features/Pegawai";
import { rootImg } from "../../../Service/Config";

export default function ActionTablePegawai(props) {
    const { onOpen, id } = props;

    const { employes } = useSelector(state => state.pegawai)
    const dispatch = useDispatch()


    const ActionDelete = (idPegawai, action) => (e) => {
        e.preventDefault();
        dispatch(actionPegawai(action))
        dispatch(IdActionPegawai(idPegawai))
        onOpen()
    }

    const ActionUpdate = (idPegawai, action) => (e) => {
        e.preventDefault();
        const filterData = employes.filter((value) => value.id === idPegawai)
        dispatch(actionPegawai(action))
        dispatch(IdActionPegawai(idPegawai))
        dispatch(setDataEditPegawai(filterData[0]))
        onOpen()
    }


    return (
        <Flex
            direction={{ sm: "column", md: "row" }}
            justify={'center'}
            gap='3'
            fontSize={{ base:'md', lg:'lg' }}
        >
                <Icon as={FaPencilAlt} color='#8D96AA' cursor={'pointer'} onClick={ActionUpdate(id, 'edit')}/>
                <Icon as={FaTrashAlt} color='#8D96AA' cursor={'pointer'} onClick={ActionDelete(id, 'delete')}/>
        </Flex>
    );
}

