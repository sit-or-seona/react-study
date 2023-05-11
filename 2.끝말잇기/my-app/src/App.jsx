import { useRef } from "react";
import { useState } from "react";

function WordChain () {
  const [word, setWord] = useState('크리스마스');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inpRef = useRef(null);

  const handleWordChain = (e) => {
    e.preventDefault();
    if(value.length >= 2 && value.slice(0, 1) === word.slice(-1)){
      setResult('딩동댕🎵🎶');
      setValue('');
      setWord(value);
      inpRef.current.focus();
    } else {
      setResult('땡! 바~보 🥱');
      inpRef.current.focus();
    }
  }


  return (
    <>
      <p>{word}</p>
      <form onSubmit={handleWordChain}>
        <input type="text" ref={inpRef} value={value} onChange={(e) => setValue(e.target.value)}/>
        <button>입력!</button>
      </form>
      <p>{result}</p>
    </>
  )
}


function App() {
  return (
    <>
      <WordChain/>
    </>
  );
}
export default App;
