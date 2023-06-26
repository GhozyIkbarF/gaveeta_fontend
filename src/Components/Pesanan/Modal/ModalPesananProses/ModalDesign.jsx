import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Image,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';


export default function ModalDesign({ isOpen, onClose }) {
    const finalRef = React.useRef(null)
    const { designsOrderProses } = useSelector(state => state.pesananProses);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={{ sm: 'full', md:'lg'}}
                isCentered
            >
                <ModalOverlay 
                bg='blackAlpha.300'
                backdropFilter='blur(10px)'/>
                <ModalCloseButton zIndex='popover' />
                <ModalContent p='0'>
                        <Slider {...settings}>
                            {designsOrderProses.map((image, i) => (
                                <Image key={i} w='full' src={image} alt={`design ${i}`} />
                            ))}
                        </Slider>                     
               </ModalContent>
            </Modal>
        </>
    )
}
