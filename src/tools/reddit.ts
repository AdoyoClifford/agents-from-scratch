import type {ToolFn} from '../../types'
import {z} from 'zod'
import fetch from 'node-fetch'
import { auto } from 'openai/_shims/registry.mjs'

export const redditToolDefinition = {
    name: 'reddit',
    parameters: z.object({}),
    description: 'get a random post from r/jokes',
}

type Args = z.infer<typeof redditToolDefinition.parameters>

export const reddit: ToolFn<Args, string> = async({toolArgs}) => {
    const {data} = await fetch('https://www.reddit.com/r/jokes/.json').then(res => res.json())


    const relevantInfo = data.children.map((child: any) => {
        title: child.data.title
        link: child.data.url
        subreddit: child.data.subreddit
        author: child.data.author
        upvotes: child.data.ups
    })

    return JSON.stringify(relevantInfo, null, 2)

}