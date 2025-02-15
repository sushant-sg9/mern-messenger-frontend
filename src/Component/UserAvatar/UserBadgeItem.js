import React from 'react'
import { Box } from '@chakra-ui/react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box
    px={2}
    py={1}
    borderRadius={'lg'}
    m={1}
    mb={2}
    variant='solid'
    fontSize={'12px'}
    backgroundColor={'#38B2AC'}
    color={'white'}
    cursor='pointer'
    onClick={handleFunction}
    >
      {user.name}
      <span pl={1}>🗙</span>
    </Box>
  )
}

export default UserBadgeItem