import {render, screen} from '@testing-library/react'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { useSession } from 'next-auth/client'
import {useRouter} from 'next/router'
import {getPrismicClient} from '../../services/prismic'

jest.mock('next-auth/client')
jest.mock('../../services/prismic')
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
  }))

const post = {
    slug: 'my-new-post',
    title: 'My New Post',
    content: '<p>Post except</p>',
    updatedAt: '10 de Abril'
}

describe('Post Preview Page', () => {
    it('renders correctly',  () => {

        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<Post post={post}/>)

        expect(screen.getByText('My New Post')).toBeInTheDocument()
        expect(screen.getByText('Post except')).toBeInTheDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    })

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce([{
            activeSubscription: 'fake-active-subscription'
        }, false])

        const useRouterMocked = jest.mocked(useRouter)

        const pushMock = jest.fn()

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<Post post={post}/>)

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        {type: 'heading', text: 'My New Post'}
                    ],
                    content: [
                        {type: 'paragraph', text: 'Post except'}
                    ],
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        const response = await getStaticProps({
            params: {
                slug: 'my-new-post'
            }
        })

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My New Post',
                        content: 'Post except',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            }),
        )
    })
})
