import { JSONFilePreset } from "lowdb/node";
import type { AIMessage } from "../types";
import {v4 as uuidv4} from 'uuid'
import { Messages } from "openai/resources/beta/threads/messages.mjs";

export type MessageWithMetaData = AIMessage & {
    id: String
    createdAt: String
}

type Data = {
    messages: MessageWithMetaData[] 
}

export const addMetaData = (message: AIMessage) => {
    return {
        ...message,
        id: uuidv4(),
        createdAt: new Date().toISOString()
    }
}

export const removeMetaData = (messages: MessageWithMetaData) => {
    const {id, createdAt, ...rest} = messages
    return rest
}

const defaultData: Data = {
    messages: []
}


export const getDb = async () => {
    const db = await JSONFilePreset<Data>('db.json', defaultData)
    return db
}


export const addMessages = async (messages: AIMessage[]) => {
    const db = await getDb()
    db.data.messages.push(...messages.map(addMetaData))
    await db.write()
}

export const getMessages = async () => {
    const db = await getDb()
    return db.data.messages.map(removeMetaData)
}

export const saveToolResponse = async (toolCallId: string, toolResponse: string) => {
    return addMessages(
        [{role:'tool', content: toolResponse,tool_call_id: toolCallId}]
    )
}