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
