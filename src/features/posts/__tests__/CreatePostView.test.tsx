import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../../../App';
import { handlers } from '../../../mocks/handlers';
import { renderWithReduxAndRouter } from '../../../utils/test-utils';

const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CreatePostView', () => {
    const title1 = 'test title';
    const text1 = 'post content';
    let user: UserEvent;
    let history: any;
    beforeEach(() => {
        user = userEvent.setup();
        ({ history } = renderWithReduxAndRouter(<App />, '/posts/new'));
    });

    test('WHEN init SHOULD render form with title, text and submit button', async () => {
        expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /title/i })).toBeRequired();
        expect(screen.getByRole('textbox', { name: /text/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    });

    test('GIVEN form is properly filled WHEN submit SHOULD create post and navigate to its URL', async () => {
        // Fill form
        await user.click(screen.getByRole('textbox', { name: /title/i }));
        await user.keyboard(title1);
        await user.click(screen.getByRole('textbox', { name: /text/i }));
        await user.keyboard(text1);

        // Submit form
        expect(history.location.pathname).toBe('/posts/new');
        await user.click(screen.getByRole('button', { name: /create/i }));

        // Should navigate to post URL
        await waitFor(() => expect(history.location.pathname).not.toBe('/posts/new'));
        expect(history.location.pathname).toMatch(/\/posts\/.+/);
    });

    test('GIVEN empty title WHEN submit SHOULD fail', async () => {
        // Submit form
        expect(history.location.pathname).toBe('/posts/new');
        await user.click(screen.getByRole('button', { name: /create/i }));

        expect(history.location.pathname).toBe('/posts/new');
    });

    test('WHEN server fails during submit SHOULD alert the user', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(); 
        server.use(
            rest.post('/posts', function (req, res, ctx) {
                return res.once(
                    ctx.status(500),
                    ctx.json({ message: 'Internal server error' }),
                )
            }),
        );
        await user.click(screen.getByRole('textbox', { name: /title/i }));
        await user.keyboard(title1);
        await user.click(screen.getByRole('textbox', { name: /text/i }));
        await user.keyboard(text1);

        await user.click(screen.getByRole('button', { name: /create/i }));

        await waitFor(() => expect(alertMock).toHaveBeenCalledTimes(1));
    });
});


// test('fetches & receives a user after clicking the fetch user button', async () => {
//     renderWithProviders(<UserDisplay />)

//     // should show no user initially, and not be fetching a user
//     expect(screen.getByText(/no user/i)).toBeInTheDocument()
//     expect(screen.queryByText(/Fetching user\.\.\./i)).not.toBeInTheDocument()

//     // after clicking the 'Fetch user' button, it should now show that it is fetching the user
//     fireEvent.click(screen.getByRole('button', { name: /Fetch user/i }))
//     expect(screen.getByText(/no user/i)).toBeInTheDocument()

//     // after some time, the user should be received
//     expect(await screen.findByText(/John Smith/i)).toBeInTheDocument()
//     expect(screen.queryByText(/no user/i)).not.toBeInTheDocument()
//     expect(screen.queryByText(/Fetching user\.\.\./i)).not.toBeInTheDocument()
// });

