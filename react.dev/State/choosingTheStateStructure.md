# Choosing the State Structure

- state를 잘 구조화하면 수정과 디버깅이 편한 컴포넌트 생성 가능

## state 구조화 원칙

1. 관련 state를 그룹화

- 항상 2개 이상의 state 변수를 동시에 업데이트하는 경우, 단일 state 변수로 병합

2. state의 모순을 피할 것

- 여러 state 조각이 서로 모순되거나 불일치할 수 있는 방식으로 state를 구성하면 실수가 발생할 여지가 생기기 때문에 피할 것

3. 불필요한 state를 피할 것

- 렌더링 중에 컴포넌트의 props나 기존 state 변수에서 일부 정보를 계산할 수 있다면 해당 정보를 해당 컴포넌트의 state에 넣지 말 것

4. state 중복을 피할 것

- 동일한 데이터가 여러 state 변수 간에 또는 중첩된 객체 내에 중복되면 동기화 state를 유지하기 어렵기 때문에 중복을 줄일 것

5. 깊게 중첩된 state는 피할 것

- 깊게 계층화된 state는 업데이트하기 쉽지 않기 때문에 state를 최대한 평평한 방식으로 구성

```
- 원칙의 목표: 실수 없이 state를 쉽게 업데이트할 수 있도록 하는 것
- state에서 불필요하거나 중복된 데이터를 제거하면 모든 데이터가 동기화 상태를 유지하는 데 도움이 됨 ➡️ 데이터베이스 구조를 정규화하는 것과 유사
"state를 최대한 단순하게 만들되, 그보다 더 단순해서는 안 됩니다." - 알버트 아인슈타인
```

## 1. 관련 state를 그룹화

```js
// case 1
const [x, setX] = useState(0);
const [y, setY] = useState(0);

// case 2
const [position, setPosition] = useState({ x: 0, y: 0 });
```

- case 1의 2개의 state 변수가 항상 함께 변경되는 경우, 하나의 state 변수로 통합하기

```js
import { useState } from "react";

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: "red",
          borderRadius: "50%",
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  );
}
```

- 다른 케이스로는 필요한 state의 조각 수를 모를 때 데이터를 객체나 배열로 그룹화
  - ex. 사용자가 사용자 정의 필드를 추가할 수 있는 양식

```
*
state 변수가 객체인 경우, 그 안의 1개의 필드만 업데이트 불가능
➡️ 위 예제에서 setPosition({x: 100}) 수행 불가능

x만 설정하고 싶은 경우,
1. setPosition({...position, x: 100})
2. 2개의 state 변수로 분할하여 setX(100)
```

## 2. state의 모순을 피할 것

```js
import { useState } from "react";

export default function FeedbackForm() {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Thanks for feedback!</h1>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button disabled={isSending} type="submit">
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
}
```

- 위 코드는 작동하지만 불가능한 state의 설정을 허용하고 있음
  - `setIsSent`와 `setIsSending` 중 어느 하나만 호출하면 2개가 동시에 `true`가 되는 상황 발생 가능
  - 컴포넌트가 복잡할수록 무슨 일이 일어났는지 파악하기 어려움
- ➡️ `status`라는 state 변수 하나로 대체
  - status: `typing`(초기값), `sending`, `sent`

```js
import { useState } from "react";

export default function FeedbackForm() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("typing");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    await sendMessage(text);
    setStatus("sent");
  }

  const isSending = status === "sending";
  const isSent = status === "sent";

  if (isSent) {
    return <h1>Thanks for feedback!</h1>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button disabled={isSending} type="submit">
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
}
```

- 가독성을 위해 상수 선언
  - state 변수가 아니기 때문에 2개의 동기화 걱정 X
  ```js
  const isSending = status === "sending";
  const isSent = status === "sent";
  ```

## 3. 불필요한 state를 피할 것

- 렌더링 중에 컴포넌트의 props나 기존 state 변수에서 일부 정보를 계산할 수 있는 경우 해당 정보를 컴포넌트의 state에 넣지 않아야 함

```js
import { useState } from "react";

export default function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + " " + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + " " + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name: <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name: <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

- 위 코드에서 `fullName` state 변수는 불필요
- 렌더링 중 언제든 `firstName`과 `lastName`에서 `fullName`을 계산할 수 있기 때문에 state에서 제거

```js
import { useState } from "react";

export default function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const fullName = firstName + " " + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name: <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name: <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

- `fullName`은 state 변수가 아니지만 렌더링 중에 계산됨
  - 변경 핸들러는 `fullName`을 업데이트하기 위해 작업을 수행할 필요 X
  - `setFirstName` 또는 `setLastName`을 호출하면 리렌더링되기 때문에 `fullName`이 새 데이터로 계산됨

## 4. state 중복을 피할 것

```js
import { useState } from "react";

const initialItems = [
  { title: "pretzels", id: 0 },
  { title: "crispy seaweed", id: 1 },
  { title: "granola bar", id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(items[0]);

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.title}{" "}
            <button
              onClick={() => {
                setSelectedItem(item);
              }}
            >
              Choose
            </button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

- 위 코드에서 선택된 항목은 `selectedItem` state 변수에 객체로 저장됨 ➡️ 좋지 않은 코드
- `selectedItem`의 내용은 `items` 목록 내의 항목 중 하나와 동일한 객체이기 때문에 정보가 2곳에서 중복됨
  - 각 항목을 편집하도록 수정할 경우, 입력은 업데이트되지만 하단의 레이블에 편집 내용이 반영되지 않음 `selectedItem`은 업데이트 X

```js
import { useState } from "react";

const initialItems = [
  { title: "pretzels", id: 0 },
  { title: "crispy seaweed", id: 1 },
  { title: "granola bar", id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find((item) => item.id === selectedId);

  function handleItemChange(id, e) {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: e.target.value,
          };
        } else {
          return item;
        }
      })
    );
  }

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={(e) => {
                handleItemChange(item.id, e);
              }}
            />{" "}
            <button
              onClick={() => {
                setSelectedId(item.id);
              }}
            >
              Choose
            </button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

- 이전에 state가 복제한 형태
  ```js
  items = [{ id: 0, title: 'pretzels'}, ...]
  selectedItem = {id: 0, title: 'pretzels'}
  ```
- 변경 후 state
  ```js
  items = [{ id: 0, title: 'pretzels'}, ...]
  selectedId = 0
  ```
- ➡️ 중복은 사라지고 필수 state인 선택된 ID만 유지
  - 항목을 편집하면 아래 메세지도 즉시 업데이트
  - `setItems`가 리렌더링을 유발하고 `items.find(...)`가 업데이트된 제목의 항목을 찾기 때문

## 5. 깊게 중첩된 state는 피할 것

```js
export const initialTravelPlan = {
  id: 0,
  title: "(Root)",
  childPlaces: [
    {
      id: 1,
      title: "Earth",
      childPlaces: [
        {
          id: 2,
          title: "Africa",
          childPlaces: [
            {
              id: 3,
              title: "Botswana",
              childPlaces: [],
            },
            {
              id: 4,
              title: "Egypt",
              childPlaces: [],
            },
            {
              id: 5,
              title: "Kenya",
              childPlaces: [],
            },
            {
              id: 6,
              title: "Madagascar",
              childPlaces: [],
            },
            {
              id: 7,
              title: "Morocco",
              childPlaces: [],
            },
            {
              id: 8,
              title: "Nigeria",
              childPlaces: [],
            },
            {
              id: 9,
              title: "South Africa",
              childPlaces: [],
            },
          ],
        },
        {
          id: 10,
          title: "Americas",
          childPlaces: [
            {
              id: 11,
              title: "Argentina",
              childPlaces: [],
            },
            {
              id: 12,
              title: "Brazil",
              childPlaces: [],
            },
            {
              id: 13,
              title: "Barbados",
              childPlaces: [],
            },
            {
              id: 14,
              title: "Canada",
              childPlaces: [],
            },
            {
              id: 15,
              title: "Jamaica",
              childPlaces: [],
            },
            {
              id: 16,
              title: "Mexico",
              childPlaces: [],
            },
            {
              id: 17,
              title: "Trinidad and Tobago",
              childPlaces: [],
            },
            {
              id: 18,
              title: "Venezuela",
              childPlaces: [],
            },
          ],
        },
        {
          id: 19,
          title: "Asia",
          childPlaces: [
            {
              id: 20,
              title: "China",
              childPlaces: [],
            },
            {
              id: 21,
              title: "Hong Kong",
              childPlaces: [],
            },
            {
              id: 22,
              title: "India",
              childPlaces: [],
            },
            {
              id: 23,
              title: "Singapore",
              childPlaces: [],
            },
            {
              id: 24,
              title: "South Korea",
              childPlaces: [],
            },
            {
              id: 25,
              title: "Thailand",
              childPlaces: [],
            },
            {
              id: 26,
              title: "Vietnam",
              childPlaces: [],
            },
          ],
        },
        {
          id: 27,
          title: "Europe",
          childPlaces: [
            {
              id: 28,
              title: "Croatia",
              childPlaces: [],
            },
            {
              id: 29,
              title: "France",
              childPlaces: [],
            },
            {
              id: 30,
              title: "Germany",
              childPlaces: [],
            },
            {
              id: 31,
              title: "Italy",
              childPlaces: [],
            },
            {
              id: 32,
              title: "Portugal",
              childPlaces: [],
            },
            {
              id: 33,
              title: "Spain",
              childPlaces: [],
            },
            {
              id: 34,
              title: "Turkey",
              childPlaces: [],
            },
          ],
        },
        {
          id: 35,
          title: "Oceania",
          childPlaces: [
            {
              id: 36,
              title: "Australia",
              childPlaces: [],
            },
            {
              id: 37,
              title: "Bora Bora (French Polynesia)",
              childPlaces: [],
            },
            {
              id: 38,
              title: "Easter Island (Chile)",
              childPlaces: [],
            },
            {
              id: 39,
              title: "Fiji",
              childPlaces: [],
            },
            {
              id: 40,
              title: "Hawaii (the USA)",
              childPlaces: [],
            },
            {
              id: 41,
              title: "New Zealand",
              childPlaces: [],
            },
            {
              id: 42,
              title: "Vanuatu",
              childPlaces: [],
            },
          ],
        },
      ],
    },
    {
      id: 43,
      title: "Moon",
      childPlaces: [
        {
          id: 44,
          title: "Rheita",
          childPlaces: [],
        },
        {
          id: 45,
          title: "Piccolomini",
          childPlaces: [],
        },
        {
          id: 46,
          title: "Tycho",
          childPlaces: [],
        },
      ],
    },
    {
      id: 47,
      title: "Mars",
      childPlaces: [
        {
          id: 48,
          title: "Corn Town",
          childPlaces: [],
        },
        {
          id: 49,
          title: "Green Hill",
          childPlaces: [],
        },
      ],
    },
  ],
};
```

- 행성, 대륙, 국가로 구성된 여행 계획을 위한 장소 리스트
- 이미 방문한 장소를 삭제하는 버튼 추가를 위해선 중첩된 state를 업데이트 ➡️ 객체의 복사본을 만들어야 함 ➡️ 깊게 중첩된 장소를 삭제하려면 해당 장소의 상위 장소 체인 전체를 복사 ➡️ 코드가 장황
- **state가 너무 깊게 중첩되어 업데이트하기 어려운 경우 “flat”하게 만드는 것을 고려해 볼 것**
  - 위의 경우, 각 place가 하위 place의 배열을 갖는 트리구조 대신, 각 place가 자식 place ID 배열을 보유하도록 수정 ➡️ 각 place ID에서 해당 place로 매핑을 저장

```js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: "(Root)",
    childIds: [1, 43, 47],
  },
  1: {
    id: 1,
    title: "Earth",
    childIds: [2, 10, 19, 27, 35],
  },
  2: {
    id: 2,
    title: "Africa",
    childIds: [3, 4, 5, 6, 7, 8, 9],
  },
  3: {
    id: 3,
    title: "Botswana",
    childIds: [],
  },
  4: {
    id: 4,
    title: "Egypt",
    childIds: [],
  },
  5: {
    id: 5,
    title: "Kenya",
    childIds: [],
  },
  6: {
    id: 6,
    title: "Madagascar",
    childIds: [],
  },
  7: {
    id: 7,
    title: "Morocco",
    childIds: [],
  },
  8: {
    id: 8,
    title: "Nigeria",
    childIds: [],
  },
  9: {
    id: 9,
    title: "South Africa",
    childIds: [],
  },
  10: {
    id: 10,
    title: "Americas",
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: "Argentina",
    childIds: [],
  },
  12: {
    id: 12,
    title: "Brazil",
    childIds: [],
  },
  13: {
    id: 13,
    title: "Barbados",
    childIds: [],
  },
  14: {
    id: 14,
    title: "Canada",
    childIds: [],
  },
  15: {
    id: 15,
    title: "Jamaica",
    childIds: [],
  },
  16: {
    id: 16,
    title: "Mexico",
    childIds: [],
  },
  17: {
    id: 17,
    title: "Trinidad and Tobago",
    childIds: [],
  },
  18: {
    id: 18,
    title: "Venezuela",
    childIds: [],
  },
  19: {
    id: 19,
    title: "Asia",
    childIds: [20, 21, 22, 23, 24, 25, 26],
  },
  20: {
    id: 20,
    title: "China",
    childIds: [],
  },
  21: {
    id: 21,
    title: "Hong Kong",
    childIds: [],
  },
  22: {
    id: 22,
    title: "India",
    childIds: [],
  },
  23: {
    id: 23,
    title: "Singapore",
    childIds: [],
  },
  24: {
    id: 24,
    title: "South Korea",
    childIds: [],
  },
  25: {
    id: 25,
    title: "Thailand",
    childIds: [],
  },
  26: {
    id: 26,
    title: "Vietnam",
    childIds: [],
  },
  27: {
    id: 27,
    title: "Europe",
    childIds: [28, 29, 30, 31, 32, 33, 34],
  },
  28: {
    id: 28,
    title: "Croatia",
    childIds: [],
  },
  29: {
    id: 29,
    title: "France",
    childIds: [],
  },
  30: {
    id: 30,
    title: "Germany",
    childIds: [],
  },
  31: {
    id: 31,
    title: "Italy",
    childIds: [],
  },
  32: {
    id: 32,
    title: "Portugal",
    childIds: [],
  },
  33: {
    id: 33,
    title: "Spain",
    childIds: [],
  },
  34: {
    id: 34,
    title: "Turkey",
    childIds: [],
  },
  35: {
    id: 35,
    title: "Oceania",
    childIds: [36, 37, 38, 39, 40, 41, 42],
  },
  36: {
    id: 36,
    title: "Australia",
    childIds: [],
  },
  37: {
    id: 37,
    title: "Bora Bora (French Polynesia)",
    childIds: [],
  },
  38: {
    id: 38,
    title: "Easter Island (Chile)",
    childIds: [],
  },
  39: {
    id: 39,
    title: "Fiji",
    childIds: [],
  },
  40: {
    id: 40,
    title: "Hawaii (the USA)",
    childIds: [],
  },
  41: {
    id: 41,
    title: "New Zealand",
    childIds: [],
  },
  42: {
    id: 42,
    title: "Vanuatu",
    childIds: [],
  },
  43: {
    id: 43,
    title: "Moon",
    childIds: [44, 45, 46],
  },
  44: {
    id: 44,
    title: "Rheita",
    childIds: [],
  },
  45: {
    id: 45,
    title: "Piccolomini",
    childIds: [],
  },
  46: {
    id: 46,
    title: "Tycho",
    childIds: [],
  },
  47: {
    id: 47,
    title: "Mars",
    childIds: [48, 49],
  },
  48: {
    id: 48,
    title: "Corn Town",
    childIds: [],
  },
  49: {
    id: 49,
    title: "Green Hill",
    childIds: [],
  },
};
```

- 위의 코드는 flat(정규화라고도 함)해졌으므로 중첩된 항목을 업데이트하는 것이 쉬워짐
- 장소를 제거하려면 두 단계의 state만 업데이트
  - 부모 장소의 업데이트된 버전은 제거된 ID를 `childIds` 배열에서 제외
  - 루트 테이블 객체의 업데이트된 버전에는 상위 위치의 업데이트된 버전이 포함되어야 함

```js
import { useState } from "react";
import { initialTravelPlan } from "./places.js";

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Create a new version of the parent place
    // that doesn't include this child ID.
    const nextParent = {
      ...parent,
      childIds: parent.childIds.filter((id) => id !== childId),
    };
    // Update the root state object...
    setPlan({
      ...plan,
      // ...so that it has the updated parent.
      [parentId]: nextParent,
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map((id) => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button
        onClick={() => {
          onComplete(parentId, id);
        }}
      >
        Complete
      </button>
      {childIds.length > 0 && (
        <ol>
          {childIds.map((childId) => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      )}
    </li>
  );
}
```
