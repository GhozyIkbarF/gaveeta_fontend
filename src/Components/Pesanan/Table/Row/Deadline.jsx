import React from 'react'
import { Flex, Text, Tooltip } from '@chakra-ui/react'
import { AiOutlineWarning } from 'react-icons/ai';

export default function Deadline(props) {
    const { deadline } = props

    const deadlineParts = deadline.split('/');
    const formattedDeadline = `${deadlineParts[2]}/${deadlineParts[1]}/${deadlineParts[0]}`;
    const warningDeadline = new Date(formattedDeadline);
    const oneWeekBefore = new Date();
    oneWeekBefore.setDate(oneWeekBefore.getDate() + 4);
    const color = oneWeekBefore >= warningDeadline ? 'red' : 'green';

    return (
        <Flex justify='center' align='center' gap='2'>
            <Tooltip 
                hasArrow 
                label={color === 'red' ? 'mendekati deadline': 'belum mendekati deadline'} 
                bg='gray.300' 
                color='black' 
                placement='top'
            >
                <span tabIndex={0}>
                    <AiOutlineWarning 
                        color={color}
                        cursor={'pointer'} 
                    />
                </span>
            </Tooltip>
            <Text>{deadline !== null ? deadline : 'deadline belum ditentukan'}</Text>
        </Flex>

    )
}
