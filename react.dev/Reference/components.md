# Built-in React Components

|  components   |                            설명                             |
| :-----------: | :---------------------------------------------------------: |
|  \<Fragment>  |         `<>...</>`를 사용해 여러 JSX 노드를 그룹화          |
|  \<Profiler>  |       프로그램적으로 React 트리의 렌더링 성능을 측정        |
| \<Sumspense>  |          자식 컴포넌트가 로딩되는 동안 폴백을 표시          |
| \<StrictMode> | 버그를 일찍 발견하는 데 도움을 주는 개발 전용 검사를 활성화 |

## Fragment `<>...</>`

- wrapper 노드 없이 요소를 그룹화

  ```js
  <>
    <OneChild />
    <AnotherChild />
  </>
  ```

- 실제 DOM에는 아무런 영향을 주지 않음

### Props

- key (optional)
  - 명시적인 `<Fragment>` 구문으로 선언하면 key 추가 가능

### 주의사항

- key를 전달하려는 경우 `<>...</>` 구문 사용 불가
  - `<Fragment key={key}>...</Fragment>`를 렌더링해야 함
- `<><Child /></>`와 `[<Child />]` 사이 또는 `<><Child /></>`와 `<Child />` 사이를 렌더링할 때 state를 재설정하지 않음
  - 1단계 깊이에서만 작동
  - `<><><Child /></></>`에서 `<Child />`는 state를 재설정

### 사용법

- 여러 elements 반환
- 변수에 여러 elenets 할당
- 텍스트와 함께 그룹화
- 반복문(map)에서 여러 elements를 렌더링
  - `Fragment` 구문을 작성해 각 elements에 key를 할당
  ```js
  function Blog() {
    return posts.map((post) => (
      <Fragment key={post.id}>
        <PostTitle title={post.title} />
        <PostBody body={post.body} />
      </Fragment>
    ));
  }
  ```

## Profiler

- `<Profiler>`를 사용하면 React 트리의 렌더링 성능을 측정 가능

  ```js
  <Profiler id="App" onRender={onRender}>
    <App />
  </Profiler>
  ```

### Props

- id
  - 측정할 UI 부분을 식별하는 문자열
- onRender
  - 프로파일링된 트리의 컴포넌트가 업데이트할 때마다 React가 호출하는 콜백
  - 렌더링된 내용과 소요 시간에 대한 정보를 받음

### 주의사항

- 오버헤드(간접 비용)가 추가되기 때문에 프로덕션 빌드에서는 비활성화가 default 값
- 프로덕션 환경에서 사용시 프로파일링이 활성화된 특수 프로덕션 빌드를 활성화해야 함

## Profiler - onRender 콜백

- React는 렌더링 내용에 대한 정보와 함께 onRender 콜백을 호출

  ```js
  function onRender(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) {
    // Aggregate or log render timings...
    // 렌더링 타이밍을 집계하거나 로그를 남깁니다...
  }
  ```

### Parameters

- id
  - `<Profiler> 트리의 id 문자열
  - 여러 프로파일러 사용시 커밋된 트리를 식별
- phase
  - `mount` `update` `nested-update` 중 1개
  - 트리가 처음 마운트 되었는지, 리렌더링되었는지 알 수 있음
- actualDuration
  - 현재 업데이트에서 `<Profiler>`와 그 자손들이 렌더링되는 데에 소요된 시간(ms 단위)
  - 하위 트리가 메모화(`memo`, `useMemo`)를 얼마나 잘 사용하는지를 나타냄
  - 이상적으로 이 값은 최초 마운트 이후에 크게 감소해야 함
    - 많은 자손들이 특정 props가 변경되었을 때만 리렌더링이 되기 때문
- baseDuration
  - 전체 `<Profiler>`의 하위 트리를 최적화 없이 리렌더링 하는 데 소요된 시간(ms 단위)
  - 트리에 있는 각 컴포넌트의 가장 최근 렌더링 시간을 합산하여 계산
  - 이 값은 최악의 렌더링 비용을 추정
  - `actualDuration`과 비교하여 메모화가 잘 작동하는지 확인
- startTime
  - React가 현재 업데이트를 렌더링하기 시작한 시점의 타임스탬프
- endTime
  - React가 현재 업데이트를 커밋한 시점의 타임스탬프
  - 이 값은 커밋한 모든 프로파일러 간에 공유되기 때문에 그룹화 가능

### 사용법

- 렌더링 성능 측정
  - 중첩 가능
  - 가벼운 컴포넌트지만 필요한 경우에만 사용할 것을 권장 (CPU 및 메모리 오버헤드가 추가)
  ```js
  <App>
    <Profiler id="Sidebar" onRender={onRender}>
      <Sidebar />
    </Profiler>
    <Profiler id="Content" onRender={onRender}>
      <Content>
        <Profiler id="Editor" onRender={onRender}>
          <Editor />
        </Profiler>
        <Preview />
      </Content>
    </Profiler>
  </App>
  ```

## Suspense

- 자식이 로딩을 완료할 때까지 폴백을 화면에 표시
  ```js
  <Suspense fallback={<Loading />}>
    <SomeComponent />
  </Suspense>
  ```

### Props

- children
  - 렌더링하려는 실제 UI
  - children이 렌더링 중 일시 중단되면 Suspense 바운더리가 `fallback` 렌더링으로 전환
- fallback
  - 실제 UI의 로딩이 완료되지 않은 경우 렌더링할 대체 UI
  - 주로 로딩 스피너나 스켈레톤을 사용
  - `children`이 일시 중단되면 `fallback`으로 전환되고, 데이터가 준비되면 다시 `children`으로 전환
  - 만약 `fallback`이 렌더링 중 일시 중단되면 가장 가까운 상위 Suspense 바운더리가 활성화 (→ 직계자식일 필요가 X)

### 주의사항

- React는 처음 마운트하기 전에 일시 중단된 렌더링의 state를 보존하지 않기 때문에 컴포넌트가 로드되면 React는 일시 중단된 트리의 렌더링을 처음부터 다시 시도
- Suspense가 트리에 대한 컨텐츠를 표시하고 있다가 다시 일시 중단된 경우, `fallback`이 다시 표시
  - 그 원인이 된 업데이트가 `startTransition`이나 `useDeferredValue`로 인한 것이 아닐 경우
- 이미 표시된 컨텐츠가 다시 일시 중단되어 숨겨야 하는 경우, React는 컨텐츠 트리에서 **layout Effects**를 클린업하고, 컨텐츠가 다시 표시될 준비가 되면 layout Effect를 다시 실행
  - 컨텐츠가 숨겨져 있는 동안 Effect가 DOM 레이아웃을 측정하는 작업을 시도하지 않도록 함
- React에는 Suspense와 통합된 내부 최적화가 포함되어 있음 (ex. Streaming Server Rendering, Selective Hydration)

### 사용법

- 콘텐츠를 로딩하는 동안 폴백 표시
- Note

  ```
  <Suspense 컴포넌트를 활성화하는 소스>
  - Relay 및 Next.js와 같은 Suspense 도입 프레임워크를 사용한 데이터 패칭
  - lazy를 사용한 지연 로딩 컴포넌트 코드

  <주의>
  - Effect나 이벤트 핸들러 내부에서 페칭하는 경우 감지하지 않음
  ```

- 콘텐츠를 한 번에 드러내기

  - Suspense 내부의 전체 트리는 단일 단위로 취급되기 때문에 하나의 데이터 대기를 위해 일시 중단되더라도 모든 컴포넌트가 `fallback`으로 대체

  ```js
  <Suspense fallback={<Loading />}>
    <Biography />
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
  ```

- 새 콘텐츠가 로드되는 동안 이전 콘텐츠 표시

  - `useDeferredValue` 훅을 함께 사용해 새 결과가 준비될 때까지 이전 결과를 계속 표시

  ```js
  import { Suspense, useState, useDeferredValue } from "react";
  import SearchResults from "./SearchResults.js";

  export default function App() {
    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);
    const isStale = query !== deferredQuery;
    return (
      <>
        <label>
          Search albums:
          <input value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <Suspense fallback={<h2>Loading...</h2>}>
          // 이전 결과와의 구분을 위해 스타일 추가
          <div style={{ opacity: isStale ? 0.5 : 1 }}>
            <SearchResults query={deferredQuery} />
          </div>
        </Suspense>
      </>
    );
  }
  ```

- 이미 표시된 콘텐츠가 숨겨지지 않도록 방지

  - 컴포넌트가 일시 중단되면 Suspense 바운더리의 폴백으로 전환되는데, 이미 일부 컨텐츠가 표시되고 있는 경우 UX가 어색해짐
  - 이를 방지하기 위해 `startTransition`을 사용해 네비게이션 state 업데이트를 트랜지션으로 표시
    (hooks - useTransition 참고)

  ```js
  import { Suspense, startTransition, useState } from "react";
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
    return <Layout>{content}</Layout>;
  }

  function BigSpinner() {
    return <h2>🌀 Loading...</h2>;
  }
  ```
