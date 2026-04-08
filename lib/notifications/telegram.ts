type TelegramSubmissionMessage = {
  submissionId: string;
  clerkId: string;
  userEmail?: string | null;
  personal: {
    fullName: string;
    email: string;
    phone: string;
    aadhaarPan: string;
    profilePicture?: string | null;
  };
  address: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  family: {
    parentName: string;
    parentPhone: string;
  };
  bank: {
    bankAccountName: string;
    accountNumber: string;
    ifscCode: string;
    swiftCode?: string | null;
    linkedPhone: string;
  };
  social: {
    telegram: string;
    linkedin?: string | null;
    xHandle?: string | null;
    github?: string | null;
  };
  submittedAt: Date;
};

function formatValue(value?: string | null) {
  if (!value || value.trim() === "") {
    return "-";
  }
  return value;
}

export async function sendSubmissionToTelegram(message: TelegramSubmissionMessage) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_GROUP_CHAT_ID;
  const messageThreadId = process.env.TELEGRAM_GROUP_THREAD_ID;

  if (!token || !chatId) {
    // Notification config is optional; skip silently.
    return;
  }

  const text = [
    `*NEW CANDIDATE ONBOARDING SUBMISSION*`,
    "",
    `*Clerk ID:* \`${message.clerkId}\``,
    `*Account Email:* ${formatValue(message.userEmail)}`,
    `*Submitted At:* ${message.submittedAt.toISOString()}`,
    "",
    "*PERSONAL*",
    `- Full Name: ${formatValue(message.personal.fullName)}`,
    `- Email: ${formatValue(message.personal.email)}`,
    `- Phone: ${formatValue(message.personal.phone)}`,
    `- Aadhaar/PAN: ${formatValue(message.personal.aadhaarPan)}`,
    `- Profile Picture: ${message.personal.profilePicture ? "Provided" : "Not provided"}`,
    "",
    "*ADDRESS*",
    `- Address: ${formatValue(message.address.address)}`,
    `- City: ${formatValue(message.address.city)}`,
    `- State: ${formatValue(message.address.state)}`,
    `- ZIP/PIN: ${formatValue(message.address.zipCode)}`,
    `- Country: ${formatValue(message.address.country)}`,
    "",
    "*FAMILY*",
    `- Parent/Guardian Name: ${formatValue(message.family.parentName)}`,
    `- Parent/Guardian Phone: ${formatValue(message.family.parentPhone)}`,
    "",
    "*BANK*",
    `- Name as per Bank: ${formatValue(message.bank.bankAccountName)}`,
    `- Account Number: ${formatValue(message.bank.accountNumber)}`,
    `- IFSC: ${formatValue(message.bank.ifscCode)}`,
    `- SWIFT: ${formatValue(message.bank.swiftCode)}`,
    `- Linked Phone: ${formatValue(message.bank.linkedPhone)}`,
    "",
    "*SOCIAL*",
    `- Telegram: ${formatValue(message.social.telegram)}`,
    `- LinkedIn: ${formatValue(message.social.linkedin)}`,
    `- X/Twitter: ${formatValue(message.social.xHandle)}`,
    `- GitHub: ${formatValue(message.social.github)}`,
    "",
    "_Reply to manage status flow._"
  ].join("\n");

  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🚀 Mark Offer Sent", callback_data: `sent:${message.clerkId}` }
        ]
      ]
    }
  };

  if (messageThreadId) {
    payload.message_thread_id = Number(messageThreadId);
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram send failed: ${response.status} ${errorText}`);
  }
}
