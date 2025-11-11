const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
async function connectDB() {
    try { await client.connect(); console.log('MongoDB Connected'); }
    catch (error) { console.error('MongoDB error:', error); }
}
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

const uploadsDir = 'C:\\Users\\USER1\\OneDrive\\Documents\\driverwanda_website\\Uploads';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const name = req.body['post-name'] || req.body['driver-name'] || 'user';
        cb(null, `${name.replace(/\s+/g, '_')}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });
app.use('/Uploads', express.static(uploadsDir));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'rpcarrentalanddrivers@gmail.com', pass: 'jsvn itcj ibzf vmgw' }
});

// Routes
app.post('/api/book', async (req, res) => {
    try {
        await client.db('driverwanda').collection('bookings').insertOne({ ...req.body, timestamp: new Date().toISOString() });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.post('/api/driver', upload.fields([{ name: 'driver-license' }, { name: 'driver-photo' }]), async (req, res) => {
    const data = req.body;
    if (!req.files['driver-license'] || !req.files['driver-photo']) return res.status(400).json({ success: false });
    const licensePath = req.files['driver-license'][0].filename;
    const photoPath = req.files['driver-photo'][0].filename;
    try {
        await client.db('driverwanda').collection('drivers').insertOne({
            ...data, licensePath, photoPath, timestamp: new Date().toISOString()
        });
        await transporter.sendMail({
            from: 'rpcarrentalanddrivers@gmail.com',
            to: data['driver-email'],
            subject: 'Application Received',
            html: `<h2>Thank you ${data['driver-name']}</h2><p>We will contact you soon.</p>`
        });
        await transporter.sendMail({
            from: 'rpcarrentalanddrivers@gmail.com',
            to: 'rpcarrentalanddrivers@gmail.com',
            subject: 'NEW DRIVER APPLICATION',
            html: `<h2>${data['driver-name']}</h2>
                   <p>License: <a href="http://localhost:3000/Uploads/${licensePath}">View</a></p>
                   <p>Photo: <a href="http://localhost:3000/Uploads/${photoPath}">View</a></p>
                   <p><a href="http://localhost:3000/admin.html">Open Dashboard</a></p>`
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.post('/api/driver-request', async (req, res) => {
    try {
        await client.db('driverwanda').collection('driverRequests').insertOne({ ...req.body, timestamp: new Date().toISOString() });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.post('/api/post-car', upload.single('post-photo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false });
    try {
        await client.db('driverwanda').collection('carPostings').insertOne({
            ...req.body, photoPath: req.file.filename, timestamp: new Date().toISOString()
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/admin-data', async (req, res) => {
    try {
        const [bookings, drivers, driverRequests, carPostings] = await Promise.all([
            client.db('driverwanda').collection('bookings').find({}).toArray(),
            client.db('driverwanda').collection('drivers').find({}).toArray(),
            client.db('driverwanda').collection('driverRequests').find({}).toArray(),
            client.db('driverwanda').collection('carPostings').find({}).toArray()
        ]);
        res.json({ bookings, drivers, driverRequests, carPostings });
    } catch (e) { res.status(500).json({ success: false }); }
});

// Delete routes
['bookings', 'drivers', 'driverRequests', 'carPostings'].forEach(col => {
    app.delete(`/api/admin/${col}/:id`, async (req, res) => {
        const result = await client.db('driverwanda').collection(col).deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: result.deletedCount === 1 });
    });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
process.on('SIGINT', async () => { await client.close(); process.exit(); });