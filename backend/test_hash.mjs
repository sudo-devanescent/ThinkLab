import bcrypt from 'bcrypt';
const hash = '$2b$12$LQv3c1yqBwEHxPvonrKCFuYSlbJKm3s5FHE5NuJ3Gy1K2aZtV7kXm';
const result = await bcrypt.compare('ThinkLab2026!', hash);
console.log('Valid:', result);
