import React, { useEffect } from 'react'
import { Container, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import Login from '../Component/Authentication/Login';
import SignUp from '../Component/Authentication/SignUp';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      navigate('/chats');
    }
  } , [navigate]);
  return (
    <Container maxW='xl' centerContent>
      <Box
        display='flex'
        justifyContent={'center'}
        p={3}
        bg='white'
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text fontSize='4xl' fontFamily='Work sans' color='black' textAlign={'center'}>Chat</Text>
      </Box>
      <Box bg={'white'} w='100%' p={4} borderRadius='lg' color={'black'} borderWidth='1px'>
        <Tabs variant='soft-rounded'>
          <TabList mb="1em">
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel> <Login/></TabPanel>
            <TabPanel> <SignUp/></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage