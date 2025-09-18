import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes
import datetime

# === CONFIG ===
BOT_TOKEN = "8302615634:AAGEC2qjqNEEg5ttWRGr02l9depCWweCrFE"

FREE_CHANNEL_ID = -1002147198507   # Free community channel
VIP_GROUP_ID = -1002672132249     # VIP group
ADMIN_USERNAME = "@cryptofxskfalcon"

# Store subscriptions in memory (use DB in production)
user_subscriptions = {}

# === LOGGING ===
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# === START COMMAND ===
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("📈 Forex Signals", callback_data="forex")],
        [InlineKeyboardButton("💰 Crypto Signals", callback_data="crypto")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Welcome! 🚀\nChoose your option:", reply_markup=reply_markup)

# === SIGNALS HANDLER ===
async def signals(update: Update, context: ContextTypes.DEFAULT_TYPE, signal_type: str):
    keyboard = [
        [InlineKeyboardButton("3 Months – $400", callback_data=f"{signal_type}_3m")],
        [InlineKeyboardButton("1 Year – $500 🚀", callback_data=f"{signal_type}_1y")],
        [InlineKeyboardButton("Lifetime – $1500", callback_data=f"{signal_type}_life")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.callback_query.message.reply_text(
        "📊 Subscription Plans:\n\n🔹 3 Months – $400\n🔹 1 Year – $500 (Most Popular 🚀)\n🔹 Lifetime – $1500 (One-time)",
        reply_markup=reply_markup
    )

# === PAYMENT OPTIONS ===
async def payment_options(update: Update, context: ContextTypes.DEFAULT_TYPE, plan: str):
    keyboard = [
        [InlineKeyboardButton("💳 Pay with Credit Card", callback_data="credit_card")],
        [InlineKeyboardButton("₿ Pay with Crypto", callback_data=f"crypto_pay_{plan}")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.callback_query.message.reply_text(
        f"✅ You selected *{plan} plan*.\nChoose a payment method:",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

# === PAYMENT HANDLER ===
async def payments(update: Update, context: ContextTypes.DEFAULT_TYPE, plan: str):
    crypto_links = {
        "3m": "https://nowpayments.io/payment/?iid=5019866663",
        "1y": "https://nowpayments.io/payment/?iid=4694940242",
        "life": "https://nowpayments.io/payment/?iid=4887240851"
    }

    if plan not in crypto_links:
        await update.callback_query.message.reply_text("❌ Invalid plan selected.")
        return

    keyboard = [
        [InlineKeyboardButton(f"Pay for {plan.upper()} plan", url=crypto_links[plan])]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.callback_query.message.reply_text(
        "💳 Choose your crypto payment option below 👇",
        reply_markup=reply_markup
    )

# === CALLBACK HANDLER ===
async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == "forex":
        await signals(update, context, "forex")
    elif query.data == "crypto":
        await signals(update, context, "crypto")

    elif query.data in ["forex_3m", "forex_1y", "forex_life", "crypto_3m", "crypto_1y", "crypto_life"]:
        plan = query.data.split("_")[1]
        await payment_options(update, context, plan)

    elif query.data == "credit_card":
        await query.message.reply_text(f"💳 Credit Card payments are coming soon!\nNeed support? Contact {ADMIN_USERNAME}")

    elif query.data.startswith("crypto_pay_"):
        plan = query.data.replace("crypto_pay_", "")
        await payments(update, context, plan)

# === DAILY PROMO ===
async def send_daily_promo(app):
    text = (
        "🔥 VIP Signals Waiting For You! 🔥\n\n"
        "💹 Get access to:\n"
        "✅ Forex & Crypto Signals\n"
        "✅ Fundamentals + Analysis\n"
        "✅ Take Profit + Stop Loss\n"
        "✅ Spot Trading & Indicators\n\n"
        "📊 Subscription Plans:\n"
        "🔹 3 Months – $400\n"
        "🔹 1 Year – $500 (Most Popular 🚀)\n"
        "🔹 Lifetime – $1500 (One-time)\n\n"
        "👉 Don’t miss out, join today!"
    )
    try:
        await app.bot.send_message(chat_id=FREE_CHANNEL_ID, text=text)
    except Exception as e:
        logger.error(f"Error sending promo: {e}")

# === MAIN ===
def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(button_handler))

    # Send promo every 24h
    job_queue = app.job_queue
    job_queue.run_repeating(lambda ctx: send_daily_promo(app), interval=86400, first=10)

    print("✅ Bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()
