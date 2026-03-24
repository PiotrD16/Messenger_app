type CounterProps = {
    counter:number,
    setCounter: (count: number)  => void
}

export const Counter = ({counter, setCounter}: CounterProps) =>{

    const incrementCounter = () => {
        setCounter(counter + 1)
    }

    const decrementCounter = () =>{
        setCounter(counter - 1)
    }

    const resetCounter = () => {
        setCounter(0)
    }
    
    return(
      <>
          <div>{counter}</div>
          <button onClick={incrementCounter}>Increment Value</button>
          <button onClick={decrementCounter}>Decrement Value</button>
          <button onClick={resetCounter}>Reset Value</button>
      </>
    );
}