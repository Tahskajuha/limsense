import emailjs from '@emailjs/browser';

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOtpEmail({ toEmail, toName = 'User', code }) {
  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('Email service is not configured. Set REACT_APP_EMAILJS_SERVICE_ID, REACT_APP_EMAILJS_TEMPLATE_ID, REACT_APP_EMAILJS_PUBLIC_KEY');
  }

  try {
    const res = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: toEmail,
        to_name: toName,
        otp_code: code,
      },
      { publicKey }
    );
    return res;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('EmailJS send error', err);
    throw err;
  }
}


