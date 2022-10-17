import { fireEvent, render, screen } from '@testing-library/react'
import {signIn, useSession} from 'next-auth/client'
import {useRouter} from 'next/router'
import { SubscribeButton } from '.'

jest.mock('next-auth/client')

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
  }))

describe('SubscribeButton component', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    it('renders correctly', () => {
        render(
            <SubscribeButton/>
        )
    
        expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
    })

    it('redirects user to sign in when not authenticated', () => {
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])
        const signInMocked = jest.mocked(signIn)

        render(
            <SubscribeButton/>
        )

        const subscribeButton = screen.getByText('Subscribe Now')
    
        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })

    it('redirects user to posts when user already has a subscription', () => {
        const useRouterMocked = jest.mocked(useRouter)
        const useSessionMocked = jest.mocked(useSession)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([
            { 
                user: {
                    name: 'John Doe', 
                    email: 'jhondoe@example.com'
                }, 
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires'
            },
            false
        ])

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(
            <SubscribeButton/>
        )

        const subscribeButton = screen.getByText('Subscribe Now')
    
        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalled()
    })

})
