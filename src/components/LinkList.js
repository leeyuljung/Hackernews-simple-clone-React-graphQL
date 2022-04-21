import React from 'react'
import Link from './Link'
import { useQuery, gql } from '@apollo/client'
import { useLocation, useNavigate } from 'react-router-dom'
import { LINKS_PER_PAGE } from '../constants'

export const FEED_QUERY = gql`
    query FeedQuery($take: Int, $skip: Int, $orderBy: LinkOrderByInput) {
        feed(take: $take, skip: $skip, orderBy: $orderBy) {
            id
            links {
                id
                createdAt
                url
                description
                postedBy {
                    id
                    name
                }
                votes {
                    id
                    user {
                        id
                    }
                }
            }
            count
        }
    }
`

// 監聽任何新的 links
const NEW_LINKS_SUBSCRIPTION = gql`
    subscription {
        newLink {
            id
            url
            description
            createdAt
            postedBy {
                id
                name
            }
            votes {
                id
                user {
                    id
                }
            }
        }
    }
`

const NEW_VOTES_SUBSCRIPTION = gql`
    subscription {
        newVote {
            id
            link {
                id
                url
                description
                createdAt
                postedBy {
                    id
                    name
                }
                votes {
                    id
                    user {
                        id
                    }
                }
            }
            user {
                id
            }
        }
    }
`

const LinkList = () => {
    const location  = useLocation()
    const navigate = useNavigate()
    const isNewPage = location.pathname.includes('new') // 判斷是否為 /new/:page 路徑的頁面
    const pageIndexParams = location.pathname.split('/') // 用斜線為分隔，取出字串們，會得到 ['', 'new', page(當前頁)]
    const page = parseInt(pageIndexParams[pageIndexParams.length - 1]) // 取得當前頁
    const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0 // 前面頁面的數量，為了取得是總頁數中的第幾個 index 值

    const getQueryVariables = (isNewPage, page) => {
        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0 // 判斷前面要跳過多少個 links，也就是要從第幾個 link 開始取
        const take = isNewPage ? LINKS_PER_PAGE : 100 // 每頁要取出幾個 links
        const orderBy = { createdAt: 'desc' }
        return { take, skip, orderBy }
    }

    const { data, loading, error, subscribeToMore } = useQuery(FEED_QUERY, {
        variables: getQueryVariables(isNewPage, page),
        fetchPolicy: "cache-and-network"
    })

    subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if(!subscriptionData) return prev
            const newLink = subscriptionData.data.newLink
            const exists = prev.feed.links.find(({id}) => id === newLink.id)
            if(exists) return prev

            return Object.assign({}, prev, {
                feed: {
                    link: [ newLink, ...prev.feed.links ],
                    count: prev.feed.links.length + 1,
                    __typename: prev.feed.__typename
                }
            })
        }
    })

    subscribeToMore({
        document: NEW_VOTES_SUBSCRIPTION
    })

    const getLinksToRender = (isNewPage, data) => {
        if(isNewPage) {
            // 如果是 new page 的話，就直接返回所有 links
            return data.feed.links
        } else {
            // 如果不是 new page (即為 top page)，就要列出 votes top10 的 links
            // 先複製一份所有的 links
            const rankedLinks = data.feed.links.slice()
            // 再依照 votes 數量做排序
            rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
            return rankedLinks
        }
    }

    return (
        <>
            {
                data && (
                    <>
                        {
                            getLinksToRender(isNewPage, data).map((link, index) => (
                                <Link key={ link.id } link={ link } index={ index + pageIndex }/>
                            ))
                        }
                        {
                            isNewPage && (
                                <div className='flex ml4 mv3 gray'>
                                    <div 
                                        className='pointer mr2' 
                                        onClick={() => {
                                            if(page > 1) { navigate(`/new/${page - 1}`) }
                                        }}
                                    >
                                        Previous
                                    </div>
                                    <div
                                        className='pointer'
                                        onClick={() => {
                                            if(page <= data.feed.count / LINKS_PER_PAGE) { navigate(`/new/${page + 1}`) }
                                        }}
                                    >
                                        Next
                                    </div>
                                </div>
                            )
                        }
                    </>
                )
            }
        </>
    )
}

export default LinkList