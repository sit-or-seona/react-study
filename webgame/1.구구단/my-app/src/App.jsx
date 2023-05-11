import { useRef, useState } from 'react'

const Gugudan = () => {
  const [first, setFirst] = useState(Math.ceil(Math.random()*9));
  const [second, setSecond] = useState(Math.ceil(Math.random()*9));
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inpEl = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if(parseInt(value) === first * second) {
      setResult('정답 : ' + value);
      setValue('');
      setFirst(Math.ceil(Math.random()*9));
      setSecond(Math.ceil(Math.random()*9));
      inpEl.current.focus();
    } else {
      setResult('땡!');
      setValue('');
      inpEl.current.focus();
    }
  }
  return (
    <div>
      <p>{first} 곱하기 {second}는?</p>
      <form onSubmit={onSubmit}>
        <input type="number" ref={inpEl} value={value} onChange={e => setValue(e.target.value)}/>
        <button>입력</button>
      </form>
      <p>{result}</p>
    </div>
  );

}

function App() {
  return (
    <>
      <Gugudan/>
    </>
  );
}
export default App;
