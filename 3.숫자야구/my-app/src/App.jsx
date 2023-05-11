import { useState } from "react";

const getAnswer = () => {
  const candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const arr = [];
  for (let i = 0; i < 4; i++) {
    const chosen = candidate.splice(Math.random() * (9 - i), 1)[0];
    arr.push(chosen);
  }
  return arr;
};

export function NumberBaseball() {
  const [value, setValue] = useState("");
  const [answer, setAnswer] = useState(getAnswer);
  const [tries, setTries] = useState([]);
  const [result, setResult] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (value === answer.join("")) {
      setResult("홈런!");
      setTries((prevTries) => [...prevTries, { try: value, result: "홈런!" }]);
      setTimeout(() => {
        alert("게임을 다시 시작합니다!");
        setValue("");
        setAnswer(getAnswer());
        setTries([]);
        setResult("");
      }, 1000);
    } else {
      if (tries.length >= 9) {
        setResult(`10번 모두 틀려서 실패! 답은 ${answer.join("")} 입니다!`);
        setTimeout(() => {
          alert("게임을 다시 시작합니다!");
          setValue("");
          setAnswer(getAnswer());
          setTries([]);
          setResult("");
        }, 2000);
      }
      let strike = 0;
      let ball = 0;
      const valueArr = value.split("").map(Number);
      for (let i in answer) {
        if (answer[i] === valueArr[i]) {
          strike++;
        } else if (valueArr.includes(answer[i])) {
          ball++;
        }
      }
      setTries((prevTries) => [
        ...prevTries,
        { try: value, result: `${strike} 스트라이크 ${ball} 볼` },
      ]);
      setValue("");
    }
  };

  return (
    <>
      <p>{result}</p>

      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setValue(e.target.value)}
          maxLength={4}
          value={value}
        />
        <button>입력</button>
      </form>
      <div>시도: {tries.length}</div>
      <ul>
        {tries.length > 0 &&
          tries.map((v, i) => {
            return (
              <li key={i + 1}>
                {i + 1}차 시도: {v.try}, {v.result}
              </li>
            );
          })}
      </ul>
    </>
  );
}

function App() {
  return <NumberBaseball />;
}
export default App;
