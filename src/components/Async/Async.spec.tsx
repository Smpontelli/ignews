import {render, screen, waitFor} from '@testing-library/react'
import {Async} from '.'

test('it renders correctly', async () => {
    render(<Async />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()

    await waitFor(() => {
        return expect(screen.getByText('Button')).toBeInTheDocument()
    })
})