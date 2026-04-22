import React, { useState, useEffect } from "react";

export default function Home() {
  const [counter, setCounter] = useState(0);

  function buttonClick(){
    setCounter(counter+1);
  }

  useEffect(() => {
    setCounter(0)
  }, [])

  return (
    <div>
      Este es la pagina principal con la variable: {counter}
      <button onClick={buttonClick}>Click</button>
      <button onClick={() => {setCounter(0)}}>Reset</button>
    </div>
  );
}