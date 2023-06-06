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

# Effect Hooks

- 컴포넌트를 외부 시스템에 연결하고 동기화하는 훅
- 네트워크, 브라우저 DOM, 애니메이션, UI라이브러리 등을 사용하는 것 등
  |hook|설명|
  |:---:|:---:|
  |useEffect|컴포넌트를 외부 시스템에 연결(외부 시스템과 상호작용하지 않는다면 사용 비권장) <br> 데이터 흐름을 조율하기 위해 사용하지 말 것|
  |useLayoutEffect|브라우저가 화면을 리페인트하기 전에 실행(useEffect보다 먼저 실행, 화면 깜빡임이 발생할 때 사용)|
  |useInsertionEffect|React가 DOM을 변경하기 전에 실행(라이브러리는 여기에 동적CSS 삽입 가능)|

## useEffect

- 컴포넌트를 외부 시스템과 동기화하는 훅

  - 외부 시스템: React로 제어되지 않는 코드를 의미
    - 예시
      - `setInterval()`과 `clearInterval()`
      - `window.addEventListener()`와 `window.removeEventListener()`
      - `animation.start()`와 `animation.reset()` 등

  ```js
  useEffect(setup, dependencies?)
  ```

### Parameters

- setup
  - Effect의 로직이 포함된 함수
  - 클린업 함수를 return 가능
  - React는 컴포넌트가 DOM에 추가되면 셋업 함수를 실행
  - dependencies가 변경되어 리렌더링을 할 때마다 클린업 함수가 있다면 이전 값으로 클린업 함수를 실행한 다음, 새 값으로 셋업 함수를 실행
  - 컴포넌트가 DOM에 제거되면 React는 마지막으로 클린업 함수를 실행
- dependencies(optional)
  - setup 함수 내에서 참조된 **모든 반응형 값**의 배열
  - React용으로 구성된 린터가 모든 반응형 값이 dependencies에 잘 지정되었는지 확인
  - 각 dependencies는 `Object.is` 로 이전 값과 비교
  - 빈 배열을 전달하면 컴포넌트가 리렌더링 될 때마다 useEffect를 실행

### Returns

- undefined를 반환

### 주의사항

- 외부 시스템과 동기화하려는 목적이 아니라면 대부분 useEffect가 필요없음
- Strict Mode일 경우, 첫 번째 셋업 전에 개발전용 셋업과 클린업 사이클을 한 번 더 실행
  - 클린업 로직이 셋업 로직을 미러링하고 셋업의 작업을 모두 클린업 하는지 테스트하는 과정
  - 문제가 발생하면 클린업 함수를 구현해야 함
- dependencies가 컴포넌트 내에 정의된 객체나 함수인 경우, useEffect가 필요 이상으로 재실행 될 위험이 있음
  - 해결하기 위해선 불필요한 객체나 함수를 dependencies에서 제거하거나 useEffect 외부에서 state 업데이트와 비반응형 로직을 제거
- 클릭과 같은 인터랙션으로 useEffect가 실행되는 것이 아니라면 브라우저는 useEffect를 실행하기 전에 업데이트된 화면을 먼저 페인트
  - 깜빡임과 같은 지연이 있다면 `useLayoutEffect`로 대체해야 함
- 인터랙션으로 useEffect가 실행되는 경우에도 브라우저는 state를 업데이트하기 전에 스크린을 먼저 페인트할 수 있음
  - 리페인트를 막아야 한다면 `useLayoutEffect`로 대체해야 함
- useEffect는 클라이언트에서만 실행. 서버렌더링 중에는 실행되지 않음

<br>

## useLayoutEffect

- **`useLayoutEffect`는 성능을 저하시킬 수 있어, 가급적 `useEffect` 사용을 권장**
- 브라우저가 화면을 리페인트하기 전에 실행되는 버전의 `useEffect`
  ```js
  useLayoutEffect(setup, dependencies?)
  ```

### Parameters

- setup
  - Effect의 로직이 포함된 함수
  - 클린업 함수를 return 가능
  - 컴포넌트가 DOM에 추가되기 전 React는 셋업 함수를 실행
  - dependencies가 변경되어 리렌더링을 할 때마다 클린업 함수가 있다면 이전 값으로 클린업 함수를 실행한 다음, 새 값으로 셋업 함수를 실행
  - 컴포넌트가 DOM에서 제거되기 전, React는 셋업 함수를 한 번 더 실행
- dependencies(optional)
  - setup 함수 내에서 참조된 **모든 반응형 값**의 배열
  - React용으로 구성된 린터가 모든 반응형 값이 dependencies에 잘 지정되었는지 확인
  - 각 dependencies는 `Object.is` 로 이전 값과 비교
  - 빈 배열을 전달하면 컴포넌트가 리렌더링 될 때마다 useEffect를 실행

### Returns

- undefined를 반환

### 주의사항

- Strict Mode일 경우, 첫 번째 셋업 전에 개발전용 셋업과 클린업 사이클을 한 번 더 실행
  - 클린업 로직이 셋업 로직을 미러링하고 셋업의 작업을 모두 클린업 하는지 테스트하는 과정
  - 문제가 발생하면 클린업 함수를 구현해야 함
- dependencies가 컴포넌트 내에 정의된 객체나 함수인 경우, useEffect가 필요 이상으로 재실행 될 위험이 있음
  - 해결하기 위해선 불필요한 객체나 함수를 dependencies에서 제거하거나 useEffect 외부에서 state 업데이트와 비반응형 로직을 제거
- 클라이언트에서만 실행되기 때문에 서버 렌더링 중에는 실행되지 않음
- `useLayoutEffect` 내의 코드와 state 업데이트는 브라우저가 화면을 리페인트하는 걸 막음
  - 과도하게 사용하면 앱이 느려지기 때문에 `useEffect` 사용을 권장

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
