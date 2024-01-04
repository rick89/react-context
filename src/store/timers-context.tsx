import { ReactNode, createContext, useContext, useReducer } from 'react'

export type Timer = {
    name: string
    duration: string
}
type TimersState = {
    isRunning: boolean
    timers: Timer[]
}

const initialState: TimersState = {
    isRunning: true,
    timers: []
}

type TimersContextValue = TimersState & {
    addTimers: (timerData: Timer) => void,
    startTimers: () => void,
    stopTimers: () => void
}

const TimersContext = createContext<TimersContextValue | null>(null)

export const useTimersContext = () => {
    const timersCtx = useContext(TimersContext)
    if (timersCtx === null) {
        throw new Error('UH OH! Timers context is null! :(')
    }
    return timersCtx
}

type TimersProviderContextProps = {
    children: ReactNode
}

type StartTimersAction = {
    type: 'START_TIMERS'
}

type StopTimersAction = {
    type: 'STOP_TIMERS'
}

type AddTimersAction = {
    type: 'ADD_TIMERS',
    payload: Timer
}

type Action = 
    AddTimersAction |
    StopTimersAction |
    StartTimersAction

function timersReducer(state: TimersState, action: Action): TimersState {
    if (action.type === 'ADD_TIMERS') {
        return {
            ...state,
            isRunning: true,
            timers: [
                ...state.timers,
                {...action.payload}
            ]
        }
    }
    if (action.type === 'STOP_TIMERS') {
        return {
            ...state,
            isRunning: false
        }
    }
    if (action.type === 'START_TIMERS') {
        return {
            ...state,
            isRunning: true
        }
    }
    return initialState
}

function TimersContextProvider({children}: TimersProviderContextProps) {
    const [timersState, dispatch] = useReducer(timersReducer, initialState)

    const ctx:TimersContextValue = {
        timers: timersState.timers,
        isRunning: timersState.isRunning,
        addTimers: (timerData) => {
            dispatch({type: 'ADD_TIMERS', payload: timerData})
        },
        startTimers: () => {
            dispatch({type: 'START_TIMERS'})
        },
        stopTimers: () => {
            dispatch({type: 'STOP_TIMERS'})
        }
    }
    return <TimersContext.Provider value={ctx}>
        {children}
    </TimersContext.Provider>
}

export default TimersContextProvider