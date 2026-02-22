# QMS Blueprint Website

This repository contains the source code for **QMS Blueprint**, a marketing site offering ISO 9001:2015 quality management system documentation. The site is host‑neutral and uses plain HTML, CSS and JavaScript so it can be deployed on a variety of static hosting platforms. A serverless function stub is included for handling contact form submissions via email.

## Running locally

To preview the site locally, you can serve the files using any static file server. For example, with Node.js installed:

```bash
npm install -g serve
serve .
```

Then open <http://localhost:3000/index.html> in your browser.

## Project structure

```
qms-blueprint-site/
├── api/
│   └── contact.js           # Serverless function to send notification and confirmation emails
├── images/
│   └── headshot.png         # Founder headshot used on the About page
├── js/
│   └── contact.js           # Client‑side script to handle the contact form
├── qms-customization-questionnaire.docx # Downloadable questionnaire
├── style.css                # Global styles
├── index.html               # Home page
├── product.html             # Product page with product schema markup
├── services.html            # Customisation service description
├── why-iso-9001.html        # Page explaining the benefits of ISO 9001
├── resources.html           # Downloadable questionnaire and guidance
├── faq.html                 # Frequently asked questions
├── about.html               # About page with headshot
└── contact.html             # Contact form page
```

## Environment variables for email

The serverless function `api/contact.js` uses [`nodemailer`](https://nodemailer.com/) to send emails. To make it work, supply the following environment variables at deployment time:

| Variable           | Description                                                   |
|--------------------|---------------------------------------------------------------|
| `SENDGRID_API_KEY` | API key for SendGrid (or adapt the transporter to your SMTP) |
| `OWNER_EMAIL`      | Email address where you want to receive notification emails   |
| `FROM_EMAIL`       | Verified sender email used in the `from` field               |

If you deploy on Netlify, you can set these variables in the site settings under *Environment variables*. On Vercel, add them in the *Environment Variables* section of your project settings. Cloudflare Pages functions support similar environment configuration.

## Deployment guides

### Netlify

1. Sign in to Netlify and create a new site from your repository.
2. Set build command to `npm run build` (not used here but needed) and publish directory to `/` since the site is static.
3. Add environment variables (`SENDGRID_API_KEY`, `OWNER_EMAIL`, `FROM_EMAIL`).
4. Add a `netlify.toml` with a functions directory pointing to `api` if you wish to enable the function:

   ```toml
   [build]
     functions = "api"
   ```

5. Deploy. Netlify will serve the static files and expose the function at `/.netlify/functions/contact` by default. Update the fetch URL in `js/contact.js` if required.

### Vercel

1. Import the repository into Vercel.
2. Set the framework preset to *Other* (since this is a static site).
3. Under **Build & Output Settings**, set **Output Directory** to `.`.
4. Add environment variables.
5. Place the `api/contact.js` file in a folder named `api` at the project root. Vercel will automatically deploy it as a serverless function available at `/api/contact`.

### Cloudflare Pages

1. Create a new project and link it to your repository.
2. Choose *No Build Required* since the site is static.
3. Set the **Build Output Directory** to `.`.
4. For the contact function, you can deploy it as a Cloudflare Worker. Create a `functions/contact.js` using the provided code and configure environment variables in your Cloudflare Pages project.

## Post‑deploy checklist

After deployment, verify the following:

1. All navigation links work and point to the correct pages.
2. The “Purchase Template” button goes to the Lemon Squeezy checkout URL.
3. The contact form submits successfully and you receive a test notification email.
4. The confirmation email is sent to the address you entered in the form.
5. Meta titles and descriptions are present on each page and search engine previews look appropriate.
6. JSON‑LD schema is present on the home and product pages (use a structured data testing tool).
7. Responsive design functions on mobile devices.
8. The disclaimer “Documentation only. No consulting, training, auditing or certification guarantees.” appears in the footer and relevant sections.

## Licensing and warranties

This website template is provided “as is” without warranty of any kind. Using it does not guarantee ISO 9001 certification. You are responsible for implementing, auditing and maintaining your quality management system.