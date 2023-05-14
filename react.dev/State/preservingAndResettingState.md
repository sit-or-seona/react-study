# MANAGING STATE

## Preserving and Resetting State

### UI 트리

- 리액트도 브라우저처럼 트리 구조를 사용하여 UI를 관리&모델링
- 만드는 과정
  1. JSX로부터 UI 트리 생성
  2. 리액트 DOM은 UI 트리와 일치하도록 브라우저 DOM 엘리먼트를 업데이트

<br>

### State is tied to a position in the tree

- 컴포넌트 내부에 state를 선언할 때, state가 컴포넌트 내부에 존재한다고 생각하기 쉬움 <br>
  ➡️ React가 컴포넌트와 state를 연결하는 것
- 컴포넌트 렌더링을 중지(제거)한 순간 state는 사라짐 (DOM에서 삭제됨) <br>
  ➡️ 다시 렌더링하면 state는 초기화되어 DOM에 추가됨

<br>

### 동일한 위치의 동일한 컴포넌트는 state를 유지

- **중요한 건 JSX 마크업이 아닌 UI 트리에서의 위치**

```js
import { useState } from "react";

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={(e) => {
              setIsFancy(e.target.checked);
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={(e) => {
            setIsFancy(e.target.checked);
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }
  if (isFancy) {
    className += " fancy";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}
```

- 위 코드에서 `<Counter />`는 같은 위치에 렌더링되기 때문에 state가 유지됨
  ➡️ 리액트는 함수에서 조건을 어디에 배치했는지 알 수 없고, 트리만 볼 수 있음
  - 두 조건 모두 `<Counter />`를 첫 번째 자식으로 가진 `<div>`를 반환
  - 루트의 첫 번째 자식의 첫 번째 자식이라는 동일한 **주소**를 가짐

<br>

### 동일한 위치의 다른 컴포넌트는 state를 초기화

```js
import { useState } from "react";

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? <p>See you later!</p> : <Counter />}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={(e) => {
            setIsPaused(e.target.checked);
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}
```

- 같은 위치에서 `<Counter />`와 `<p>`가 전환되고 있음
  ➡️ 전환될 때마다 UI 트리에서 `<Counter />`를 제거하고 state를 소멸시킴
- **❗리렌더링 사이에 state를 유지하려면 트리의 구조가 “일치”해야 함❗**
  ➡️ 컴포넌트 함수를 최상위에서 선언하고 중첩하면 안 됨

<br>

### 동일한 위치에서 state 재설정하기

- 아래 코드는 Player가 바뀌어도 state가 유지됨

  ```js
  export default function Scoreboard() {
    const [isPlayerA, setIsPlayerA] = useState(true);
    return (
      <div>
        {isPlayerA ? <Counter person="Taylor" /> : <Counter person="Sarah" />}
        <button
          onClick={() => {
            setIsPlayerA(!isPlayerA);
          }}
        >
          Next player!
        </button>
      </div>
    );
  }
  ```

- state를 재설정하는 방법

  1. 두 컴포넌트를 다른 위치에 렌더링

  ```js
  {
    isPlayerA && <Counter person="Taylor" />;
  }
  {
    !isPlayerA && <Counter person="Sarah" />;
  }
  ```

  2. key로 state 재설정

  - key는 list에서만 사용하는 것이 아님
  - key를 사용하면 리액트가 모든 컴포넌트를 구분하도록 만듦
  - 기본적으로 리액트는 부모 내의 순서로 컴포넌트를 구분
    ➡️ key를 사용하면 key로 구분 가능하게 함

  ```js
  {
    isPlayerA ? (
      <Counter key="Taylor" person="Taylor" />
    ) : (
      <Counter key="Sarah" person="Sarah" />
    );
  }
  ```

  ➡️ **key는 전역으로 고유하지는 않다는 점을 기억할 것. key는 부모 내에서의 위치만 지정**

<br>

### 제거된 컴포넌트의 state 보존

- 채팅 앱과 같이 입력한 state를 복구하고 싶은 경우, state를 살아있게 유지하는 방법

1. CSS로 숨기기

- 간단한 UI에 적합
- 숨겨진 트리가 크거나 많은 DOM노드를 포함할 경우 속도 저하

2. 부모 컴포넌트에서 state를 끌어올려서 보관

- 자식 컴포넌트가 제거되더라도 부모 컴포넌트가 정보를 보관
- 가장 일반적인 해결책

3. localStorage 활용

- localStorage에서 읽어서 state를 초기화하고 저장
