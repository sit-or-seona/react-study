# Performance Hooks

## useCallback

- 리렌더링 사이에 함수 정의를 캐시할 수 있게 해주는 훅
- useCallback(fn, dependencies)
  - dependencies가 변경될 때까지 fn을 저장하고 재사용할 수 있게 함

### Parameter

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
