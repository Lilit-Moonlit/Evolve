from typing import Any, Awaitable, Callable, Dict
import time
from aiogram import BaseMiddleware
from aiogram.types import TelegramObject, Message

# Ці тексти кнопок ніколи не блокуються антифлудом
ALWAYS_ALLOWED = {
    "🔎 Знайти майстра", "💼 Я майстер", "💅 Шукаю модель",
    "📢 Вакансії", "📅 Мої записи", "🏰 Спільнота",
    "⬆️Додати оголошення⬆️", "🏠 Головне меню", "🔄 /start",
    "🔙 Назад", "❌ Скасувати",
}

class AntiFloodMiddleware(BaseMiddleware):
    def __init__(self, limit: float = 0.5):
        """
        :param limit: Мінімальний час між запитами від одного користувача (в секундах)
        """
        self.limit = limit
        self.last_user_time: Dict[int, float] = {}

    async def __call__(
        self,
        handler: Callable[[TelegramObject, Dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: Dict[str, Any],
    ) -> Any:
        user = data.get("event_from_user")
        if not user:
            return await handler(event, data)

        user_id = user.id
        now = time.time()

        # Ніколи не блокуємо: альбоми, медіа та головні кнопки меню
        if isinstance(event, Message):
            if event.media_group_id or event.photo or event.video or event.animation or event.document:
                self.last_user_time[user_id] = now
                return await handler(event, data)
            if event.text and event.text in ALWAYS_ALLOWED:
                self.last_user_time[user_id] = now
                return await handler(event, data)

        if user_id in self.last_user_time:
            delta = now - self.last_user_time[user_id]
            if delta < self.limit:
                return  # Ігноруємо занадто швидкий запит

        self.last_user_time[user_id] = now
        return await handler(event, data)

