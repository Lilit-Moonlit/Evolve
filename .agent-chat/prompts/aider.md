# Aider + Ollama — як користуватись

Aider — це термінальний інструмент, він не читає файли і не перевіряє чат сам.
Його **запускає людина або інший агент**, коли треба зробити задачу локально.

---

## Коли запускати Aider

1. Інші агенти недоступні (`availability: offline`)
2. Немає інтернету
3. Проста задача (додати імпорт, змінити конфіг, перейменувати) — не варто витрачати хмарні токени
4. Термінова правка, а хмарні моделі зайняті

---

## Запуск з нуля

### 1. Запустити Ollama (один раз)

```powershell
ollama serve
```

### 2. Скачати модель (один раз)

```powershell
ollama pull deepseek-coder-v2:16b
```

### 3. Запустити Aider

```powershell
# Інтерактивно (сам напишеш що треба)
aider --model ollama/deepseek-coder-v2:16b --file apps/web/src/App.tsx

# З одноразовою задачею (без інтерактиву)
aider --model ollama/deepseek-coder-v2:16b --message "Add polygon chain to config" --file apps/web/src/App.tsx
```

### Або через скрипт

```powershell
.\.agent-chat\scripts\aider-run.ps1 -Task "Add polygon chain to config" -Files "apps/web/src/App.tsx"
```

Скрипт сам: запустить Ollama, скачає модель, виконає задачу.

---

## Що робити КОЛИ Aider відповів

Aider відповів у терміналі, зробив правки. Тепер:

1. **Оновити статус** в `.agent-chat/status/aider.md`:

   ```markdown
   agent: aider
   status: done
   current_task: Add polygon chain
   last_active: 2026-06-22T09:00:00Z
   lock_files: apps/web/src/App.tsx
   availability: online
   ```

2. **Запустити тести**:

   ```powershell
   cd apps/web; npm test
   ```

3. **Написати в чат** (якщо треба передати комусь):
   ```powershell
   # створити файл .agent-chat/messages/YYYY-MM-DD_HHMMSS_aider-to-AGENT.md
   # з from/to/status/subject
   ```

---

## Що вміє Aider (основне)

| Команда                 | Що робить                    |
| ----------------------- | ---------------------------- |
| `--file file.tsx`       | Додати файл в контекст       |
| `--read file.tsx`       | Файл тільки для читання      |
| `--message "текст"`     | Розова задача                |
| `--model ollama/МОДЕЛЬ` | Яку модель використати       |
| `--no-auto-commits`     | Не комітити автоматично      |
| `--yes`                 | Погоджуватись на всі питання |

---

## Які моделі доступні

```powershell
ollama list  # показати всі скачані моделі
```

Рекомендації:

- `deepseek-coder-v2:16b` — кодер, добре для TypeScript, React
- `codellama:34b` — кодер, великий контекст
- `llama3.3:70b` — загальна, якісна
- `qwen2.5-coder:14b` — швидка, легка
