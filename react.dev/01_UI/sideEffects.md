# Describing the UI

## Side Effects: (un)intended consequences

- 리액트의 렌더링 프로세스는 항상 순수해야 함 <br>
  어떠한 입력값(props, state, context)도 변이해서는 안 됨

  - 컴포넌트는 오직 JSX만 반환
  - 렌더링 전에 존재했던 객체나 변수 변경 불가

- 오류 예시

  ```js
  let guest = 0;

  function Cup() {
    guest = guest + 1;
    return <h2>Tea cup for guest #{guest}</h2>;
  }
  ```

- 위 코드는 외부에서 선언된 guest 변수를 읽고 쓰고 있는 상태
- 이 컴포넌트는 호출할 때마다 다른 JSX가 생성됨
- 다른 컴포넌트가 guest를 읽으면 렌더링된 시점에 따라 JSX도 다르게 생성
- 해결: guest를 prop으로 전달

  ```js
  function Cup({ guest }) {
    return <h2>Tea cup for guest #{guest}</h2>;
  }
  ```

  <br>

## Where you can cause side effects

- 사이드 이펙트
  - 화면 업데이트, 애니메이션 시작, 데이터 변경과 같은 변경
  - 렌더링 중이 아닌 부수적으로 일어나는 일
- 이벤트 핸들러에 속함
  - 이벤트 핸들러: 컴포넌트 내부에 정의되지만 렌더링 중에 실행되지 않음
  - 따라서 순수할 필요가 없음
- 사이드 이펙트에 적합한 이벤트 핸들러를 찾을 수 없을 경우
  - 컴포넌트에서 `useEffect` 호출을 통해 반환된 JSX에 이벤트 핸들러를 첨부 가능
  - 렌더링 후 사이드 이펙트가 허용될 때 실행됨
  - _최후의 수단_
- **가능한 렌더링만으로 로직을 표현할 것**
