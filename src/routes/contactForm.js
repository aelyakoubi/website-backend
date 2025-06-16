// ✅ Benodigde modules importeren
import express from 'express'; // Express framework voor het opzetten van routes
import fs from 'fs'; // File system module (callback-gebaseerd)
import nodemailer from 'nodemailer'; // Nodemailer voor het versturen van e-mails
import path from 'path'; // Path module voor padbewerkingen
import puppeteer from 'puppeteer'; // Puppeteer voor het genereren van PDF-bestanden
import { fileURLToPath } from 'url'; // Nodig om __dirname te kunnen gebruiken in ES modules

// ✅ Express router initialiseren
const router = express.Router();

// ✅ Zet __filename en __dirname correct in ES modules
const __filename = fileURLToPath(import.meta.url); // Huidig bestandspad
const __dirname = path.dirname(__filename); // Huidige directory-pad

// ✅ Pad naar de map waarin berichten worden opgeslagen
const messagesDir = path.join(__dirname, '../messages');

// ✅ Maak de 'messages' map aan als die nog niet bestaat
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true }); // Maak map aan, inclusief tussenliggende mappen
}

// ✅ Hulpfunctie om de huidige datum op te halen (DD-MM-YYYY)
const getCurrentDate = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

// ✅ POST route voor het versturen van contactberichten
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // ❌ Controle: zijn alle verplichte velden ingevuld?
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const currentDate = getCurrentDate(); // ✅ Huidige datum ophalen

    // ✅ Transporter aanmaken voor e-mail met Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.strato.com', // Server van Strato
      port: 465, // Poort voor SSL
      secure: true, // SSL inschakelen
      auth: {
        user: process.env.EMAIL_USER, // Gebruikersnaam uit .env
        pass: process.env.EMAIL_PASS, // Wachtwoord uit .env
      },
      tls: {
        rejectUnauthorized: false, // Zelfondertekende certificaten toestaan (alleen indien nodig)
      },
    });

    // ✅ E-mail naar admin met het bericht van gebruiker
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `You received a new message from ${name} (${email}) on ${currentDate}:\n\n${message}`,
    };

    // ✅ Automatische bevestiging naar gebruiker
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting us!',
      text: `Dear ${name},\n\nThank you for your message on ${currentDate}. We will get back to you as soon as possible.\n\nBest regards,\nYour Company`,
    };

    // ✅ Verstuur beide e-mails
    await transporter.sendMail(mailOptionsToAdmin);
    await transporter.sendMail(mailOptionsToUser);

    // ✅ Bericht opslaan als .txt-bestand
    const plainTextContent = `Message from: ${name} (${email})\nDate: ${currentDate}\n\n${message}`;
    fs.writeFileSync(
      path.join(messagesDir, `${name}-${currentDate}-message.txt`),
      plainTextContent
    );

    // ✅ Bericht opslaan als PDF met Puppeteer
    const htmlContent = `
      <html>
        <body>
          <h3>Message from: ${name} (${email})</h3>
          <p>Date: ${currentDate}</p>
          <p>${message}</p>
        </body>
      </html>
    `;

    // ✅ Start Puppeteer browser in headless modus
    const browser = await puppeteer.launch();
    const page = await browser.newPage(); // Open nieuwe pagina
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' }); // Zet HTML inhoud

    // ✅ Genereer PDF en sla op in 'messages'-map
    const pdfPath = path.join(
      messagesDir,
      `${name}-${currentDate}-message.pdf`
    );
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close(); // ✅ Sluit de browser

    console.log('Berichten opgeslagen in:', messagesDir); // ✅ Debug info

    // ✅ Verstuur succesreactie naar frontend
    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    // ❌ Foutafhandeling
    console.error('Fout bij verzenden of opslaan:', error);
    return res.status(500).json({ error: 'Failed to send message.' });
  }
});

// ✅ Exporteer de router zodat hij geïmporteerd kan worden in je serverbestand
export default router;
