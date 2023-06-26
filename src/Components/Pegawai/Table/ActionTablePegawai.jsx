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
    const textColor = useColorModeValue("gray.500", "white");
    // const titleColor = useColorModeValue("gray.700", "white");
    // const borderColor = useColorModeValue("gray.200", "gray.600");

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
        console.log(filterData[0]);
        dispatch(actionPegawai(action))
        dispatch(IdActionPegawai(idPegawai))
        dispatch(setDataEditPegawai(filterData[0]))
        onOpen()
    }


    return (
        <Flex
            direction={{ sm: "column", md: "row" }}
            align="flex-start"
            gap='2'
        >
            <Button
                color='white'
                bg={"blue.400"}
                variant="no-effects"
                onClick={ActionUpdate(id, 'edit')}
            >
                <Icon as={FaEye} />
            </Button>
            <Button
                color='white'
                bg={textColor}
                variant="no-effects"
                onClick={ActionUpdate(id, 'edit')}
            >
                <Icon as={FaPencilAlt} />
            </Button>
            <Button
                color='white'
                bg="red.500"
                variant="no-effects"
                mb={{ sm: "10px", md: "0px" }}
                onClick={ActionDelete(id, 'delete')}
            >
                <Icon as={FaTrashAlt} />
            </Button>
        </Flex>
    );
}

