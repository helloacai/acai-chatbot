"use client";

import { Attachment, ChatRequestOptions } from "ai";
import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import ACS from "@/lib/abis/ACS.json"
import { decodeEventLog, numberToHex } from 'viem'
import axios from 'axios'
import axiosRetry from 'axios-retry';
import { PacmanLoader } from 'react-spinners'


import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";

import { Message, UserMessage } from "@/lib/threadUtils";
import {createEventSource} from 'eventsource-client'


export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {  

  const { address, isConnected, chain } = useAccount();

  const { data: hash, isPending, isError, isSuccess, writeContract, error } = useWriteContract();
  

  const [humanInput, setHumanInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const [messages, setMessages] = useState<Message[]>([])


  const [threadUID, setThreadUID] = useState('')

  const handleSubmit = () => {
    
    writeContract({
      address: ACS.address as `0x${string}`,
      abi: ACS.abi,
      functionName: 'request',
      args: [
        numberToHex(0, { size: 32 }),
        threadUID ? threadUID : numberToHex(0, { size: 32 }),
        '0x822434c25a9837f0e7244090c1558663dee097f16f7623f0bf461c8afee4c55b',
        humanInput
      ]
    })
    setHumanInput('');
    setIsLoading(true);
    console.log("handled submit!")
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed, data, status } =
    useWaitForTransactionReceipt({
      hash,
    })

  // if(data) {
  //   const topics = decodeEventLog({
  //     abi: ACS.abi,
  //     data: data.logs[0].data,
  //     topics: data.logs[0].topics
  //   })
  //   if(topics.eventName == 'Requested') {
  //     // @ts-expect-error
  //     setThreadUID(topics.args.threadUID)
  //   }
  // }

  if(isError) {
    console.log(error)
  }

  const append = async (message: Message | UserMessage ): Promise<string | null | undefined> => {
    console.log("handle append here!")
    return;
  }
  // console.log('thread and messages', threadUID, messages)

  useEffect(() => {
    console.log("in useEffect!")
    
    const eventStreamer = async (threadUID: string) => {
      const es = createEventSource({
        url: `https://spindle.onrender.com/thread/${threadUID}/context/stream`
      })
      setIsStreaming(true);
      let shallowMessages: Message[] = [];
      var interval = setInterval(() => {
        console.log("updating state")
        setMessages([...messages, ...shallowMessages].sort((messageA, messageB) => messageA.id - messageB.id))
      }, 1000)
      for await (const {data, event, id} of es) {
        console.log('Data: %s', data)
        console.log('Event ID: %s', id) // Note: can be undefined
        console.log('Event: %s', event) // Note: can be undefined
        const jsonData = JSON.parse(data)
        const messageToInclude = {
          id: jsonData['id' as keyof typeof jsonData] as number,
          name: jsonData['originator' as keyof typeof jsonData] as string,
          content: jsonData['message' as keyof typeof jsonData] as string,
          type: jsonData['type' as keyof typeof jsonData] as string
        }
        console.log("trying to include ", messageToInclude)
        if(messageToInclude.type == "waiting") {
          setIsLoading(false);
        }
        if(shallowMessages.some((message) => message.id == messageToInclude.id)) {
          console.log("found a duplicate", messageToInclude)
          continue;
        } else {
          shallowMessages.push(messageToInclude)
          shallowMessages.sort((messageA, messageB) => messageA.id - messageB.id)
        }
        if(messageToInclude.type == "complete") {
          clearInterval(interval);
          break;
        }
      }
      setMessages([...messages, ...shallowMessages].sort((messageA, messageB) => messageA.id - messageB.id))
    }
    // eventStreamer("0x9f1ef6cdbe555a23571c75b03c08c5efe719cf8f0c01481a24c168db5ac174a7")
    if(data) {
      const topics = decodeEventLog({
        abi: ACS.abi,
        data: data.logs[0].data,
        topics: data.logs[0].topics
      })
      if(topics.eventName == 'Requested') {
        // @ts-expect-error
        const locThreadUID = topics.args.threadUID
        console.log('thread', locThreadUID)
        setThreadUID(locThreadUID)
        if(!isStreaming) {
          eventStreamer(locThreadUID)
        }
      }
    }
    
  }, [data])
  

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll"
        >
          {messages.length === 0 && <Overview />}

          {messages.map((message) => (
            <PreviewMessage
              key={message.id}
              type={message.type}
              name={message.name}
              content={message.content}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        {isLoading ? (<div className="m-4"><PacmanLoader color="#b1b1b1" /></div>) : <></>}

        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
          <MultimodalInput
            input={humanInput}
            setInput={setHumanInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            disabled={!isConnected || isLoading}
            stop={() => {}} // Create a stop handler here to immediately stop execution and kill the thread
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            append={append}
          />
        </form>
      </div>
    </div>
  );
}
