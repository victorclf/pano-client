// Adapted from the docs: https://redux.js.org/usage/writing-tests
import type { PreloadedState } from '@reduxjs/toolkit'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'

import { AppStore, RootState, setupStore } from '../app/store'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>
    store?: AppStore
    history?: MemoryHistory
}

export function renderWithReduxAndRouter(
    ui: React.ReactElement,
    startLocation = '/',
    {
        preloadedState = {},
        // Automatically create a store instance if no store was passed in
        store = setupStore(preloadedState),
        history = createMemoryHistory({initialEntries: [startLocation]}),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
        return <Router location={history.location} navigator={history}><Provider store={store}>{children}</Provider></Router>
    }

    return { store, history, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export function renderWithRedux(
    ui: React.ReactElement,
    {
        preloadedState = {},
        // Automatically create a store instance if no store was passed in
        store = setupStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
        return <Provider store={store}>{children}</Provider>
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}