import React, { useState, useEffect } from 'react'
import { useDispatch } from "react-redux";
import { Box } from '@chakra-ui/react';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { actionPesananProses } from '../../../../Features/Pesanan/PesananProses';

export default function RowProgres(props) {
    const { id, quantity, progres } = props;
    const [progresValue, setProgresValue] = useState(0);
    const dispatch = useDispatch()

    useEffect(() => {
        const interval = setInterval(() => {
          setProgresValue(Math.floor((progres / quantity) * 100));
        }, 500);
        return () => clearInterval(interval);
      });

    const ActionShowProgres = ({action}) => (e) => {
        e.preventDefault();
        dispatch(actionPesananProses(action))
    }
    return (
        <Box cursor='pointer' onClick={ActionShowProgres(id, 'progres')}>
            <CircularProgress value={progresValue} color='green.400'>
                {/* <CircularProgressLabel >{progresValue === null || progresValue < 1 ? `0%` : `${progresValue}%`}</CircularProgressLabel> */}
                <CircularProgressLabel >{progresValue === null || progresValue < 1 ? `0/${quantity}` : `${progres}/${quantity}`}</CircularProgressLabel>
            </CircularProgress>
        </Box>
    )
}
