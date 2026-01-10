# EmailJS Setup Guide

## Step-by-Step Instructions to Create Email Template

### 1. Sign Up / Login to EmailJS
- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Sign up with your email or login if you already have an account

### 2. Create an Email Service
1. Click on **Email Services** (left sidebar)
2. Click **Add Service**
3. Select your email provider:
   - **Gmail** (recommended - easiest)
   - Outlook
   - Yahoo
   - Or custom SMTP
4. Click **Connect Account**
5. Follow the prompts to authorize EmailJS to send emails from your account
6. Copy your **Service ID** (you'll need this)

### 3. Create an Email Template
1. Click on **Email Templates** (left sidebar)
2. Click **Create New Template**
3. Name your template (e.g., "Contact Form Submission")
4. Set the following:

#### Email Settings:
- **Subject:** `New Message from {{from_name}}`
- **To Email:** `thanveerm579@gmail.com` (your email)
- **From Email:** `{{from_email}}` (visitor's email)
- **Reply To:** `{{from_email}}`

#### Email Body Template:
```
Hello,

You have received a new message from your website contact form.

---

**Name:** {{from_name}}
**Email:** {{from_email}}

**Message:**
{{message}}

---

Best regards,
Contact Form Submission
```

5. Click **Save** at the bottom

### 4. Get Your Credentials
1. Go to **Account** (top right)
2. Copy your **Public Key** from the "API Keys" section
3. Go back to **Email Templates** and copy your **Template ID**
4. Go to **Email Services** and copy your **Service ID**

### 5. Update Your Website Code
Replace the placeholders in `index.html`:

```javascript
emailjs.init('YOUR_PUBLIC_KEY');  // Line 539
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)  // Line 548
```

### Template Variable Reference
- `{{from_name}}` - Visitor's name
- `{{from_email}}` - Visitor's email address
- `{{message}}` - Visitor's message

### Testing
1. Save the template
2. Go to your website
3. Fill out the contact form and submit
4. Check your email inbox for the message

### Troubleshooting
- **401 Unauthorized:** Check your Public Key
- **No email received:** Verify Service ID and Template ID
- **Gmail issues:** Enable "Less secure app access" or use Gmail App Passwords
- Check browser console (F12) for error messages

### Security Note
- Your Public Key is safe to expose in frontend code (it's limited to sending emails)
- Never expose your Private Key or Service credentials
