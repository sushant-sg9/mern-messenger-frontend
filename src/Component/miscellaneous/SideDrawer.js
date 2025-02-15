import React, { useState } from 'react';
import { Box, Text } from '@chakra-ui/layout';
import { Avatar, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Tooltip, useToast } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Spinner } from '@chakra-ui/spinner';
import { ChatState } from '../../Context/chatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {
    const baseURL = process.env.REACT_APP_BASE_URL;
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [loadingChat, setLoadingChat] = useState(false);
    const { user, setSelectedChat } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter a search term",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left',
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${baseURL}api/user?search=${search}`, config);
            setSearchResult(data);
            // console.log(!chats.find((c) => c._id === data._id));
            // if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try{
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const data = await axios.post(`${baseURL}api/chat`,{userId}, config);
            setSelectedChat(data);
            setLoading(false);
            onClose();

        }catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
        window.location.reload();
    };

    return (
        <>
            <Box display="flex" justifyContent="space-between" bg="white" alignItems="center" borderWidth="5px" w="100%" p="5px 10px">
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: 'none', md: 'flex' }} px={4}>Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work sans">Chat App</Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon m={1} fontSize="2xl" />
                        </MenuButton>
                        {/* <MenuList>
                            {/* Notifications can be listed here */}
                        {/* </MenuList> */}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by Name or Email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loading && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default SideDrawer;
