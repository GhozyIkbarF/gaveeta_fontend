import React from 'react'
import { Flex, Spinner } from '@chakra-ui/react'

export default function Loading() {
  return (
    <Flex
          position="absolute"
          transform="translate(-50% -50%)"
          bg="rgb(255, 255, 255, 0.7)"
          width='full'
          height="100%"
          zIndex="100"
          alignItems='center'
          justify='center'
          >
          <Spinner
            color='grey'
            size="lg" 
            />
        </Flex>
  )
}
