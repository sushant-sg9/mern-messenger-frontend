import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSender, isLastMessages, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/chatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({messages}) => {
   const { user } = ChatState()
  return (
    <ScrollableFeed>
        {messages && messages.map((m,i) => (
            <div style={{display:'flex'}} key={m._id}>
                {(isSameSender(messages, m, i, user._id) || 
                  isLastMessages(messages, m, i, user._id)) && (
                    <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                        <div>
                            <Avatar name={m.sender.name} src={m.sender.pic} size='sm' cursor='pointer'/>
                        </div>
                    </Tooltip>
                )}
                <span style={{
                  background: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
                >
                {m.content}
                </span>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat