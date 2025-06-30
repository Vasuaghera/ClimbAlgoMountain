const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const getHtmlTemplate = ({ subject, message, score, rewards = [], action }) => {
  // Debug log for email rendering
  console.log('[EMAIL TEMPLATE]', { subject, message, score, rewards, action });
  // Common header and footer
  const header = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;background:linear-gradient(90deg,#34d399,#10b981,#06b6d4);border-radius:16px;width:72px;height:72px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 4px 16px rgba(52,211,153,0.15);">🏆</div>
      <h1 style="font-size:2.2em;color:#065f46;margin:0 0 8px 0;">${subject}</h1>
      <div style="color:#4b5563;font-size:1.1em;margin-bottom:24px;">${message}</div>
    </div>
  `;
  const footer = `
    <div style="text-align:center;color:#6b7280;font-size:0.95em;margin-top:32px;">
      🚀 Keep learning, keep winning!<br>
      <b>DSA Game Team</b>
    </div>
  `;
  // DSA-themed background decorations
  const dsaDecor = `
    <div style="position:absolute;top:10px;left:10px;opacity:0.12;font-size:80px;z-index:0;">[1,2]</div>
    <div style="position:absolute;bottom:10px;right:20px;opacity:0.12;font-size:80px;z-index:0;">🌳</div>
  `;

  // Reward email layout
  if (action === 'reward') {
    return `
      <div style="background: linear-gradient(135deg, #d1fae5 0%, #f0fdf4 100%); padding: 40px 0;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 24px; box-shadow: 0 8px 32px rgba(16,185,129,0.12); padding: 32px 24px; position: relative; overflow: hidden;">
          ${dsaDecor}
          ${header}
          <div style="background:linear-gradient(90deg,#fef3c7 0%,#f3e8ff 100%);border-radius:16px;padding:20px 16px 20px 16px;margin-bottom:24px;box-shadow:0 2px 8px rgba(251,191,36,0.08);text-align:center;position:relative;z-index:1;">
            <div style="display:inline-block;background:linear-gradient(90deg,#34d399,#06b6d4);color:#fff;border-radius:999px;padding:6px 18px;font-weight:bold;font-size:1em;margin-bottom:8px;">Your Current Score</div>
            <div style="font-size:2.5em;font-weight:bold;color:#f59e42;margin-bottom:8px;">${score ?? 0}</div>
            <ul style="list-style:none;padding:0;margin:0 0 16px 0;">
              ${rewards.map(r => `<li style=\"margin:8px 0;font-size:1.1em;color:#374151;display:flex;align-items:center;\"><span style=\"display:inline-block;width:10px;height:10px;background:#34d399;border-radius:50%;margin-right:10px;\"></span>${r}</li>`).join('')}
            </ul>
            <a href="https://your-dsa-game.com/rewards" style="display:block;width:100%;background:linear-gradient(90deg,#f59e42,#f43f5e);color:#fff;text-align:center;padding:14px 0;border-radius:12px;font-size:1.1em;font-weight:bold;text-decoration:none;margin-top:16px;box-shadow:0 2px 8px rgba(244,63,94,0.10);">View Your Rewards</a>
          </div>
          ${footer}
        </div>
      </div>
    `;
  }

  // Default (login, registration, etc.) layout
  return `
    <div style="background: linear-gradient(135deg, #d1fae5 0%, #f0fdf4 100%); padding: 40px 0;">
      <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 24px; box-shadow: 0 8px 32px rgba(16,185,129,0.12); padding: 32px 24px; position: relative; overflow: hidden;">
        ${dsaDecor}
        ${header}
        <div style="background:linear-gradient(90deg,#f3e8ff 0%,#fef3c7 100%);border-radius:16px;padding:24px 18px 24px 18px;margin-bottom:24px;box-shadow:0 2px 8px rgba(52,211,153,0.08);text-align:center;position:relative;z-index:1;">
          <a href="https://your-dsa-game.com" style="display:inline-block;width:auto;background:linear-gradient(90deg,#34d399,#06b6d4);color:#fff;text-align:center;padding:12px 32px;border-radius:12px;font-size:1.1em;font-weight:bold;text-decoration:none;box-shadow:0 2px 8px rgba(52,211,153,0.10);margin-top:0;">Go to DSA Game</a>
        </div>
        ${footer}
      </div>
    </div>
  `;
};

const sendEmail = async (to, { subject, message, score, rewards, action }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
    html: getHtmlTemplate({ subject, message, score, rewards, action })
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail; 