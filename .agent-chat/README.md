# Agent Chat — Peer-to-Peer Coordination

Рівноправний файловий месенджер для агентів. Ніяких привілегій, ніяких "жандармів".

## Чому це потрібно

Агенти можуть зникати: модель недоступна, час вийшов, контекст загубився.
Замість того щоб чекати — **інший агент підхоплює задачу**.

## Як це працює

Кожен агент має:

- **`status/AGENT.md`** — хто що робить, які файли заблоковані, чи онлайн
- **`messages/`** — повідомлення між агентами
- **`prompts/AGENT.md`** — персональна інструкція

## Статус агента

```yaml
# status/opencode.md
agent: opencode
status: idle | working | blocked | done
current_task: Multichain config
last_active: 2026-06-22T09:00:00Z
lock_files: apps/web/src/App.tsx
availability: online | limited | offline
```

### availability

- `online` — можу працювати
- `limited` — працюю повільно, краще щоб хтось інший узяв якщо терміново
- `offline` — не можу продовжити, задачу треба перерозподілити

### status

- `idle` — вільний
- `working` — виконую задачу
- `blocked` — потребую допомоги / чекаю відповіді
- `done` — задача виконана

## Надсилання повідомлення

Створи файл у `messages/YYYY-MM-DD_HHMMSS_from-to.md`:

```markdown
---
from: opencode
to: devin
subject: STD parser — need review
status: unread
---

Текст повідомлення...
```

Після прочитання → `status: read`.

## Перерозподіл задач (Task Handover)

### Коли ти не можеш далі

1. Постав `availability: offline` у своєму статусі
2. Додай `status: done` (якщо частково зроблено) або `blocked`
3. Напиши `to: all` що тобі треба заміна

У повідомленні обов'язково вкажи:

- Що вже зроблено
- Що залишилось
- Які файли чіпав
- Будь-які важливі деталі

### Коли інший offline

1. Перевір його статус — що він робив, які файли
2. Прочитай його останні повідомлення
3. Напиши `to: all` що береш задачу
4. Онови свій `lock_files` і берись

### Коли задача нічия

Якщо в `messages/` є задача `to: AGENT` але той агент в `availability: offline` — можеш узяти.

## Узгодження файлів (locking)

Перед зміною файлу → додай у свій `status` → `lock_files:`.
Після завершення → очисти `lock_files`.

Це запобігає конфліктам, коли два агенти редагують одне й те саме.

## Агенти

| Alias         | Role                         | Мережа   |
| ------------- | ---------------------------- | -------- |
| `opencode`    | Frontend, Config, Infra      | Хмарна   |
| `antigravity` | Audit, QA, Code Review       | Хмарна   |
| `devin`       | Mobile, Profile, Camera, STD | Хмарна   |
| `cline`       | Settings, Wallet, Language   | Хмарна   |
| `aider`       | Backup, прості правки        | Локальна |

Aider працює локально через Ollama — не потребує інтернету чи API ключів.
Запуск: `.agent-chat\scripts\aider-run.ps1`

## Швидкі команди

```bash
# Вхідні для себе
grep "to: YOUR_NAME\|to: all" .agent-chat/messages/*.md | Select-String "unread"

# Хто онлайн
grep "availability" .agent-chat/status/*.md

# Хто в offline (є висячі задачі)
grep "availability: offline" .agent-chat/status/*.md
```
