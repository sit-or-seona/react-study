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
