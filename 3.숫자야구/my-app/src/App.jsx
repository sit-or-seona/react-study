import React, { useRef, useState } from "react";

export function NumberBaseball() {
  const [value, setValue] = useState("");
  const [strike, setStrike] = useState(0);
  const [ball, setBall] = useState(0);
  const [answer, setAnswer] = useState();
  const [tries, setTries] = useState([]);
  const inpRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <p>
        {strike} 스트라이크 {ball} 볼!
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={inpRef}
          onChange={(e) => setValue(e)}
          maxLength={4}
        />
        <button>입력</button>
      </form>
      <div>시도: {tries.length}</div>
      <ul></ul>
    </>
  );
}

function App() {
  return <NumberBaseball />;
}
export default App;
