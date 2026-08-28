import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from server directory or root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('\n======================================================');
console.log('🔍 PREMIER LANKA TOURS — SYSTEM ENVIRONMENT AUDIT');
console.log('======================================================\n');

async function testMongoDB() {
  const uri = process.env.MONGODB_URI;
  console.log('1. Testing MongoDB Atlas Connection...');

  if (!uri) {
    console.log('   ❌ MONGODB_URI is not set in server/.env or environment variables.');
    console.log('   👉 Please add: MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname\n');
    return false;
  }

  try {
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log(`   Connecting to: ${maskedUri}`);

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('   ✅ MongoDB Atlas connected successfully!');
    
    // Quick ping test
    const adminDb = mongoose.connection.db.admin();
    await adminDb.ping();
    console.log('   ✅ Database ping response: OK');
    
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.log(`   ❌ MongoDB connection failed: ${err.message}`);
    console.log('   👉 Tips: Check your database user whitelist IP (0.0.0.0/0) and password credentials.\n');
    return false;
  }
}

async function testSMTP() {
  console.log('2. Testing Nodemailer SMTP Email Transport...');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  if (!user || !pass) {
    console.log('   ⚠️  SMTP_USER or SMTP_PASS is missing in server/.env.');
    console.log('   👉 Email notifications will be skipped until credentials are provided.');
    console.log('   👉 For Gmail: generate an App Password at https://myaccount.google.com/apppasswords\n');
    return null;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.verify();
    console.log(`   ✅ SMTP connection verified successfully for ${user}!`);
    console.log(`   Target Notification: ${process.env.NOTIFICATION_EMAIL || 'lankatoursp@gmail.com'}\n`);
    return true;
  } catch (err) {
    console.log(`   ❌ SMTP verification failed: ${err.message}`);
    console.log('   👉 Tips: If using Gmail, ensure 2-Step Verification is enabled and you are using a 16-character App Password, not your regular password.\n');
    return false;
  }
}

async function runAudit() {
  const dbOk = await testMongoDB();
  const smtpOk = await testSMTP();

  console.log('======================================================');
  console.log('📊 AUDIT SUMMARY:');
  console.log(`- Database: ${dbOk ? '✅ Ready' : '⚠️ Pending Configuration'}`);
  console.log(`- Email Dispatch: ${smtpOk === true ? '✅ Ready' : (smtpOk === null ? 'ℹ️ Skipped (Optional)' : '❌ Failed')}`);
  console.log('======================================================\n');

  process.exit(0);
}

runAudit();
