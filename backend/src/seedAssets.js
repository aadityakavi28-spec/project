// Seed script for initial assets
const mongoose = require('mongoose');
require('dotenv').config();

const Asset = require('./models/Asset');
const AssetData = require('./models/AssetData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-bridge';

const seedAssets = [
  // Bridges
  {
    name: 'Golden Gate Bridge',
    type: 'bridge',
    location: 'San Francisco, CA',
    ownerType: 'government',
    structuralType: 'suspension',
    yearBuilt: 1937,
    status: 'operational',
  },
  {
    name: 'Brooklyn Bridge',
    type: 'bridge',
    location: 'New York, NY',
    ownerType: 'government',
    structuralType: 'suspension',
    yearBuilt: 1883,
    status: 'operational',
  },
  {
    name: 'Tower Bridge',
    type: 'bridge',
    location: 'London, UK',
    ownerType: 'government',
    structuralType: 'bascule',
    yearBuilt: 1894,
    status: 'operational',
  },
  // Buildings
  {
    name: 'Empire State Building',
    type: 'building',
    location: 'New York, NY',
    ownerType: 'private',
    structuralType: 'skyscraper',
    yearBuilt: 1931,
    status: 'operational',
  },
  {
    name: 'Burj Khalifa',
    type: 'building',
    location: 'Dubai, UAE',
    ownerType: 'private',
    structuralType: 'skyscraper',
    yearBuilt: 2010,
    status: 'operational',
  },
  {
    name: 'Willis Tower',
    type: 'building',
    location: 'Chicago, IL',
    ownerType: 'private',
    structuralType: 'skyscraper',
    yearBuilt: 1974,
    status: 'operational',
  },
  // Tunnels
  {
    name: 'Channel Tunnel',
    type: 'tunnel',
    location: 'UK/France',
    ownerType: 'public',
    structuralType: 'rail',
    yearBuilt: 1994,
    status: 'operational',
  },
  {
    name: 'Tokyo Bay Tunnel',
    type: 'tunnel',
    location: 'Tokyo, Japan',
    ownerType: 'government',
    structuralType: 'road',
    yearBuilt: 1997,
    status: 'operational',
  },
  {
    name: 'Gotthard Base Tunnel',
    type: 'tunnel',
    location: 'Switzerland',
    ownerType: 'government',
    structuralType: 'rail',
    yearBuilt: 2016,
    status: 'operational',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing assets
    await Asset.deleteMany({});
    console.log('🗑️ Cleared existing assets');

    // Create assets
    const assets = await Asset.insertMany(seedAssets);
    console.log(`✅ Created ${assets.length} assets`);

    // Generate initial sensor data for each asset
    const { generateSensorData } = require('./utils/simulationEngine');
    
    for (const asset of assets) {
      const data = generateSensorData(asset._id.toString(), asset.type);
      await AssetData.create({
        assetId: asset._id,
        ...data.sensors,
        riskScore: data.riskScore,
        healthIndex: data.healthIndex,
      });
      console.log(`  📊 Generated data for ${asset.name}`);
    }

    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
