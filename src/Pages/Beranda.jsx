import React, { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto';
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Select,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { BsFillClipboardFill } from "react-icons/bs";
import { 
  NumberInput, 
  NumberInputField, 
  NumberInputStepper, 
  NumberIncrementStepper, 
  NumberDecrementStepper 
} from "@chakra-ui/react";
import {
  FaShoppingCart,
  FaCheck
} from 'react-icons/fa';
import Loading from '../Components/Loading';
import API from '../Service';
import { formatDateDMY, getDateToday, formatToIDR } from '../validation/format';
import { Link } from 'react-router-dom';

export default function Beranda() {
  const [data, setData] = useState([]);
  const [ordersByMonth, setOrdersByMonth] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rangeTrafics, setRangeTrafics] = useState('January - December');
  const [selectDataChart, setSelectDataChart] = useState('Year');
  const [isDisabled, setIsDisabled] = useState(true);
  const [inputDateEndValue, setInputDateEndValue] = useState('')
  const [inputDateStartValue, setInputStartEndValue] = useState('2022-01-01')
  const [displayButton, setDisplayButton] = useState(false);

  console.log(data);

  const toast = useToast();

  const dateToday = getDateToday();
  const currentDate = new Date();
  const this_year = currentDate.getFullYear();
  const [value, setValue] = useState(this_year);
  const [year, setYear] = useState(this_year);

  const getOrderCount = async () => {
    try{
      const res = await API.getOrderCounts();
      setData(res.data);
      setOrdersByMonth(res.data.orderByMonth)
    }catch(err){
      toast({
        title: "Get data failed",
        description: "Something went wrong...",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
    setTimeout(() => {
      setLoading(false)
    }, [500])
  };

  const handleChange = (value) => {
    setValue(value);
  };

  const handleSelectDataChart = (e) => {
    setSelectDataChart(e.target.value)
    if (e.target.value === 'Year'){
      setIsDisabled(true);
      setInputStartEndValue('2022-01-01');
      setInputDateEndValue('')
    }
  }
  
  const handleChangeInputDateStart = (e) => {
    setInputStartEndValue(e.target.value)
    setInputDateEndValue('')
    setIsDisabled(false)
  }
  
  const getNumbersOrderPerYear = async (data) => {
    const res = await API.getNumbersOrderPerYear(data);
    setOrdersByMonth(res.data.orderByMonth)
    setYear(data)
    setRangeTrafics(`Januari - Desember ${data}`)
  };
  
  const getOrdersPerDay = async () => {
    const formData = new FormData();
    formData.append('startDate', inputDateStartValue)
    formData.append('endDate', inputDateEndValue)
    const res = await API.getOrdersPerDay(formData);
    if(res){
      setOrdersByMonth(res.data)
      setRangeTrafics(`${formatDateDMY(inputDateStartValue)} - ${formatDateDMY(inputDateEndValue)}`)
      setInputDateEndValue('')
      setDisplayButton(false)
    }
  };
  
  useEffect(() => {
    setDisplayButton(false)
    window.scrollTo(0, 0);
    setLoading(true)
    getOrderCount();
    setRangeTrafics(`Januari - Desember ${this_year}`)
  }, [])

  const handleDisplayButton = () => {
    if (year !== this_year || Number(value) !== Number(year)) {
      setDisplayButton(true)
    } else {
      setDisplayButton(false)
    }
  }

  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    let delayed;
    let label;
    if(selectDataChart === 'Year'){
      label = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
    }else{
      label = ordersByMonth.map(value => value.label)
    }
    const value = ordersByMonth.map(value => value.total_amount)
    const ctx = chartContainer.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: label,
        datasets: [
          {
            label: 'jumlah order',
            data: value,
            backgroundColor: [
              'rgba(201, 203, 207, 0.7)',
              'rgba(255, 26, 104, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(50, 50, 50, 0.7)',
              'rgba(93, 190, 90, 0.7)',
              'rgba(40, 90, 190, 0.7)',
              'rgba(255, 255, 50, 0.7)',
              'rgba(255, 26, 50, 0.7)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        interaction: {
          intersect: false,
          axis: 'x',
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chartInstance.current.destroy();
    };
  }, [ordersByMonth])

  const dataStateCard = [
    {title:'Pesanan masuk', stat:data.masuk, icon:FaShoppingCart ,url:'/pesananmasuk' },
    {title:'Pesanan proses', stat:data.proses, icon:FaCheck ,url:'/pesananproses' },
    {title:'Pesanan selesai', stat:data.selesai, icon:BsFillClipboardFill ,url:'/pesananselesai' },
    // {title: 'pendapatan Total', stat:formatToIDR(data.pendapatanTotal), icon:BsFillClipboardFill}
  ]

  return (
    <>
      {loading && <Loading />}
      <Box position="relative" w='full'>

        <Box 
          position="relative" 
          w={{ base: 'full', md: '95%', lg: '72.5%' }} 
          mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}
        >
          <SimpleGrid 
            columns={{ base: 1, md: 3 }} 
            spacing={5}
            >
            {dataStateCard?.map((value, i) => {
              return (
                <StatsCard
                 key={i}
                  title={value.title}
                  stat={value.stat}
                  icon={value.icon}
                  url={value.url}
                />
              )
            })}
          </SimpleGrid>
        </Box>

        <Flex 
          w='full' 
          flexDir={'column'} 
          justifyContent='center' 
          alignItems='center' 
          my={10}
        >
          <Flex
            flexDir='column'
            w={{ base: 'full', md: '95%', lg: '70%' }}
            justifyContent='center'
            alignItems='center'
            borderRadius='lg'
            boxShadow='md'
            bg={useColorModeValue('white', '#1E2023')}
            color={useColorModeValue('black', 'white')}
          >
            <Flex 
              w='full' 
              flexDir={{ sm: 'column', md: 'row' }} 
              justifyContent='space-between' 
              pt='5' 
              px='4'
              bg={'transparent'}
            >
              <Flex flexDir='column'>
                <Text 
                  fontWeight='bold' 
                  fontSize='lg'>
                  Traffic
                </Text>
                <Text 
                  fontSize="sm" 
                  color="gray.400" 
                  fontWeight="normal">
                  {rangeTrafics}
                </Text>
              </Flex>
              <Flex 
                gap='1' 
                align={'center'} 
                overflowY={'scroll'}
              >
                <Select 
                  minW={'85px'} 
                  maxW={'95px'} 
                  value={selectDataChart} 
                  onChange={(e) => { 
                    handleSelectDataChart(e); 
                    if(e.target.value === 'Year'){
                      setDisplayButton(true);
                    } else {
                      setDisplayButton(false);
                    }
                  }}
                >
                  <option value='Year'>Tahun</option>
                  <option value='Day'>Hari</option>
                </Select>
                {selectDataChart === 'Day' ?
                  <Flex gap={1} align={'center'}>
                    <Input 
                      type="date" 
                      id="myDate" 
                      name="inputDateStart" 
                      min="2022-01-01" 
                      max={dateToday}
                      onChange={(e) => {
                        handleChangeInputDateStart(e);
                        setDisplayButton(false);
                      }} />
                    <Text>-</Text>
                    <Input 
                      type="date" 
                      id="myDate" 
                      name="inputDateEnd" 
                      value={inputDateEndValue}
                      min={inputDateStartValue} 
                      max={dateToday} 
                      isDisabled={isDisabled}
                      onChange={(e) => {
                        setInputDateEndValue(e.target.value);
                        setDisplayButton(true);
                      }}
                       />
                      {displayButton ? 
                      <Button
                        bg='black'
                        color='white'
                        onClick={getOrdersPerDay}
                      >
                        Cari
                      </Button>: null}
                  </Flex> :
                  <Flex gap={1}>
                    <NumberInput 
                      value={value} 
                      min={2022}
                      max={this_year}
                      onChange={handleChange} 
                      size="md" 
                      h='max' 
                      allowMouseWheel
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper onClick={handleDisplayButton} />
                        <NumberDecrementStepper onClick={handleDisplayButton} />
                      </NumberInputStepper>
                    </NumberInput>
                    {displayButton ?
                      <Button
                        bg='black'
                        color='white'
                        onClick={() => getNumbersOrderPerYear(value)}>
                        Cari
                      </Button>: null
                    }
                  </Flex>
                }
              </Flex>
            </Flex>
            <canvas
              className='p-4'
              ref={chartContainer}
            />
          </Flex>
         
        </Flex>

      </Box>
    </>
  )
}

const StatsCard = ({ title, stat, icon, url }) => {
  return (
    <Link to={url}>
      <Stat
        px={{ base: 2, md: 4 }}
        py={'5'}
        rounded={'lg'}
        boxShadow='md'
        bg={useColorModeValue('white', '#1E2023')}
        transition="all 0.2s ease-in-out"
        _hover={{
          transform: "scale(0.9)",
        }}
      >
        <Flex 
          justifyContent={'space-between'} 
          borderBottom='1px' _hover={{
        }}>
          <Box pl={{ base: 2, md: 4 }}>
            <StatLabel 
              fontWeight={'medium'} 
              isTruncated>
              {title}
            </StatLabel>
            <StatNumber 
              fontSize={'2xl'} 
              fontWeight={'medium'}>
              {stat}
            </StatNumber>
          </Box>
          <Box
            id="my-element"
            mr="2"
            my={'auto'}
            alignContent={'center'}>
            <Icon fontSize={'5xl'} as={icon} />
          </Box>
        </Flex>
      </Stat>
    </Link>
  );
}