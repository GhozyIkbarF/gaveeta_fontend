import { Box, Text } from '@chakra-ui/react'
import React from 'react'

export default function OutRoute() {
  return (
    <Box 
      textAlign={'center'} 
      h={'full'} >
        <Text 
          fontWeight={'bold'} 
          fontSize={{ sm:'2xl', md:'4xl', lg:'6xl' }}>
            404
        </Text>
        <Text fontSize={{ sm:'sm', md:'lg', lg:'xl' }}>
            Page not found
        </Text>
    </Box>
  )
}
