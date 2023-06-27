import React from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Collapse,
  useToast
} from '@chakra-ui/react';
import {
  FiMenu,
  FiChevronDown,
} from 'react-icons/fi';
// import { FaChartBar, MdReport, IoIosPie } from 'react-icons/all';
import { BsFillFileTextFill } from 'react-icons/bs';
import {
  FaHome,
  FaShoppingCart,
  FaFolder,
  FaUsers,
  FaCog,
  FaChartBar
} from 'react-icons/fa';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../Service';




export default function SidebarWithHeader({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toast = useToast()

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (accessToken == null) {
      navigate('/');
    }
  }, [])


  async function handleLogout() {
    try {
      const res = await API.signOut();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      toast({
        title: "Sign out success",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      navigate('/')
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Something went wrong...",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')} 
  >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', xl: 'block' }}
        pathname={pathname}
      />
      <Drawer
        transition="3s ease"
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
        onClick={onClose}

      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent onClose={onClose} pathname={pathname} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} handleLogout={handleLogout} />
      <Box position='relative' px='5' ml={{ base: 0, xl: 60 }} bg='gray.460' minH="100vh" display="flex" flexDirection="column">
        {children}
      </Box>
    </Box>
  );
}


const SidebarContent = ({ onClose, ...rest }) => {
  const [orderAddress, setOrderAddress] = useState('');
  const { pathname } = useLocation();
  let address = pathname.match(/pesanan/i)

  useEffect(() => {
    if(address != null){
      setOrderAddress(address[0])
    }else{
      setOrderAddress('')
    }
  },[pathname])
  
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(prevState => !prevState);
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRightWidth="1px"
      w={{ base: 'full', xl: 60 }}
      pos="fixed"
      h="full"
      py={4}
      bgColor='white'
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between" gap='2'>
        <Text fontSize={{ base: 'xl', xl: '2xl' }} fontFamily="monospace" fontWeight="bold" color='blue.500' w='full'>
          Gaveeta Packaging
        </Text>
        <CloseButton display={{ base: 'flex', xl: 'none' }} onClick={onClose} />
      </Flex>
      <Flex flexDirection='column' mt='5' gap='2'>
        <NavLink to='/dashboard'>
          <Flex onClick={onClose} alignItems="center" p="4" mx="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: `${pathname === '/dashboard' ? 'blue.500' : 'blue.200'}`, color: 'white', }} bg={pathname === '/dashboard' ? 'blue.500' : ''} color={pathname === '/dashboard' ? 'white' : ''}
            {...rest}>
            <Icon mr="4" mb='1' fontSize="16" _groupHover={{ color: 'white', }} as={FaHome} />
            Dashboard
          </Flex>
        </NavLink>
        <NavLink>
          <Flex flexDirection='column' p="4" mx="4" gap='7' borderRadius="lg" cursor="pointer" onClick={handleToggle} _hover={{ bg: `${orderAddress === 'pesanan' ? 'blue.500' : 'blue.200'}`, color: 'white', }} bg={orderAddress === 'pesanan' ? 'blue.500' : ''} color={orderAddress === 'pesanan' ? 'white' : ''} >
            <Flex flexDirection='row' justifyContent='space-between'>
              <Flex>
                <Icon mr="4" mt='1' fontSize="16" _groupHover={{ color: 'white', }} as={FaShoppingCart} /> <Text>Pesanan</Text>
              </Flex>
              <Icon mt='1.5' fontSize="16" _groupHover={{ color: 'white', }} as={isOpen ? FaAngleUp : FaAngleDown} />
            </Flex>
            <Collapse in={isOpen} animateOpacity>
              <Flex flexDirection='column' align='center' gap='2' w='full'>
                  <NavLink to="/pesanan_masuk" className='w-full'>
                    <Flex onClick={onClose} w='full' mr='6' pl='7' py='2' borderRadius="lg" _hover={{ bg:'blue.500', color: 'white', }} bg={pathname === '/pesanan_masuk' ? 'blue.200' : ''} color={pathname === '/pesanan_masuk' ? 'white' : ''}>
                    Pesanan masuk
                    </Flex>
                  </NavLink>
                  <NavLink to="/pesanan_proses" className='w-full'>
                    <Flex onClick={onClose} w='full' mr='6' pl='7' py='2' borderRadius="lg" _hover={{ bg:'blue.500', color: 'white', }} bg={pathname === '/pesanan_proses' ? 'blue.200' : ''} color={pathname === '/pesanan_proses' ? 'white' : ''}>
                    Pesanan proses
                    </Flex>
                  </NavLink>
                  <NavLink to="/pesanan_selesai" className='w-full'>
                    <Flex onClick={onClose} w='full' mr='6' pl='7' py='2' borderRadius="lg" _hover={{ bg:'blue.500', color: 'white', }} bg={pathname === '/pesanan_selesai' ? 'blue.200' : ''} color={pathname === '/pesanan_selesai' ? 'white' : ''}>
                    Pesanan selesai
                    </Flex>
                  </NavLink>
              </Flex>
            </Collapse>
          </Flex>
        </NavLink>
        <NavLink to='/data'>
          <Flex onClick={onClose} alignItems="center" p="4" mx="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: `${pathname === '/data' ? 'blue.500' : 'blue.200'}`, color: 'white', }} bg={pathname === '/data' ? 'blue.500' : ''} color={pathname === '/data' ? 'white' : ''}
            {...rest}>
            <Icon mr="4" mb='1' fontSize="16" _groupHover={{ color: 'white', }} as={BsFillFileTextFill} />
            Laporan
          </Flex>
        </NavLink>
        <NavLink to='/pegawai'>
          <Flex onClick={onClose} alignItems="center" p="4" mx="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: `${pathname === '/pegawai' ? 'blue.500' : 'blue.200'}`, color: 'white', }} bg={pathname === '/pegawai' ? 'blue.500' : ''} color={pathname === '/pegawai' ? 'white' : ''}
            {...rest}>
            <Icon mr="4" mb='1' fontSize="16" _groupHover={{ color: 'white', }} as={FaUsers} />
            Pegawai
          </Flex>
        </NavLink>
        <NavLink to='/setting'>
          <Flex onClick={onClose} alignItems="center" p="4" mx="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: `${pathname === '/setting' ? 'blue.500' : 'blue.200'}`, color: 'white', }} bg={pathname === '/setting' ? 'blue.500' : ''} color={pathname === '/setting' ? 'white' : ''}
            {...rest}>
            <Icon mr="4" mb='1' fontSize="16" _groupHover={{ color: 'white', }} as={FaCog} />
            Setting
          </Flex>
        </NavLink>
      </Flex>
    </Box>
  );
};




const MobileNav = ({ onOpen, handleLogout, ...rest }) => {
  return (
    <Flex
      top="0"
      right='0'
      left='0'
      zIndex='modal'
      mx='auto'
      ml={{ base: 0, xl: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      // borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', xl: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', xl: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', xl: 'none' }}
        fontSize="lg"
        fontFamily="monospace"
        fontWeight="bold">
        Gaveeta Packaging
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              pl={2}
              pr={4}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>

              <HStack>
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">gaveeta</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Avatar
                  size={'sm'}
                  bgColor='blue.500'
                  name='gaveeta'
                  // src={
                  //   'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  // }
                />
                {/* <Box display={{ base: 'none', xl: 'flex' }}>
                  <FiChevronDown />
                </Box> */}
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              zIndex='tooltip'>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};