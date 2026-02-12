import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton

# Bot sozlamalari
TOKEN = "8543158894:AAHkaN83tLCgNrJ-Omutn744aTui784GScc"
ADMIN_ID_TG = 8215056224 # Sizning haqiqiy Telegram IDingiz

bot = Bot(token=TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def start_handler(message: types.Message):
    # Bu yerda web_app URL-ni Render-dagi manzilingizga o'zgartiring
    WEBAPP_URL = "https://ruslan-market.onrender.com" # Misol uchun
    
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🛒 Ruslan Marketni ochish", web_app=WebAppInfo(url=WEBAPP_URL))]
    ])
    
    await message.answer(
        f"Assalomu alaykum, {message.from_user.full_name}!\n"
        "Ruslan Market botiga xush kelibsiz.\n\n"
        "Mini App orqali treklarni kuzatib boring.",
        reply_markup=kb
    )

async def main():
    logging.basicConfig(level=logging.INFO)
    print("Ruslan Market Boti ishga tushdi...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
