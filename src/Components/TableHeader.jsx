import React from 'react'
import { CardHeader, Text} from '@chakra-ui/react'

export default function TableHeader({table_name}) {
    return (
        <CardHeader  bgColor={'cyan.400'} size='md' borderTopRadius='md' color={'white'}>
            <Text fontWeight="bold" fontSize='xl'>{table_name}</Text>
        </CardHeader>
    )
}
