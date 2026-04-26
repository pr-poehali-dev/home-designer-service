"""
Отправка заявки с контактной формы сайта FORMA на почту владельца.
"""
import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


OWNER_EMAIL = "Hover_naistert@mail.ru"
OWNER_PHONE = "+7 993 232 05 84"
SMTP_HOST = "smtp.mail.ru"
SMTP_PORT = 465


def handler(event: dict, context) -> dict:
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Неверный формат данных"})}

    name = (body.get("name") or "").strip()
    email = (body.get("email") or "").strip()
    message = (body.get("message") or "").strip()

    if not name or not email or not message:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Заполните все поля"}),
        }

    smtp_password = os.environ.get("SMTP_PASSWORD", "")

    html_body = f"""
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0f0b09; color: #e8ddd0; padding: 40px; border-radius: 16px;">
      <div style="border-bottom: 1px solid rgba(200,160,80,0.3); padding-bottom: 24px; margin-bottom: 24px;">
        <h1 style="color: #c8a050; font-size: 28px; margin: 0; font-weight: 300; letter-spacing: 0.1em;">FORMA</h1>
        <p style="color: rgba(232,221,208,0.5); margin: 4px 0 0; font-size: 13px; letter-spacing: 0.05em;">Новая заявка с сайта</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(232,221,208,0.45); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 120px;">Имя</td>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 16px; color: #e8ddd0;">{name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(232,221,208,0.45); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 16px; color: #c8a050;">{email}</td>
        </tr>
        <tr>
          <td style="padding: 16px 0 0; color: rgba(232,221,208,0.45); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Сообщение</td>
          <td style="padding: 16px 0 0; font-size: 15px; color: #e8ddd0; line-height: 1.7;">{message}</td>
        </tr>
      </table>

      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(200,160,80,0.2); text-align: center;">
        <p style="color: rgba(232,221,208,0.3); font-size: 12px; margin: 0;">Ответьте напрямую на это письмо или свяжитесь по телефону: <strong style="color: rgba(232,221,208,0.6);">{OWNER_PHONE}</strong></p>
      </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[FORMA] Новая заявка от {name}"
    msg["From"] = OWNER_EMAIL
    msg["To"] = OWNER_EMAIL
    msg["Reply-To"] = email
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
        server.login(OWNER_EMAIL, smtp_password)
        server.sendmail(OWNER_EMAIL, OWNER_EMAIL, msg.as_string())

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"success": True, "message": "Заявка отправлена!"}),
    }
