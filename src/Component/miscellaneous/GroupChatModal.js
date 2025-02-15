import { Button,Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, useToast, FormControl, Input, Box, } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/chatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModal = ({children}) => {
    const baseURL = process.env.REACT_APP_BASE_URL;
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("") 
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const { user, chats, setChats } = ChatState()
    console.log(search)

    const handleSearch = async (query) => {
        setSearch(query)
        if(!query){
          return
        }
        try{
          setLoading(true)

          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }

          const {data} = await axios.get(`${baseURL}api/user?search=${query}`, config)
          setLoading(false)
          setSearchResult(data)
        }catch(error){
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left"
          })
        }
    }
    const handelGroup = (userAdd) => {
      if(selectedUsers.includes(userAdd)){
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        })
        return
      }else{
        setSelectedUsers([...selectedUsers, userAdd])
      }
    }
    const handelSubmit = async() => {
        if(!groupChatName || selectedUsers.length < 2){
          toast({
            title: "Please fill all the feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          })
          return
        }
        try{
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
          const {data} = await axios.post(`${baseURL}api/chat/group`, 
            {name: groupChatName, 
            users: JSON.stringify(selectedUsers.map((u) => u._id))}, config)
          setChats([data, ...chats])
          onClose()
          toast({
            title: "New Group Chat Created",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          })
        }
        catch(error){
          toast({
            title: "Error",
            description: "Something went wrong",
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom-left',
        });
        }
    }
    const handelDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    }
    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
              fontSize={35}
              fontFamily={"Work sans"}
              display={"flex"}
              justifyContent={"center"}
              >Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
              <FormControl>
                <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)}/>
              </FormControl>

              <FormControl>
                <Input placeholder='Add Users' mb={3} onChange={(e) => handleSearch(e.target.value)}/>
              </FormControl>
              <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handelDelete(u)}/>
              ))}
              </Box>
              

              {loading? <div>loading</div> : (
                searchResult?.slice(0,4).map((user) => (
                  <UserListItem key={user._id} user={user} handelFunction={() => handelGroup(user)}/>
                ))
              )}

              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue'  onClick={handelSubmit}>
                  Create Chat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModal