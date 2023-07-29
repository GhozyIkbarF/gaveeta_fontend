import React from 'react'
import { FormLabel, Text, Button, Input, Image } from '@chakra-ui/react';
import { MdInsertPhoto } from "react-icons/md";
import { useForm } from "react-hook-form";

const InputImage = ({ inputId, registerName, inputName }) => {
  return (
    <FormLabel
      py='2'
      htmlFor={inputId}
      w='full'
      bg='green.500'
      cursor='pointer'
      borderColor='white'
      borderRadius='lg'
      display='flex'
      alignItems='center'
      justifyContent='center'
      color='white'
    >
      <MdInsertPhoto />
      <Input
        {...registerName}
        type="file"
        id={inputId}
        w='full'
        className='hidden'
        accept="image/*"
      />
      <Text fontWeight='bold'>{inputName}</Text>
    </FormLabel>
  )
}

export default InputImage;


export const ReviewImage = ({ alt, src }) => {
  return (
    <Image
      borderRadius='lg'
      h='auto'
      w='full'
      objectFit='cover'
      src={URL.createObjectURL(src)}
      alt={alt}
    />
  )
}

export const ButtonRemoveImage = ({image, handle}) => {
  return (
    <Button
      onClick={handle}
      color='white'
      w='full'
      cursor='pointer'
      mt='1'
      p='15'
      colorScheme="red"
    >
      Hapus {image}
    </Button>
  )
}