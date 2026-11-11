import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'campus_lost_found.db');
export const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize Relational Schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS stations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      building TEXT NOT NULL,
      room TEXT NOT NULL,
      hours TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      pickup_instructions TEXT NOT NULL,
      custody_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('lost', 'found')),
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      campus_building TEXT NOT NULL,
      specific_location TEXT,
      incident_date TEXT NOT NULL,
      time_of_day TEXT,
      description TEXT,
      status TEXT NOT NULL CHECK(status IN ('active', 'claim_pending', 'reunited', 'stored_at_security')),
      storage_station_id TEXT REFERENCES stations(id),
      primary_color TEXT,
      brand TEXT,
      secret_details TEXT,
      verification_question TEXT,
      reporter_name TEXT NOT NULL,
      reporter_email TEXT NOT NULL,
      reporter_phone TEXT,
      reporter_role TEXT DEFAULT 'student',
      reward_offered REAL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS claims (
      id TEXT PRIMARY KEY,
      item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      item_title TEXT NOT NULL,
      claimant_name TEXT NOT NULL,
      claimant_email TEXT NOT NULL,
      claimant_student_id TEXT,
      claimant_phone TEXT,
      verification_answer TEXT NOT NULL,
      additional_proof TEXT,
      status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')),
      pickup_pass_code TEXT,
      pickup_station_name TEXT,
      rejection_reason TEXT,
      reviewed_by TEXT,
      created_at TEXT NOT NULL,
      reviewed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lost_item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      found_item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      confidence_score INTEGER NOT NULL,
      matched_factors TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'suggested',
      created_at TEXT NOT NULL,
      UNIQUE(lost_item_id, found_item_id)
    );
  `);

  // Seed default stations if empty
  const stationCount = db.prepare('SELECT COUNT(*) as count FROM stations').get() as { count: number };
  if (stationCount.count === 0) {
    seedDatabase();
  }
}

export function seedDatabase() {
  const insertStation = db.prepare(`
    INSERT OR REPLACE INTO stations (id, name, building, room, hours, phone, email, pickup_instructions, custody_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const stationsData = [
    [
      'st-police',
      'Campus Police & Public Safety Headquarters',
      'Public Safety Building A',
      'Room 102 (Main Intake Desk)',
      '24/7 Operations',
      '(555) 019-2200',
      'campussafety@university.edu',
      'Present a valid government or university photo ID and your digital Claim Pass code at the secure front lobby window.',
      14
    ],
    [
      'st-union',
      'Student Union Information & Concierge Desk',
      'Student Union & Commons',
      '1st Floor Atrium Center',
      'Mon-Fri 7:30 AM - 10:00 PM, Sat-Sun 9:00 AM - 8:00 PM',
      '(555) 019-4520',
      'union-lostfound@university.edu',
      'Items turned in across dining halls, lounges, and club spaces are logged here daily at 5:00 PM.',
      8
    ],
    [
      'st-library',
      'Main University Library Circulation Desk',
      'University Library',
      'Ground Floor Entry Concourse',
      'Mon-Thu 8:00 AM - Midnight, Fri 8:00 AM - 8:00 PM, Sun 10:00 AM - Midnight',
      '(555) 019-3310',
      'library-lost@university.edu',
      'Held at the main checkout desk. Staff checks returned items against library security logs.',
      11
    ],
    [
      'st-engineering',
      'Engineering & Technology Hall Service Office',
      'Science & Engineering Hall',
      'Hallway B, Room 214',
      'Mon-Fri 8:30 AM - 5:00 PM',
      '(555) 019-8740',
      'eng-desk@university.edu',
      'Handles items from maker labs, computer clusters, and physics lecture halls.',
      5
    ],
    [
      'st-rec',
      'Campus Recreation & Athletic Complex Front Desk',
      'Campus Recreation Center',
      'Main Turnstile Reception',
      'Mon-Fri 6:00 AM - 11:00 PM, Sat-Sun 8:00 AM - 9:00 PM',
      '(555) 019-6120',
      'rec-lostfound@university.edu',
      'Gym bags, water bottles, and locker room recoveries are kept in secure lockers behind the welcome desk.',
      9
    ]
  ];

  const insertManyStations = db.transaction(() => {
    for (const s of stationsData) {
      insertStation.run(...s);
    }
  });
  insertManyStations();

  // Seed Items
  const insertItem = db.prepare(`
    INSERT OR REPLACE INTO items (
      id, type, title, category, campus_building, specific_location,
      incident_date, time_of_day, description, status, storage_station_id,
      primary_color, brand, secret_details, verification_question,
      reporter_name, reporter_email, reporter_phone, reporter_role,
      reward_offered, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  const itemsData = [
    [
      'L-101', 'lost', 'Space Gray MacBook Pro 14" (M3)', 'Electronics',
      'University Library', '3rd Floor Quiet Study Pods, Desk near east window',
      '2026-11-09', 'Afternoon (14:00 - 16:30)',
      '14-inch Space Gray MacBook Pro inside a navy felt sleeve. Contains thesis drafts in Documents folder.',
      'active', null, 'Space Gray', 'Apple',
      'Silver NASA James Webb sticker on right wrist rest; small scratch near MagSafe port.', null,
      'Marcus Vance', 'm.vance@university.edu', '(555) 014-9821', 'student',
      50, '2026-11-09T17:15:00.000Z', '2026-11-09T17:15:00.000Z'
    ],
    [
      'F-201', 'found', 'Apple MacBook Pro Laptop in Sleeve', 'Electronics',
      'University Library', '3rd Floor Study Room 318, left under work table',
      '2026-11-09', 'Evening (18:00)',
      'Space Gray Apple laptop in dark fabric sleeve turned in by closing custodian staff. Safely locked in circulation cabinet.',
      'stored_at_security', 'st-library', 'Space Gray', 'Apple',
      null, 'What specific sticker is affixed inside next to the trackpad/wrist rest, and what color is the sleeve interior?',
      'Carlos Ruiz (Custodian)', 'library-lost@university.edu', '(555) 019-3310', 'staff',
      0, '2026-11-09T18:40:00.000Z', '2026-11-09T18:40:00.000Z'
    ],
    [
      'L-102', 'lost', 'AirPods Pro (2nd Gen) with Spigen Case', 'Electronics',
      'Student Union & Commons', '2nd Floor Couches near campus coffee shop',
      '2026-11-10', 'Morning (10:15)',
      'White AirPods Pro 2 in an olive green rugged Spigen silicone case with a mini carabiner.',
      'active', null, 'Olive Green', 'Apple',
      'Bluetooth device name shows "Maya\'s Pods 🎧". Left earbud has small scuff on silicone tip.', null,
      'Maya Lin', 'mlin92@university.edu', '(555) 017-3341', 'student',
      20, '2026-11-10T11:00:00.000Z', '2026-11-10T11:00:00.000Z'
    ],
    [
      'F-202', 'found', 'Wireless Earbuds in Green Protective Case', 'Electronics',
      'Student Union & Commons', 'Union Food Court booth #8',
      '2026-11-10', 'Lunch hour (12:30)',
      'Found on seat after dining rush. Has a small metal ring attachment on the cover.',
      'stored_at_security', 'st-union', 'Green', 'Apple',
      null, 'What exact custom name is assigned to these earbuds on Bluetooth, or what model generation are they?',
      'Derek Zhao', 'union-lostfound@university.edu', '(555) 019-4520', 'student',
      0, '2026-11-10T13:10:00.000Z', '2026-11-10T13:10:00.000Z'
    ],
    [
      'F-203', 'found', 'Student ID & Dorm Keycard (Elena Rostova)', 'IDs & Cards',
      'Science & Engineering Hall', 'Outside Physics Lecture Hall 101 on bench',
      '2026-11-10', 'Morning (09:45)',
      'Official University student ID card in a clear lanyard pouch with a blue campus transit tap card.',
      'stored_at_security', 'st-engineering', 'Blue / Clear', 'University ID',
      null, 'What are the last 4 digits of the student ID number printed on the card face?',
      'Prof. Jonathan Keller', 'jkeller@university.edu', '(555) 019-8740', 'faculty',
      0, '2026-11-10T10:05:00.000Z', '2026-11-10T10:05:00.000Z'
    ],
    [
      'L-103', 'lost', 'Hydro Flask 32oz Water Bottle - Seagrass', 'Personal Valuables',
      'Campus Recreation Center', 'Cardio mezzanine floor near treadmill bank 4',
      '2026-11-08', 'Evening (19:30)',
      '32oz wide mouth Hydro Flask with flex straw lid. Covered in national park and outdoor stickers.',
      'claim_pending', null, 'Seagrass / Mint Green', 'Hydro Flask',
      'Contains a Yosemite Half Dome sticker with peeling top edge and a yellow silicone bottom boot.', null,
      'Jordan Reed', 'jreed@university.edu', '(555) 013-4412', 'student',
      0, '2026-11-08T20:45:00.000Z', '2026-11-10T14:20:00.000Z'
    ],
    [
      'F-204', 'found', 'Mint Green Insulated Metal Water Bottle', 'Personal Valuables',
      'Campus Recreation Center', 'Locker room entrance towel cubby',
      '2026-11-08', 'Closing (22:00)',
      'High quality insulated flask with silicone bumper base and various travel decals.',
      'claim_pending', 'st-rec', 'Green', 'Hydro Flask',
      null, 'Name at least two specific stickers on the bottle body and the color of the silicone boot.',
      'Rec Center Staff', 'rec-lostfound@university.edu', '(555) 019-6120', 'staff',
      0, '2026-11-08T22:30:00.000Z', '2026-11-10T14:20:00.000Z'
    ],
    [
      'L-104', 'lost', 'Texas Instruments TI-84 Plus CE Graphing Calculator', 'Books & Notes',
      'Science & Engineering Hall', 'Math Tutorial Lab, 2nd floor room 240',
      '2026-11-11', 'Morning (09:00)',
      'Black TI-84 Plus CE python edition in a slide cover. Urgent for upcoming Calculus midterm.',
      'active', null, 'Black', 'Texas Instruments',
      'Initials "S.K." written in silver metallic Sharpie on the inside battery cover.', null,
      'Samir Khan', 'skhan@university.edu', '(555) 018-7729', 'student',
      15, '2026-11-11T09:30:00.000Z', '2026-11-11T09:30:00.000Z'
    ],
    [
      'F-205', 'found', 'Toyota Key Fob with Braided Leather Lanyard', 'Keys & Badges',
      'East Parking Pavilion', 'Level 2 Stairwell near elevator bank',
      '2026-11-07', 'Late Night',
      'Key ring with 1 black electronic car key fob, 2 silver house keys, and a bronze gym membership tag.',
      'reunited', 'st-police', 'Black / Silver', 'Toyota',
      null, 'What letter or digit is stamped on the bronze gym tag, and what color stitching is on the lanyard?',
      'Officer Miller', 'campussafety@university.edu', '(555) 019-2200', 'staff',
      0, '2026-11-07T23:15:00.000Z', '2026-11-09T10:00:00.000Z'
    ]
  ];

  const insertManyItems = db.transaction(() => {
    for (const item of itemsData) {
      insertItem.run(...item);
    }
  });
  insertManyItems();

  // Seed Claims
  const insertClaim = db.prepare(`
    INSERT OR REPLACE INTO claims (
      id, item_id, item_title, claimant_name, claimant_email,
      claimant_student_id, claimant_phone, verification_answer,
      additional_proof, status, pickup_pass_code, pickup_station_name,
      rejection_reason, reviewed_by, created_at, reviewed_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  const claimsData = [
    [
      'CLM-901', 'F-204', 'Mint Green Insulated Metal Water Bottle',
      'Jordan Reed', 'jreed@university.edu', 'U8849201', '(555) 013-4412',
      'It has a Yosemite Half Dome sticker with a slightly peeled top corner, a yellow silicone boot at the bottom, and a Joshua Tree sticker.',
      'Purchased at REI Berkeley last spring; photo in my camera roll taken in the gym with it.',
      'pending', null, 'Campus Recreation & Athletic Complex Front Desk',
      null, null, '2026-11-10T14:20:00.000Z', null
    ],
    [
      'CLM-890', 'F-205', 'Toyota Key Fob with Braided Leather Lanyard',
      'Nathaniel Cole', 'ncole@university.edu', 'U7721094', '(555) 019-3321',
      'Bronze tag has number #418 stamped on it; leather lanyard has red contrast stitching.',
      'Matched with my 2021 Toyota Corolla parked on 2nd level lot; unlocked car with the spare key to show registration in glovebox.',
      'approved', 'PASS-8104-POLICE', 'Campus Police & Public Safety Headquarters',
      null, 'Campus Police Officer Miller', '2026-11-08T09:00:00.000Z', '2026-11-09T10:00:00.000Z'
    ]
  ];

  const insertManyClaims = db.transaction(() => {
    for (const c of claimsData) {
      insertClaim.run(...c);
    }
  });
  insertManyClaims();
}
