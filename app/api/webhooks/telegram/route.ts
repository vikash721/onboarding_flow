import { NextRequest, NextResponse } from "next/server";
import { updateSubmissionStatus } from "@/lib/db/submission";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return NextResponse.json({ error: "Bot token not configured" }, { status: 500 });
    }

    // Handle Callback Query (Button Clicks)
    if (body.callback_query) {
      const { id, data, message, from } = body.callback_query;
      const [action, clerkId] = data.split(":");

      let statusUpdate = {};
      let actionLabel = "";

      if (action === "sent") {
        statusUpdate = { offerLetterSent: true };
        actionLabel = "Offer Letter Sent";
      } else if (action === "signed") {
        statusUpdate = { offerLetterSigned: true };
        actionLabel = "Offer Letter Signed";
      }

      // 1. Update DB
      await updateSubmissionStatus(clerkId, statusUpdate);

      // 2. Acknowledge the callback to Telegram (removes loading state)
      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: id,
          text: `✅ ${actionLabel} updated!`,
        }),
      });

      // 3. Update the original message to show confirmation
      const originalText = message.text || "";
      const escapeHTML = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      
      const name = from.username ? `@${from.username}` : (from.first_name || "Manager");
      const updatedText = `${originalText}\n\n✅ <b>${actionLabel}</b> marked by ${escapeHTML(name)}`;

      const editRes = await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: message.chat.id,
          message_id: message.message_id,
          text: updatedText,
          parse_mode: "HTML",
          reply_markup: message.reply_markup
        }),
      });

      if (!editRes.ok) {
        console.error("Telegram editMessageText failed:", await editRes.text());
      }

      // 4. Send a confirmation REPLY message
      const replyRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: `🚀 <b>${actionLabel}!</b>\nConfirmed by ${escapeHTML(name)}`,
          parse_mode: "HTML",
          reply_to_message_id: message.message_id,
          message_thread_id: message.message_thread_id
        }),
      });

      if (!replyRes.ok) {
        console.error("Telegram sendMessage failed:", await replyRes.text());
      }

      return NextResponse.json({ success: true });
    }

    // Default response for other updates
    return NextResponse.json({ message: "Update received" });
  } catch (error) {
    console.error("Telegram Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
