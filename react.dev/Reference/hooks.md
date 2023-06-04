# State Hooks

- state를 사용하면 컴포넌트가 **정보를 기억**
  |hook|설명|
  |:---:|:---:|
  |useState|직접 업데이트할 수 있는 state 변수를 선언|
  |useReducer|reducer 함수 안에 업데이트 로직이 있는 state 변수를 선언|

## useState

- 컴포넌트 최상위 레벨에서 호출
- 배열 구조 분해 할당을 사용해 [something, setSomething]을 지정

### Parameters

- state 초기 값
- 함수일 경우 (초기화 함수로 취급)

  - 초기 렌더링 이후에는 무시됨
  - 조건: 순수함수여야 하고, 아규먼트를 받지 않고, 어떤 값을 반환해야 함
  - 컴포넌트를 초기화할 때 초기화 함수를 호출하고, 그 반환값을 초기 state로 저장

  ```js
  const [fn, setFn] = useState(() => someFunction);

  function handleClick() {
    setFn(() => someOtherFunction);
  }
  ```

### Returns

- 2개의 값을 가진 배열을 반환

1. 현재 state (첫 번째 렌더링 중에는 초기 state와 일치)
2. state를 다른 값으로 업데이트하고 리렌더링을 일으키는 set함수

### 주의사항

- 컴포넌트 최상위 레벨이나 직접 만든 훅에서만 호출 가능
- 반복문이나 조건문 안에서 호출 불가능
- 필요한 경우, 새 컴포넌트를 추출하고 state를 그 안으로 옮기기
- Strict mode에서 초기화 함수를 2번 호출
- 컴포넌트를 순수하게 유지하기 위한 동작
- 개발 환경에서만 동작, 프로덕션 환경에선 X

<br>

## useState - set함수

- set함수를 사용해 state를 다른 값으로 업데이트하고 리렌더링을 유발
- 다음 state를 직접 전달하거나, 이전 state를 계산하여 다음 state를 도출하는 함수를 전달할 수 있음

### Parameters

- next state
- state가 될 값
- 함수일 경우 (업데이터 함수로 취급)
  - 조건: 순수함수여야 하고, 아규먼트는 대기 중인 state를 유일하게 사용하고, 다음 state를 반환해야 함
  - React는 업데이터 함수를 queue에 넣고 컴포넌트를 리렌더링함
  - 다음 렌더링 중에는 React는 queue에 있는 모든 업데이터 함수들을 이전 state에 적용하여 다음 state를 계산함

### Returns

- 반환값이 없음

### 주의사항

- **set함수는 다음 렌더링에 대한 state 변수만 업데이트**
- set함수 호출 이후에도 state 변수에는 이전 값이 담겨 있음
- 이미 실행 중인 코드의 현재 state는 변경되지 않음
- 새로운 값이 현재 state와 동일하다고 판단되면(Object.is메서드 사용) 리렌더링이 일어나지 않음
- 최적화 하는 방식
- state 업데이트를 일괄 처리
- 모든 이벤트 핸들러가 실행되고, set함수가 호출된 후에 화면을 업데이트
- 렌더링 도중 set함수를 호출하는 건 현재 렌더링 중인 컴포넌트 내에서만 허용
- React는 해당 출력을 버리고 즉시 새로운 state로 리렌더링
- 이전 렌더링 정보를 저장하는 데 사용 가능
- Strict mode에서 초기화 함수를 2번 호출
- 컴포넌트를 순수하게 유지하기 위한 동작
- 개발 환경에서만 동작, 프로덕션 환경에선 X

<br>

## useReducer

- 컴포넌트에 reducer를 추가할 수 있는 훅
  ```js
  const [state, dispatch] = useReducer(reducer, initialArg, init?)
  ```
- 컴포넌트 최상위 레벨에서 호출

### Parameters

- reducer
  - state가 업데이트되는 방식을 지정
  - 순수함수여야 함
  - state와 action을 인자로 받고 다음 state를 반환
- initialArg
  - 초기 state가 계산되는 값
- optional init
  - 초기 state 계산 방법을 지정하는 초기화 함수
  - 지정하지 않으면 initialArg로 설정

### Returns

- 2개의 값을 가진 배열을 반환
  - 1. 현재 state (첫 번째 렌더링 중에는 init 또는 initialArg)
  - 2. state를 다른 값으로 업데이트하고 리렌더링을 일으키는 dispatch 함수

### 주의사항

- 컴포넌트 최상위 레벨에서만 호출 가능
- Strict Mode에서 reducer와 초기화 함수를 두 번 호출 (개발 환경)

<br>

## useReducer - dispatch function

- useReducer가 반환하는 dispatch 함수를 사용하면 state를 다른 값으로 업데이트하고 리렌더링
- dispatch 함수에 유일한 인수로 액션을 전달
- React는 reducer 함수에 현재 state와 dispatch한 액션을 전달하고, 그 결과를 다음 state로 설정

  ```js
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  function handleClick() {
    dispatch({ type: 'incremented_age' });
    // ...
  ```

### Parameters

- action
  - 사용자가 수행한 작업

### Returns

- 반환값이 없음

### 주의사항

- 다음 렌더링에 대한 state만 업데이트 (화면에는 이전 값이 계속 표시)
- 새 값이 `Object.is`로 비교했을 때 현재 state와 동일하면 리렌더링이 일어나지 않음

<br>

## 사용법

```js
import { useReducer } from "react";

function reducer(state, action) {
  if (action.type === "incremented_age") {
    return {
      age: state.age + 1,
    };
  }
  throw Error("Unknown action.");
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button
        onClick={() => {
          dispatch({ type: "incremented_age" });
        }}
      >
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

<br>

# Performance Hooks

- 렌더링 성능 최적화를 위해 불필요한 리렌더링을 건너뛰도록 만드는 훅
- 캐시된 데이터를 사용하거나 데이터가 변경되지 않은 경우
  |hook|설명|
  |:---:|:---:|
  |useCallback|함수 정의를 캐시한 후 최적화된 컴포넌트로 전달|
  |useMemo|비용이 많이 드는 계산 결과를 캐시|
- 화면이 업데이트되어야 해서 렌더링을 건너뛸 수 없는 경우
  - 아래 2가지를 분리하여 성능을 향상
    - input에 타이핑하는 것처럼 동기화되어야 할 블로킹 업데이트
    - 차트를 업데이트하는 것처럼 UI를 차단할 필요가 없는 논-블로킹 업데이트
- 렌더링 우선순위를 지정하여 성능 최적화하는 훅
  |hook|설명|
  |:---:|:---:|
  |useTransition|state 전환을 논-블로킹 state로 표시하고 다른 업데이트가 이를 중단하도록 허용(함수 실행의 우선순위를 지정)|
  |useDeferredValue|UI의 중요하지 않은 부분의 업데이트를 연기하고 다른 부분이 먼저 업데이트(값 업데이트의 우선순위를 지정)|

## useCallback

- 리렌더링 사이에 함수 정의를 캐시할 수 있게 해주는 훅
- useCallback(fn, dependencies)
- dependencies가 변경될 때까지 fn을 저장하고 재사용할 수 있게 함

### Parameters

- fn

  - 캐시하려는 함수
  - React는 초기 렌더링을 하는 동안 함수를 반환
  - React는 마지막 렌더링 이후 dependencies가 변경되지 않았다면 이전 렌더링과 동일한 함수를 반환
  - dependencies가 변경되었다면 이번 렌더링 중에 전달한 함수를 반환하고 나중에 재사용할 수 있도록 저장

- dependencies

  - fn 코드에 참조된 모든 값의 배열
  - props, state, 변수 및 함수 모두 포함
  - React는 `Object.is` 비교 알고리즘을 사용하여 각 의존성 값을 이전 값과 비교

### Returns

- 초기 렌더링에서 전달한 fn 함수를 반환
- 렌더링 중에는 마지막 렌더링에서 이미 저장된 fn 함수를 반환하거나, 의존성이 변경되지 않은 경우, 렌더링 중에 전달했던 fn 함수를 반환
