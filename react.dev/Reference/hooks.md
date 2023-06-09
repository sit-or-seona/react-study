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

### 사용법

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

# Context Hooks

- props를 전달받지 않아도 컴포넌트가 조상으로부터 정보를 받을 수 있도록 하는 훅
  |hook|설명|
  |:---:|:---:|
  |useContext|context를 읽고 구독|

## useContext

- context를 읽고 구독할 수 있게 해주는 훅

```js
const value = useContext(SomeContext);
```

### Parameters

- context
  - `createContext`로 생성한 context
  - context 자체는 정보를 보유하지 않고, 정보의 종류를 나타냄

### Returns

- 호출하는 컴포넌트에 대한 context 값을 반환
  - context 값: 호출한 컴포넌트에 상위에 있는 가장 가까운 `SomeContext.Provider`에 전달된 value
  - provider가 없는 경우, `createContext`에 전달한 `defaultValue`
- 반환된 값은 항상 최신 값
- React는 context가 변경되면 context를 읽는 컴포넌트를 리렌더링

### 주의사항

- `useContext()` 호출은 `Context.Provider`가 **동일한 컴포넌트가 아닌 호출을 수행하는 컴포넌트의 상위**에 있어야 함
- React는 변경된 value를 받는 provider부터 시작해 해당 context를 사용하는 자식 컴포넌트도 모두 리렌더링
- 이전 값과 다음 값은 `Object.is`로 비교
- `memo`로 리렌더링을 건너뛰어도 자식들이 새로운 context 값을 수신하는 건 막지 못함
- context로 무언갈 전달할 때, context를 제공하는 `SomeContext`와 context를 읽는 `SomeContext`가 정확하게 동일한 객체일 경우에만 작동
  - 빌드 시스템이 출력 결과에 중복 모듈을 생성하는 경우 context가 손상 (ex. 심볼릭 링크 사용)

### 사용법

- 트리 깊숙이 데이터 전달

  ```js
  import { createContext, useContext } from "react";

  const ThemeContext = createContext(null);

  export default function MyApp() {
    return (
      <ThemeContext.Provider value="dark">
        <Form />
      </ThemeContext.Provider>
    );
  }

  function Form() {
    return (
      <Panel title="Welcome">
        <Button>Sign up</Button>
        <Button>Log in</Button>
      </Panel>
    );
  }

  function Panel({ title, children }) {
    const theme = useContext(ThemeContext);
    const className = "panel-" + theme;
    return (
      <section className={className}>
        <h1>{title}</h1>
        {children}
      </section>
    );
  }

  function Button({ children }) {
    const theme = useContext(ThemeContext);
    const className = "button-" + theme;
    return <button className={className}>{children}</button>;
  }
  ```

- context를 통해 전달된 데이터 업데이트

  - **context를 업데이트하기 위해선 state와 결합해야 함 (기본값은 절대 변경되지 않음)**
  - 부모 컴포넌트에 state 변수를 선언하고 state를 context value로 전달

  ```js
  function MyPage() {
    const [theme, setTheme] = useState("dark");
    return (
      <ThemeContext.Provider value={theme}>
        <Form />
        <Button
          onClick={() => {
            setTheme("light");
          }}
        >
          Switch to light theme
        </Button>
      </ThemeContext.Provider>
    );
  }
  ```

- 객체 및 함수를 value로 전달시 리렌더링 최적화
  - 리렌더링할 때마다 다른 객체/함수를 가리키게 되므로 context를 호출하는 모든 컴포넌트가 리렌더링되는 이슈 발생
  - value로 전달하는 객체/함수를 `useCallback`이나 `useMemo`로 감싸서 성능 최적화
    <br>

# Ref Hooks

- 컴포넌트가 렌더링에 사용되지 않는 정보(ex. DOM노드, timeout ID)를 유지하도록 하는 훅
- state와 달리 리렌더링을 유발하지 않음
- React에서 탈출구 역할이기 때문에 빌트인 브라우저 API와 같이 리액트 외의 시스템에서 작업해야 할 때 유용
  |hook|설명|
  |:---:|:---:|
  |useRef|ref를 선언하고 대부분 DOM 노드를 담음|
  |useImperativeHandle|컴포넌트가 노출하는 ref를 사용자가 직접 정의(거의 사용 안 함)|

## useRef

- 렌더링에 필요하지 않은 값을 참조할 수 있는 훅

```js
const ref = useRef(initialValue);
```

### Parameters

- initialValue
  - ref 객체의 `current` 프로퍼티의 초기 설정값
  - 초기 렌더링 이후부터는 무시됨

### Returns

- 단일 프로퍼티를 가진 `current` 객체를 반환
- `current`
  - 초기엔 initialValue이고 값 변경 가능
  - ref 객체를 JSX 노드의 `ref` 어트리뷰트로 전달하면 React는 `current` 프로퍼티를 설정
- 다음 렌더링에서 동일한 객체를 반환

### 주의사항

- `ref.current` 프로퍼티는 state와 달리 변경 가능
  - state를 포함하는 경우 변경 불가능
- `ref.current` 프로퍼티를 변경해도 리렌더링이 일어나지 않음
  - 일반 JavaScript 객체이기 때문
- 초기화를 제외하고 렌더링 중에 `ref.current`를 읽거나 작성하지 말 것
  - 컴포넌트의 동작을 예측할 수 없게 되기 때문
  ```js
  function MyComponent() {
    // ...
    // 🚩 Don't write a ref during rendering
    // 🚩 렌더링 중에 ref를 작성하지 마세요.
    myRef.current = 123;
    // ...
    // 🚩 Don't read a ref during rendering
    // 🚩 렌더링 중에 ref를 읽지 마세요.
    return <h1>{myOtherRef.current}</h1>;
  }
  ```
  - ref를 읽거나 작성하기 위해 이벤트 핸들러나 useEffect 사용
  ```js
  function MyComponent() {
    // ...
    useEffect(() => {
      // ✅ You can read or write refs in effects
      // ✅ Effect에서 ref를 읽거나 쓸 수 있습니다.
      myRef.current = 123;
    });
    // ...
    function handleClick() {
      // ✅ You can read or write refs in event handlers
      // ✅ 이벤트 핸들러에서 ref를 읽거나 쓸 수 있습니다.
      doSomething(myOtherRef.current);
    }
    // ...
  }
  ```
- Strict Mode에서 ref 객체는 두 번 생성되고 그중 하나는 버려짐 (개발 환경)

### 사용법

- ref를 사용했을 때 보장되는 것
  - 렌더링할 때마다 재설정되는 일반 변수와 달리 리렌더링 사이에 정보를 저장 가능
  - 리렌더링을 유발하는 state 변수와 달리 변경해도 리렌더링이 일어나지 않음
    - 화면에 표시되는 정보를 저장하는 데에 적합하지 않음
  - 정보가 공유되는 외부 변수와 달리 각각의 컴포넌트에 로컬로 저장됨
- ref로 DOM 조작하기

  - DOM 노드 `<input>` 접근해 `focus()`와 같은 메서드 호출 가능

  ```js
  import { useRef } from "react";

  export default function Form() {
    const inputRef = useRef(null);

    function handleClick() {
      inputRef.current.focus();
    }

    return (
      <>
        <input ref={inputRef} />
        <button onClick={handleClick}>Focus the input</button>
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

## useMemo

- 리렌더링 사이의 계산 결과를 캐시하는 훅

```js
const cachedValue = useMemo(calculateValue, dependencies);
```

### Parameters

- calculateValue
  - 캐시하려는 값을 계산하는 함수
  - 조건: 순수함수, 인자 X, 값 반환 필수
  - 초기 렌더링 중에 함수를 호출하고, 이후의 렌더링에서 dependencies가 변경되지 않았다면 동일한 값을 반환
  - dependencies가 변경되었다면 `calculateValue`를 호출하고 그 결과를 반환하며 값을 저장
- dependencies
  - `calculateValue` 코드 내에서 참조된 모든 반응형 값들의 배열
  - React용 린터를 사용해 모든 반응형 값이 dependencies로 올바르게 지정되었는지 확인
  - React는 `Object.is` 비교 알고리즘을 사용하여 각 의존성 값을 이전 값과 비교

### Returns

- 초기 렌더링: 인자 없이 `calculateValue`를 호출한 결과를 반환
- 이후 렌더링
  - dependencies가 변경되지 않은 경우에는 마지막 렌더링에서 저장된 값을 반환
  - dependencies가 변경된 경우 `calculateValue`를 다시 호출하여 그 결과를 반환

### 주의사항

- `useMemo`는 성능 최적화를 목적으로 사용해야 함
  - React는 특별한 이유가 없으면 캐시된 값을 유지
    - 개발 환경에서 컴포넌트의 파일을 수정할 경우 캐시를 제거
    - 개발&프로덕션 환경에서 컴포넌트가 초기 마운트 중에 중단되면 캐시를 제거
  - 성능 최적화를 위해 `useMemo`를 사용하는 경우 괜찮지만 state 변수나 ref가 더 적절할 수 있음

## useTransition

- UI를 차단하지 않고 state를 업데이트하는 훅
  ```js
  const [isPending, startTransition] = useTransition();
  ```

### Parameters

- 파라미터를 받지 않음

### Returns

- 정확히 2개의 원소가 있는 배열을 반환

1. isPending (boolean)
   : 대기 중인 트랜지션이 있는지 여부를 알려주는 플래그

2. startTransition
   : state 업데이트를 트랜지션으로 표시하는 함수

## useTransition - startTransition

- state 업데이트를 트랜지션으로 표시하는 함수

```js
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("about");

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

### Parameters

- scope
  - set 함수를 호출하여 일부 state를 업데이트하는 함수
  - React는 파라미터 없이 `scope` 함수를 즉시 호출하고 호출 중에 동기적으로 작동할 모든 state 업데이트를 트랜지션으로 표시
  - 논-블로킹이고 원치 않는 로딩 표시를 하지 않음

### Returns

- 반환값이 없음

### 주의사항

- 해당 state의 set함수에 접근 가능한 경우에만 업데이트를 트랜지션으로 감쌀 수 있음
  - prop이나 커스텀 훅 value의 응답에서 트랜지션을 시작하고 싶다면 `useDeferredValue` 사용을 권장
- `startTransition`에 전달하는 함수는 동기적으로 작동해야 함
  - React는 이 함수를 즉시 실행하여 실행하는 동안 발생하는 모든 state 업데이트를 트랜지션으로 표시
  - 나중에 더 많은 state 업데이트를 수행하려고 하면 트랜지션으로 표시되지 않음
- 트랜지션으로 표시된 state 업데이트는 다른 state 업데이트에 의해 중단됨
  - 트랜지션 내부에 있는 컴포넌트를 업데이트한 후 리렌더링이 되는 중에 다른 state가 업데이트된다면 해당 state부터 핸들링 한 후에 트랜지션 내부에 있는 컴포넌트 렌더링을 다시 시작
- 텍스트 input을 제어하는 데 사용 불가
- 진행 중인 트랜지션이 여러 개가 있는 경우, React는 일괄 처리 (다음 릴리즈에서 제거될 가능성이 높은 사항)

### 사용법

- state 업데이트를 논블로킹 트랜지션으로 표시

  - 리렌더링 도중에도 UI가 반응성을 유지
  - 트랜지션을 사용하면 느린 디바이스에서도 사용자 인터페이스 업데이트의 반응성을 유지 가능
  - 아래 코드에서 사용자가 탭을 클릭했다가 마음이 바뀌어 다른 탭을 클릭하면 첫 번째 리렌더링이 완료될 때까지 기다릴 필요 없이 다른 탭을 클릭 가능

  ```js
  function TabContainer() {
    const [isPending, startTransition] = useTransition();
    const [tab, setTab] = useState("about");

    function selectTab(nextTab) {
      startTransition(() => {
        setTab(nextTab);
      });
    }
    // ...
  }
  ```

- 트랜지션에서 상위 컴포넌트 업데이트
  - 부모 컴포넌트의 state를 `startTransition`로 감쌀 수 있음
- 트랜지션 중에 ‘대기중’ state 표시
  - `isPending` 값을 이용해 트랜지션이 진행 중임을 사용자에게 표시 가능
  ```js
  function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
  ```
- 원치 않는 로딩 표시 방지

  - 로딩 표시를 위해 전체 컴포넌트를 숨기면 UX가 어색해지는 경우, `useTransition`을 추가
  - 스피너 대신 위와 같이 `isPending` 값을 이용해 '대기중' 표시

- Suspense가 도입된 라우터 구축

  - React 프레임워크나 라우터를 구축하는 경우 페이지 네비게이션을 트랜지션으로 표시하는 것을 권장
    - 트랜지션은 중단 가능하기 때문에 사용자가 리렌더링이 완료될 때까지 기다리지 않고 바로 클릭 가능
    - 트랜지션은 원치 않는 로딩 표시를 방지하기 때문에 사용자가 네비게이션을 갑작스럽게 이동하는 것을 방지

  ```js
  import { Suspense, useState, useTransition } from "react";
  import IndexPage from "./IndexPage.js";
  import ArtistPage from "./ArtistPage.js";
  import Layout from "./Layout.js";

  export default function App() {
    return (
      <Suspense fallback={<BigSpinner />}>
        <Router />
      </Suspense>
    );
  }

  function Router() {
    const [page, setPage] = useState("/");
    const [isPending, startTransition] = useTransition();

    function navigate(url) {
      startTransition(() => {
        setPage(url);
      });
    }

    let content;
    if (page === "/") {
      content = <IndexPage navigate={navigate} />;
    } else if (page === "/the-beatles") {
      content = (
        <ArtistPage
          artist={{
            id: "the-beatles",
            name: "The Beatles",
          }}
        />
      );
    }
    return <Layout isPending={isPending}>{content}</Layout>;
  }

  function BigSpinner() {
    return <h2>🌀 Loading...</h2>;
  }
  ```

  - \* 중첩된 `<Suspense>` 바운더리가 있는 경우 트랜지션은 대기하지 않음
  - \* Suspense가 도입된 라우터는 네비게이션 업데이트를 트랜지션으로 감싸고 있을 것이라고 간주
