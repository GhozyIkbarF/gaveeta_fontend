import React, { useEffect, useState } from 'react'

import {
  assignRef,
  Box,
  chakra,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import { BsFillClipboardFill, BsWrenchAdjustable } from "react-icons/bs";
import { FiServer } from 'react-icons/fi';
import { FaMoneyCheckAlt } from 'react-icons/fa'
import {
  FaShoppingCart,
  faPliers,
  FaCheck 
} from 'react-icons/fa';
// import { GiPliers } from 'react-icons/gi';
import API from '../Service';

function StatsCard(props) {
  const { title, stat, icon } = props;


  return (
    <Stat
      bgColor='white'
      px={{ base: 2, md: 4 }}
      py={'5'}
      rounded={'lg'}
      border='1px'>
      <Flex justifyContent={'space-between'} borderBottom='1px'>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          mr="2"
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}>
          {icon}
        </Box>
      </Flex>
      {/* <Flex>
        Lihat
      </Flex> */}
    </Stat>
  );
}

export default function BasicStatistics() {
  const [data, setData] = useState([]);

  const getOrderCount = async () => {
    const res = await API.getOrderCounts();
    setData(res.data);
    console.log(res.data);
    // dispatch(setDataOrder(res.data));
  };

  useEffect(() => {
    getOrderCount();
  },[])
  return (
    <Box w={{ base: 'full', md: '95%', lg:'70%' }} mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard
          title={'Total order masuk'}
          stat={data.masuk}
          icon={<FaShoppingCart size={'2.5em'} />}
        />
        <StatsCard
          title={'Total order proses'}
          stat={data.proses}
          icon={<FaCheck size={'2.5em'} />}
        />
        <StatsCard       
          title={'Order bulan ini'}
          stat={data.orderThisMonth}
          icon={<BsFillClipboardFill size={'2.5em'} />}
        />
      </SimpleGrid>
    </Box>
  );
}