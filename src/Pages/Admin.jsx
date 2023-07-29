import React from 'react';
import {
  Image,
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
  MenuItem,
  MenuList,
  Collapse,
  useToast,
} from '@chakra-ui/react';
import { FiMenu, FiChevronDown } from 'react-icons/fi';
import { BsFillFileTextFill } from 'react-icons/bs';
import {
  FaHome,
  FaShoppingCart,
  FaUsers,
  FaAngleDown,
  FaBuilding,
  FaAngleUp,
} from 'react-icons/fa';
import Logo from '../Assets/logo-gaveeta.png'
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../Service';
import { userRole, username } from '../Features/Utils';

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
      API.signOut();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
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
    <Box minH="100vh" bg={useColorModeValue('gray.100', '#18191C')}>
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
      <Box
        position='relative'
        px={{ base: 0, lg: 5 }}
        ml={{ base: 0, xl: 60 }}
        bg={useColorModeValue('gray.100', '#18191C')}
        minH="100vh"
        display="flex"
        flexDirection="column">
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
    if (address != null) {
      setOrderAddress(address[0])
    } else {
      setOrderAddress('')
    }
  }, [pathname])

  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(prevState => !prevState);

  const navbarOrder = [
    { navigation: 'Pesanan masuk', to: 'pesananmasuk' },
    { navigation: 'pesanan proses', to: 'pesananproses' },
    { navigation: 'pesanan selesai', to: 'pesananselesai' },
  ]

  const NavbarItem = ({ to, icon, name }) => {
    return (
      <NavLink to={`/${to}`}>
        <Flex
          onClick={onClose}
          alignItems="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{ bg: `${pathname === `/${to}` ? 'green.500' : 'green.200'}`, color: 'white', }}
          bg={pathname === `/${to}` ? 'green.500' : ''}
          color={pathname === `/${to}` ? 'white' : ''}
          {...rest}>
          <Icon
            mr="4"
            mb='1'
            fontSize="16"
            _groupHover={{ color: 'white', }}
            as={icon} />
          {name}
        </Flex>
      </NavLink>
    )
  }
  return (
    <Box
      transition="3s ease"
      w={{ base: 'full', xl: 60 }}
      pos="fixed"
      h="full"
      py={4}
      borderRightWidth={{ base: 1, lg: 1 }}
      bg={useColorModeValue('white', '#1E2023')}
      borderRightColor={useColorModeValue('gray.200', 'transparent')}
      {...rest}>
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        mb={10}
        justifyContent="center"
        gap='2'>
        <Image src={Logo} alt="Image Description" h={24} mt={5} display={{ base: 'none', xl: 'block' }} />
        <Text
          fontSize='xl'
          fontFamily="monospace"
          fontWeight="bold"
          w='full'
          display={{ base: 'block', xl: 'none' }}>
          Gaveeta Packaging
        </Text>
        <CloseButton
          display={{ base: 'flex', xl: 'none' }}
          onClick={onClose} />
      </Flex>
      <Flex
        flexDirection='column'
        mt='5'
        gap='2'
      >
        <NavbarItem to={'dashboard'} icon={FaHome} name={'Dashboard'} />
        <Flex
          flexDirection='column'
          p="4"
          mx="4"
          gap='7'
          borderRadius="lg"
          cursor="pointer"
          _hover={{ bg: `${orderAddress === 'pesanan' ? 'green.500' : 'green.200'}`, color: 'white', }}
          bg={orderAddress === 'pesanan' ? 'green.500' : ''}
          color={orderAddress === 'pesanan' ? 'white' : ''} >
          <Flex
            flexDirection='row'
            justifyContent='space-between'
            onClick={handleToggle}>
            <Flex>
              <Icon
                mr="4"
                mt='1'
                fontSize="16"
                _groupHover={{ color: 'white', }}
                as={FaShoppingCart} />
              <Text>Pesanan</Text>
            </Flex>
            <Icon
              mt='1.5'
              fontSize="16"
              _groupHover={{ color: 'white', }}
              as={isOpen ? FaAngleUp : FaAngleDown} />
          </Flex>
          <Collapse in={isOpen} animateOpacity>
            <Flex
              flexDirection='column'
              align='center'
              gap='2'
              w='full'
            >
              {navbarOrder.map((value, i) => {
                return (
                  <NavLink
                    key={i}
                    to={`/${value.to}`}
                    className='w-full'>
                    <Flex
                      onClick={onClose}
                      w='full'
                      mr='6'
                      pl='7'
                      py='2'
                      borderRadius="lg"
                      _hover={{ bg: 'green.500', color: 'white', }}
                      bg={pathname.includes(value.to) ? 'green.200' : ''}
                      color={pathname.includes(value.to) ? 'white' : ''}>
                      {value.navigation}
                    </Flex>
                  </NavLink>
                )
              })}
            </Flex>
          </Collapse>
        </Flex>
        {
          userRole === 'superAdmin' ?
            <>
              <NavbarItem to={'laporan'} icon={BsFillFileTextFill} name={'Laporan'} />
            </> : null
        }
        <NavbarItem to={'pegawai'} icon={FaUsers} name={'Pegawai'} />
        <NavbarItem to={'company'} icon={FaBuilding} name={'Perusahaan'} />
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
      borderBottomWidth={{ base: 2, lg: 2 }}
      bg={useColorModeValue('white', '#1E2023')}
      borderBottomColor={useColorModeValue('gray.200', 'transparent')}
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
        fontWeight="bold"
      >
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

              <HStack align={'center'}>
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{username} </Text>
                </VStack>
                <FiChevronDown />
                {/* <Avatar
                  size={'sm'}
                  bgColor='green.500'
                  name={username}
                /> */}
              </HStack>
            </MenuButton>
            <MenuList
              zIndex='tooltip'>
              <MenuItem onClick={handleLogout}>Keluar</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};