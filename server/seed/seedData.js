const mongoose = require('mongoose');
const User = require('../models/User');
const Technician = require('../models/Technician');
const Property = require('../models/Property');
const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const ServiceReport = require('../models/ServiceReport');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    console.log('[Seed] Checking existing records...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Technician.deleteMany({}),
      Property.deleteMany({}),
      Equipment.deleteMany({}),
      MaintenanceRequest.deleteMany({}),
      ServiceReport.deleteMany({}),
      Notification.deleteMany({})
    ]);

    console.log('[Seed] Database wiped. Starting rich demo seeding...');

    // 1. Create Admin
    const admin = await User.create({
      name: 'Marcus Vance',
      email: 'admin@liftcare.com',
      password: 'password123',
      role: 'ADMIN',
      phone: '+1 (555) 100-2000',
      companyName: 'LiftCare Network Global HQ',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    });

    // 2. Create 3 Property Managers
    const pm1 = await User.create({
      name: 'Sarah Chen',
      email: 'pm1@apexprop.com',
      password: 'password123',
      role: 'PROPERTY_MANAGER',
      phone: '+1 (555) 301-4421',
      companyName: 'Apex Commercial Real Estate Partners',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
    });

    const pm2 = await User.create({
      name: 'David Miller',
      email: 'pm2@metrotower.com',
      password: 'password123',
      role: 'PROPERTY_MANAGER',
      phone: '+1 (555) 412-8890',
      companyName: 'Metro Horizon Asset Management',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    });

    const pm3 = await User.create({
      name: 'Elena Rostova',
      email: 'pm3@sterlingasset.com',
      password: 'password123',
      role: 'PROPERTY_MANAGER',
      phone: '+1 (555) 789-2234',
      companyName: 'Sterling Tower Holdings Group',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
    });

    // 3. Create 10 Technician Users and Profiles
    const techSpecs = [
      {
        name: 'Raj Patel',
        email: 'tech1@patellift.com',
        company: 'Raj Elevator Services NYC',
        experience: 8,
        rating: 4.8,
        ratingCount: 38,
        licenseNumber: 'NY-ELEV-94821',
        skills: ['Traction Elevators', 'Hydraulic Elevators', 'Emergency Rescue', 'Door Operators', 'Routine Inspection'],
        certifications: ['QEI Certified Inspector', 'OSHA 30 Safety', 'NAEC CET'],
        lat: 40.7180,
        lng: -74.0020,
        address: 'Tribeca, New York, NY',
        verificationStatus: 'VERIFIED',
        completedJobs: 42,
        earnings: 16800
      },
      {
        name: 'Carlos Ramirez',
        email: 'tech2@apexvertical.com',
        company: 'Apex Vertical Systems LLC',
        experience: 12,
        rating: 4.9,
        ratingCount: 54,
        licenseNumber: 'NY-ELEV-81203',
        skills: ['High-Rise Elevators', 'Modernization', 'Microprocessor Controllers', 'Escalators', 'Variable Frequency Drives'],
        certifications: ['Master Elevator Mechanic License', 'KONE Certified Specialist', 'CET National'],
        lat: 40.7240,
        lng: -73.9980,
        address: 'SoHo, New York, NY',
        verificationStatus: 'VERIFIED',
        completedJobs: 68,
        earnings: 28400
      },
      {
        name: 'Alex Becker',
        email: 'tech3@precisionlift.com',
        company: 'Precision Lift Dynamics',
        experience: 6,
        rating: 4.7,
        ratingCount: 22,
        licenseNumber: 'NY-ELEV-77349',
        skills: ['Hydraulic Elevators', 'Safety Inspections', 'Governor Calibration', 'Oil Seals Replacement'],
        certifications: ['Certified Elevator Technician (CET)', 'Hydraulic Specialist'],
        lat: 40.7310,
        lng: -74.0100,
        address: 'Greenwich Village, New York, NY',
        verificationStatus: 'VERIFIED',
        completedJobs: 29,
        earnings: 11200
      },
      {
        name: 'Sarah Jenkins',
        email: 'tech4@metroescalator.com',
        company: 'Metro Escalator Techs',
        experience: 9,
        rating: 4.9,
        ratingCount: 41,
        licenseNumber: 'NY-ESCL-66512',
        skills: ['Heavy Escalators', 'Step Chains', 'Comb Plates', 'Balustrades', 'Handrail Friction Drives'],
        certifications: ['Escalator Master Technician', 'Schindler Escalator Specialist'],
        lat: 40.7090,
        lng: -74.0150,
        address: 'Financial District, New York, NY',
        verificationStatus: 'VERIFIED',
        completedJobs: 51,
        earnings: 22500
      },
      {
        name: 'Liam O Connor',
        email: 'tech5@beaconelev.com',
        company: 'Beacon Elevator Repair',
        experience: 5,
        rating: 4.6,
        ratingCount: 19,
        licenseNumber: 'NY-ELEV-55194',
        skills: ['Traction Elevators', 'Counterweight Systems', 'Emergency Brakes', 'Hoistway Sensors'],
        certifications: ['CET Level 2', 'OSHA 10 Construction'],
        lat: 40.7420,
        lng: -73.9870,
        address: 'Flatiron District, New York, NY',
        verificationStatus: 'VERIFIED',
        completedJobs: 24,
        earnings: 9800
      },
      {
        name: 'Dmitri Volkov',
        email: 'tech6@titanlift.com',
        company: 'Titan Heavy Lift Maintenance',
        experience: 14,
        rating: 5.0,
        ratingCount: 62,
        licenseNumber: 'NY-ELEV-44912',
        skills: ['Freight Elevators', 'Industrial Lifts', 'Hydraulic Pistons', 'Speed Governors', 'Heavy Rigging'],
        certifications: ['QEI Certified Inspector', 'Senior Certified Technician', 'ASME A17.1 Code Specialist'],
        lat: 40.7550,
        lng: -73.9780,
        address: 'Midtown East, New York, NY',
        verificationStatus: 'VERIFIED',
        completedJobs: 79,
        earnings: 34500
      },
      {
        name: 'Priya Sharma',
        email: 'tech7@skyhighlift.com',
        company: 'SkyHigh Mobility Solutions',
        experience: 7,
        rating: 4.8,
        ratingCount: 30,
        licenseNumber: 'NY-ELEV-33290',
        skills: ['Panoramic Elevators', 'Smart Dispatch Systems', 'Preventive Maintenance', 'Regenerative Drives'],
        certifications: ['Otis Compass Dispatch Certified', 'CET National'],
        lat: 40.7290,
        lng: -74.0200,
        address: 'Jersey City / Manhattan Ferry Zone',
        verificationStatus: 'VERIFIED',
        completedJobs: 35,
        earnings: 14700
      },
      {
        name: 'Marcus Brody',
        email: 'tech8@brodyescalator.com',
        company: 'Brody Escalator & Lift Works',
        experience: 4,
        rating: 4.5,
        ratingCount: 14,
        licenseNumber: 'NY-ESCL-22871',
        skills: ['Drive Motors', 'Step Band Alignment', 'Handrail Systems', 'Emergency Stop Relays'],
        certifications: ['CET Apprentice Completed', 'OSHA Safety'],
        lat: 40.7050,
        lng: -74.0090,
        address: 'Battery Park, New York, NY',
        verificationStatus: 'VERIFIED',
        completedJobs: 16,
        earnings: 6400
      },
      {
        name: 'Zack Taylor',
        email: 'tech9@nextgenlift.com',
        company: 'NextGen Vertical Mobility Inc.',
        experience: 2,
        rating: 4.4,
        ratingCount: 6,
        licenseNumber: 'NY-ELEV-11902',
        skills: ['Passenger Elevators', 'Basic Electrical', 'Preventive Maintenance'],
        certifications: ['Junior Elevator Technician'],
        lat: 40.7600,
        lng: -73.9850,
        address: 'Hell Kitchen, New York, NY',
        verificationStatus: 'PENDING',
        completedJobs: 3,
        earnings: 1200
      },
      {
        name: 'Anthony Russo',
        email: 'tech10@russoelev.com',
        company: 'Russo Elevators NYC',
        experience: 3,
        rating: 4.3,
        ratingCount: 8,
        licenseNumber: 'NY-ELEV-09823',
        skills: ['Hydraulic Elevators', 'Lubrication', 'Periodic Inspection'],
        certifications: ['OSHA 10 Safety'],
        lat: 40.7380,
        lng: -74.0300,
        address: 'Hoboken / Hudson Line, NY',
        verificationStatus: 'RESUBMISSION_REQUESTED',
        verificationNotes: 'Uploaded license document was blurry. Please submit a high-resolution scan of your state license credential.',
        completedJobs: 5,
        earnings: 1950
      }
    ];

    const technicians = [];
    for (const t of techSpecs) {
      const user = await User.create({
        name: t.name,
        email: t.email,
        password: 'password123',
        role: 'TECHNICIAN',
        phone: '+1 (555) 900-' + Math.floor(1000 + Math.random() * 9000),
        companyName: t.company,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 90000000)}?w=200&auto=format&fit=crop&q=80`
      });

      const tech = await Technician.create({
        user: user._id,
        company: t.company,
        experience: t.experience,
        rating: t.rating,
        ratingCount: t.ratingCount,
        licenseNumber: t.licenseNumber,
        skills: t.skills,
        certifications: t.certifications,
        serviceRadius: 35,
        location: {
          address: t.address,
          lat: t.lat,
          lng: t.lng
        },
        availability: true,
        completedJobs: t.completedJobs,
        earnings: t.earnings,
        verificationStatus: t.verificationStatus,
        verificationNotes: t.verificationNotes || '',
        documents: {
          licenseDoc: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
          certDoc: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
          idDoc: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
        }
      });
      technicians.push(tech);
    }

    // 4. Create 5 Commercial Properties
    const propertyData = [
      {
        name: 'Empire Vantage Tower',
        propertyManager: pm1._id,
        address: '350 5th Avenue',
        city: 'New York',
        state: 'NY',
        postalCode: '10118',
        coordinates: { lat: 40.7484, lng: -73.9857 },
        buildingType: 'Commercial Office',
        totalFloors: 45,
        contactPhone: '+1 (212) 736-3100',
        contactEmail: 'operations@empirevantage.com',
        imageUrl: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Hudson Horizon Plaza',
        propertyManager: pm1._id,
        address: '500 West 33rd Street, Hudson Yards',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        coordinates: { lat: 40.7538, lng: -74.0022 },
        buildingType: 'Commercial Office',
        totalFloors: 38,
        contactPhone: '+1 (212) 880-9200',
        contactEmail: 'facility@hudsonhorizon.com',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Wall Street Financial Center',
        propertyManager: pm2._id,
        address: '60 Wall Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10005',
        coordinates: { lat: 40.7075, lng: -74.0090 },
        buildingType: 'Commercial Office',
        totalFloors: 52,
        contactPhone: '+1 (212) 490-1122',
        contactEmail: 'engineering@wallstreetcenter.com',
        imageUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Grand Central Galleria & Atrium',
        propertyManager: pm2._id,
        address: '89 East 42nd Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10017',
        coordinates: { lat: 40.7527, lng: -73.9772 },
        buildingType: 'Retail Mall',
        totalFloors: 18,
        contactPhone: '+1 (212) 682-4400',
        contactEmail: 'management@gcgalleria.com',
        imageUrl: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Liberty Medical Pavilion',
        propertyManager: pm3._id,
        address: '175 North End Avenue, Battery Park',
        city: 'New York',
        state: 'NY',
        postalCode: '10282',
        coordinates: { lat: 40.7126, lng: -74.0158 },
        buildingType: 'Hospital / Medical',
        totalFloors: 24,
        contactPhone: '+1 (212) 587-9900',
        contactEmail: 'facilities@libertymedical.org',
        imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80'
      }
    ];

    const properties = await Property.create(propertyData);

    // 5. Create 15 Elevators + 8 Escalators (Total 23 Units)
    const equipmentDefinitions = [
      // Empire Vantage Tower (Prop 0) - 4 Elevators, 2 Escalators
      {
        equipmentId: 'ELEV-EMP-01',
        property: properties[0]._id,
        type: 'Elevator',
        subType: 'High-Rise Passenger Traction',
        manufacturer: 'Otis',
        model: 'SkyRise High-Speed',
        serialNumber: 'OT-SR-2020-001',
        capacity: '2000 kg / 26 Persons',
        floorsServed: '1-45 (Express)',
        installationDate: new Date('2020-03-12'),
        lastMaintenanceDate: new Date('2026-08-15'),
        nextMaintenanceDate: new Date('2026-11-15'),
        status: 'Operational'
      },
      {
        equipmentId: 'ELEV-EMP-02',
        property: properties[0]._id,
        type: 'Elevator',
        subType: 'High-Rise Passenger Traction',
        manufacturer: 'Otis',
        model: 'SkyRise High-Speed',
        serialNumber: 'OT-SR-2020-002',
        capacity: '2000 kg / 26 Persons',
        floorsServed: '1-45 (Express)',
        installationDate: new Date('2020-03-12'),
        lastMaintenanceDate: new Date('2026-09-02'),
        nextMaintenanceDate: new Date('2026-12-02'),
        status: 'Operational'
      },
      {
        equipmentId: 'ELEV-EMP-03',
        property: properties[0]._id,
        type: 'Elevator',
        subType: 'Heavy Freight Elevator',
        manufacturer: 'Schindler',
        model: 'Schindler 7000 Freight',
        serialNumber: 'SCH-FR-2019-89',
        capacity: '4500 kg / Heavy Load',
        floorsServed: 'Basement 2 to 45',
        installationDate: new Date('2019-11-20'),
        lastMaintenanceDate: new Date('2026-07-10'),
        nextMaintenanceDate: new Date('2026-10-10'),
        status: 'Maintenance Due'
      },
      {
        equipmentId: 'ELEV-EMP-04',
        property: properties[0]._id,
        type: 'Elevator',
        subType: 'Local Bank Passenger',
        manufacturer: 'Otis',
        model: 'Gen2 High-Performance',
        serialNumber: 'OT-G2-2021-140',
        capacity: '1600 kg / 21 Persons',
        floorsServed: '1-22 (Low Rise)',
        installationDate: new Date('2021-04-18'),
        lastMaintenanceDate: new Date('2026-09-18'),
        nextMaintenanceDate: new Date('2026-12-18'),
        status: 'Operational'
      },
      {
        equipmentId: 'ESCL-EMP-01',
        property: properties[0]._id,
        type: 'Escalator',
        subType: 'Commercial Step-Type',
        manufacturer: 'KONE',
        model: 'TravelMaster 110',
        serialNumber: 'KNE-TM-2020-11',
        capacity: '9,000 Persons / hr',
        floorsServed: 'Concourse to Ground Lobby',
        installationDate: new Date('2020-04-05'),
        lastMaintenanceDate: new Date('2026-08-25'),
        nextMaintenanceDate: new Date('2026-11-25'),
        status: 'Operational'
      },
      {
        equipmentId: 'ESCL-EMP-02',
        property: properties[0]._id,
        type: 'Escalator',
        subType: 'Commercial Step-Type',
        manufacturer: 'KONE',
        model: 'TravelMaster 110',
        serialNumber: 'KNE-TM-2020-12',
        capacity: '9,000 Persons / hr',
        floorsServed: 'Ground Lobby to Concourse',
        installationDate: new Date('2020-04-05'),
        lastMaintenanceDate: new Date('2026-09-10'),
        nextMaintenanceDate: new Date('2026-12-10'),
        status: 'Operational'
      },

      // Hudson Horizon Plaza (Prop 1) - 3 Elevators, 2 Escalators
      {
        equipmentId: 'ELEV-HUD-01',
        property: properties[1]._id,
        type: 'Elevator',
        subType: 'Panoramic Glass Elevator',
        manufacturer: 'Schindler',
        model: 'Schindler 5500 Panoramic',
        serialNumber: 'SCH-55-2022-441',
        capacity: '1600 kg / 21 Persons',
        floorsServed: 'Atrium L1 to Sky Garden L38',
        installationDate: new Date('2022-02-14'),
        lastMaintenanceDate: new Date('2026-08-30'),
        nextMaintenanceDate: new Date('2026-11-30'),
        status: 'Operational'
      },
      {
        equipmentId: 'ELEV-HUD-02',
        property: properties[1]._id,
        type: 'Elevator',
        subType: 'Passenger Traction',
        manufacturer: 'TK Elevator',
        model: 'momentum High-Rise',
        serialNumber: 'TKE-MM-2021-903',
        capacity: '1800 kg / 24 Persons',
        floorsServed: '1-38',
        installationDate: new Date('2021-08-20'),
        lastMaintenanceDate: new Date('2026-09-14'),
        nextMaintenanceDate: new Date('2026-12-14'),
        status: 'Under Maintenance'
      },
      {
        equipmentId: 'ELEV-HUD-03',
        property: properties[1]._id,
        type: 'Elevator',
        subType: 'Service & Freight',
        manufacturer: 'TK Elevator',
        model: 'evolution Commercial',
        serialNumber: 'TKE-EV-2021-102',
        capacity: '2500 kg / 33 Persons',
        floorsServed: 'Loading Dock to 38',
        installationDate: new Date('2021-09-01'),
        lastMaintenanceDate: new Date('2026-09-01'),
        nextMaintenanceDate: new Date('2026-12-01'),
        status: 'Operational'
      },
      {
        equipmentId: 'ESCL-HUD-01',
        property: properties[1]._id,
        type: 'Escalator',
        subType: 'Heavy Commercial Escalator',
        manufacturer: 'Schindler',
        model: 'Schindler 9300',
        serialNumber: 'SCH-93-2021-701',
        capacity: '7,500 Persons / hr',
        floorsServed: 'Ground to Level 2 Mezzanine',
        installationDate: new Date('2021-06-10'),
        lastMaintenanceDate: new Date('2026-08-01'),
        nextMaintenanceDate: new Date('2026-11-01'),
        status: 'Breakdown'
      },
      {
        equipmentId: 'ESCL-HUD-02',
        property: properties[1]._id,
        type: 'Escalator',
        subType: 'Heavy Commercial Escalator',
        manufacturer: 'Schindler',
        model: 'Schindler 9300',
        serialNumber: 'SCH-93-2021-702',
        capacity: '7,500 Persons / hr',
        floorsServed: 'Level 2 to Level 3 Dining',
        installationDate: new Date('2021-06-10'),
        lastMaintenanceDate: new Date('2026-08-01'),
        nextMaintenanceDate: new Date('2026-11-01'),
        status: 'Operational'
      },

      // Wall Street Financial Center (Prop 2) - 4 Elevators, 1 Escalator
      {
        equipmentId: 'ELEV-WSF-01',
        property: properties[2]._id,
        type: 'Elevator',
        subType: 'Destination Dispatch Traction',
        manufacturer: 'Otis',
        model: 'CompassPlus SkyRise',
        serialNumber: 'OT-CP-2018-091',
        capacity: '2200 kg / 29 Persons',
        floorsServed: '1-52 Bank A',
        installationDate: new Date('2018-06-15'),
        lastMaintenanceDate: new Date('2026-09-05'),
        nextMaintenanceDate: new Date('2026-12-05'),
        status: 'Operational'
      },
      {
        equipmentId: 'ELEV-WSF-02',
        property: properties[2]._id,
        type: 'Elevator',
        subType: 'Destination Dispatch Traction',
        manufacturer: 'Otis',
        model: 'CompassPlus SkyRise',
        serialNumber: 'OT-CP-2018-092',
        capacity: '2200 kg / 29 Persons',
        floorsServed: '1-52 Bank B',
        installationDate: new Date('2018-06-15'),
        lastMaintenanceDate: new Date('2026-09-05'),
        nextMaintenanceDate: new Date('2026-12-05'),
        status: 'Operational'
      },
      {
        equipmentId: 'ELEV-WSF-03',
        property: properties[2]._id,
        type: 'Elevator',
        subType: 'Passenger Traction',
        manufacturer: 'Otis',
        model: 'Gen2 Executive',
        serialNumber: 'OT-EX-2018-095',
        capacity: '1600 kg / 21 Persons',
        floorsServed: '40-52 Executive Suites',
        installationDate: new Date('2018-08-10'),
        lastMaintenanceDate: new Date('2026-08-10'),
        nextMaintenanceDate: new Date('2026-11-10'),
        status: 'Maintenance Due'
      },
      {
        equipmentId: 'ELEV-WSF-04',
        property: properties[2]._id,
        type: 'Elevator',
        subType: 'Heavy Duty Service Car',
        manufacturer: 'KONE',
        model: 'TranSys Heavy Duty',
        serialNumber: 'KNE-TS-2018-33',
        capacity: '4000 kg',
        floorsServed: 'Basement 3 to 52',
        installationDate: new Date('2018-05-01'),
        lastMaintenanceDate: new Date('2026-07-22'),
        nextMaintenanceDate: new Date('2026-10-22'),
        status: 'Operational'
      },
      {
        equipmentId: 'ESCL-WSF-01',
        property: properties[2]._id,
        type: 'Escalator',
        subType: 'Main Concourse Step-Type',
        manufacturer: 'Otis',
        model: 'NCE Commercial',
        serialNumber: 'OT-NC-2018-77',
        capacity: '8,000 Persons / hr',
        floorsServed: 'Subway Plaza to Security Turnstiles',
        installationDate: new Date('2018-06-01'),
        lastMaintenanceDate: new Date('2026-09-12'),
        nextMaintenanceDate: new Date('2026-12-12'),
        status: 'Operational'
      },

      // Grand Central Galleria & Atrium (Prop 3) - 2 Elevators, 3 Escalators
      {
        equipmentId: 'ELEV-GCG-01',
        property: properties[3]._id,
        type: 'Elevator',
        subType: 'Panoramic Retail Elevator',
        manufacturer: 'Mitsubishi Electric',
        model: 'Nexiez-MR Glass',
        serialNumber: 'MIT-NX-2021-501',
        capacity: '1350 kg / 18 Persons',
        floorsServed: 'Retail L1 to L6',
        installationDate: new Date('2021-01-20'),
        lastMaintenanceDate: new Date('2026-09-20'),
        nextMaintenanceDate: new Date('2026-12-20'),
        status: 'Operational'
      },
      {
        equipmentId: 'ELEV-GCG-02',
        property: properties[3]._id,
        type: 'Elevator',
        subType: 'Tower Passenger Lift',
        manufacturer: 'Mitsubishi Electric',
        model: 'Nexiez-MR Passenger',
        serialNumber: 'MIT-NX-2021-502',
        capacity: '1600 kg / 21 Persons',
        floorsServed: 'L1 to L18 Offices',
        installationDate: new Date('2021-01-20'),
        lastMaintenanceDate: new Date('2026-08-18'),
        nextMaintenanceDate: new Date('2026-11-18'),
        status: 'Operational'
      },
      {
        equipmentId: 'ESCL-GCG-01',
        property: properties[3]._id,
        type: 'Escalator',
        subType: 'Atrium Commercial Escalator',
        manufacturer: 'Schindler',
        model: 'Schindler 9300 Advanced',
        serialNumber: 'SCH-AT-2021-10',
        capacity: '6,500 Persons / hr',
        floorsServed: 'Level 1 to Level 2',
        installationDate: new Date('2021-02-15'),
        lastMaintenanceDate: new Date('2026-09-15'),
        nextMaintenanceDate: new Date('2026-12-15'),
        status: 'Operational'
      },
      {
        equipmentId: 'ESCL-GCG-02',
        property: properties[3]._id,
        type: 'Escalator',
        subType: 'Atrium Commercial Escalator',
        manufacturer: 'Schindler',
        model: 'Schindler 9300 Advanced',
        serialNumber: 'SCH-AT-2021-11',
        capacity: '6,500 Persons / hr',
        floorsServed: 'Level 2 to Level 3',
        installationDate: new Date('2021-02-15'),
        lastMaintenanceDate: new Date('2026-09-15'),
        nextMaintenanceDate: new Date('2026-12-15'),
        status: 'Operational'
      },
      {
        equipmentId: 'ESCL-GCG-03',
        property: properties[3]._id,
        type: 'Escalator',
        subType: 'Atrium Commercial Escalator',
        manufacturer: 'Schindler',
        model: 'Schindler 9300 Advanced',
        serialNumber: 'SCH-AT-2021-12',
        capacity: '6,500 Persons / hr',
        floorsServed: 'Level 3 to Level 4 Cinema & Food Court',
        installationDate: new Date('2021-02-15'),
        lastMaintenanceDate: new Date('2026-07-28'),
        nextMaintenanceDate: new Date('2026-10-28'),
        status: 'Maintenance Due'
      },

      // Liberty Medical Pavilion (Prop 4) - 2 Elevators
      {
        equipmentId: 'ELEV-LIB-01',
        property: properties[4]._id,
        type: 'Elevator',
        subType: 'Hospital Gurney & Bed Lift',
        manufacturer: 'KONE',
        model: 'MonoSpace 700 Medical',
        serialNumber: 'KNE-MED-2023-01',
        capacity: '2500 kg / Dual Stretcher',
        floorsServed: 'Emergency ER to Trauma ICU L1-24',
        installationDate: new Date('2023-04-10'),
        lastMaintenanceDate: new Date('2026-09-10'),
        nextMaintenanceDate: new Date('2026-12-10'),
        status: 'Operational'
      },
      {
        equipmentId: 'ELEV-LIB-02',
        property: properties[4]._id,
        type: 'Elevator',
        subType: 'Hospital Gurney & Bed Lift',
        manufacturer: 'KONE',
        model: 'MonoSpace 700 Medical',
        serialNumber: 'KNE-MED-2023-02',
        capacity: '2500 kg / Dual Stretcher',
        floorsServed: 'Ground to Level 24 Specialist Clinics',
        installationDate: new Date('2023-04-10'),
        lastMaintenanceDate: new Date('2026-09-28'),
        nextMaintenanceDate: new Date('2026-12-28'),
        status: 'Operational'
      }
    ];

    // Seed equipment with rich initial history timelines
    const equipmentUnits = [];
    for (const eq of equipmentDefinitions) {
      const createdEq = await Equipment.create({
        ...eq,
        historyTimeline: [
          {
            date: eq.installationDate,
            type: 'Installation',
            title: 'Initial Commissioning & Certification',
            description: `Certified by ${eq.manufacturer} factory engineering team. Complete load tests & governor drop safety tests approved.`,
            performedBy: 'Master Inspector'
          },
          {
            date: new Date(eq.installationDate.getTime() + 180 * 24 * 60 * 60 * 1000),
            type: 'Maintenance',
            title: 'Six-Month Comprehensive Preventative Maintenance',
            description: 'Guide rails lubricated, hydraulic seal check, traction wire rope tension verified, door interlocks tested.',
            performedBy: 'Certified Technician'
          },
          {
            date: eq.lastMaintenanceDate,
            type: 'Inspection',
            title: 'Annual State Safety Inspection & Load Certification',
            description: 'Passed all municipal codes. No infractions noted. Certificates posted in cab / machinery space.',
            performedBy: 'State Certified QEI Inspector'
          }
        ]
      });
      equipmentUnits.push(createdEq);
    }

    console.log(`[Seed] Created ${equipmentUnits.length} equipment units across 5 properties.`);

    // 6. Create 20 Maintenance Requests across diverse statuses
    const sampleRequests = [
      {
        property: properties[1]._id,
        equipment: equipmentUnits[9]._id, // ESCL-HUD-01
        propertyManager: pm1._id,
        assignedTechnician: technicians[3]._id, // Sarah Jenkins (Metro Escalator Techs)
        requestType: 'Breakdown',
        priority: 'CRITICAL',
        isEmergency: true,
        etaMinutes: 18,
        description: 'Level 2 Escalator stopped abruptly during peak morning traffic. Error code E-42 on drive control board.',
        status: 'IN_PROGRESS',
        preferredDate: new Date(),
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Emergency dispatch triggered by Property Manager', updatedBy: 'Sarah Chen' },
          { status: 'ASSIGNED', timestamp: new Date(Date.now() - 3600000 * 1.8), note: 'Dispatched to nearest verified specialist (Metro Escalator Techs)', updatedBy: 'Dispatch System' },
          { status: 'ACCEPTED', timestamp: new Date(Date.now() - 3600000 * 1.5), note: 'Job accepted. En route ETA 18 mins.', updatedBy: 'Sarah Jenkins' },
          { status: 'ARRIVED', timestamp: new Date(Date.now() - 3600000 * 1), note: 'Technician on-site. Securing safety stanchions.', updatedBy: 'Sarah Jenkins' },
          { status: 'IN_PROGRESS', timestamp: new Date(Date.now() - 3600000 * 0.5), note: 'Diagnosing comb plate microswitch sensors and step band tension.', updatedBy: 'Sarah Jenkins' }
        ]
      },
      {
        property: properties[1]._id,
        equipment: equipmentUnits[7]._id, // ELEV-HUD-02
        propertyManager: pm1._id,
        assignedTechnician: technicians[1]._id, // Carlos Ramirez
        requestType: 'Preventive Maintenance',
        priority: 'HIGH',
        isEmergency: false,
        description: 'Vibration observed at floors 28-34 during descent. Guide shoe roller bearings inspection required.',
        status: 'IN_PROGRESS',
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 86400000 * 1), note: 'Created by Property Manager', updatedBy: 'Sarah Chen' },
          { status: 'ASSIGNED', timestamp: new Date(Date.now() - 86400000 * 0.9), note: 'Assigned to Apex Vertical Systems', updatedBy: 'Sarah Chen' },
          { status: 'ACCEPTED', timestamp: new Date(Date.now() - 86400000 * 0.8), note: 'Accepted by Carlos Ramirez', updatedBy: 'Carlos Ramirez' },
          { status: 'IN_PROGRESS', timestamp: new Date(Date.now() - 3600000 * 3), note: 'Replacing worn polyurethane roller guides in hoistway.', updatedBy: 'Carlos Ramirez' }
        ]
      },
      {
        property: properties[0]._id,
        equipment: equipmentUnits[2]._id, // ELEV-EMP-03 (Freight)
        propertyManager: pm1._id,
        assignedTechnician: technicians[5]._id, // Dmitri Volkov
        requestType: 'Routine Maintenance',
        priority: 'MEDIUM',
        isEmergency: false,
        description: 'Quarterly routine servicing for freight hoist motor and counterweight buffering system.',
        status: 'ACCEPTED',
        etaMinutes: 45,
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 5), note: 'Created scheduled maintenance', updatedBy: 'Sarah Chen' },
          { status: 'ASSIGNED', timestamp: new Date(Date.now() - 3600000 * 4), note: 'Assigned to Titan Heavy Lift Maintenance', updatedBy: 'Sarah Chen' },
          { status: 'ACCEPTED', timestamp: new Date(Date.now() - 3600000 * 3), note: 'Job accepted. Scheduled for today.', updatedBy: 'Dmitri Volkov' }
        ]
      },
      {
        property: properties[2]._id,
        equipment: equipmentUnits[13]._id, // ELEV-WSF-03
        propertyManager: pm2._id,
        assignedTechnician: technicians[0]._id, // Raj Patel
        requestType: 'Inspection',
        priority: 'MEDIUM',
        isEmergency: false,
        description: 'Annual mechanical governor speed check and door sensor photoelectric beam calibration.',
        status: 'COMPLETED',
        completedDate: new Date(Date.now() - 86400000 * 2),
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 86400000 * 3), note: 'Request logged', updatedBy: 'David Miller' },
          { status: 'ASSIGNED', timestamp: new Date(Date.now() - 86400000 * 2.8), note: 'Assigned to Raj Elevator Services', updatedBy: 'David Miller' },
          { status: 'ACCEPTED', timestamp: new Date(Date.now() - 86400000 * 2.6), note: 'Accepted by Raj Patel', updatedBy: 'Raj Patel' },
          { status: 'COMPLETED', timestamp: new Date(Date.now() - 86400000 * 2), note: 'Work completed. Service report submitted.', updatedBy: 'Raj Patel' }
        ]
      },
      {
        property: properties[3]._id,
        equipment: equipmentUnits[20]._id, // ESCL-GCG-03
        propertyManager: pm2._id,
        assignedTechnician: technicians[7]._id, // Marcus Brody
        requestType: 'Routine Maintenance',
        priority: 'LOW',
        isEmergency: false,
        description: 'Step chain lubrication and handrail friction drive tension adjustment.',
        status: 'ASSIGNED',
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 6), note: 'Created routine request', updatedBy: 'David Miller' },
          { status: 'ASSIGNED', timestamp: new Date(Date.now() - 3600000 * 5), note: 'Assigned to Brody Escalator & Lift Works', updatedBy: 'David Miller' }
        ]
      },
      {
        property: properties[4]._id,
        equipment: equipmentUnits[21]._id, // ELEV-LIB-01 (Hospital)
        propertyManager: pm3._id,
        assignedTechnician: technicians[0]._id, // Raj Patel
        requestType: 'Preventive Maintenance',
        priority: 'HIGH',
        isEmergency: false,
        description: 'Critical hospital emergency elevator bi-monthly preventative check and backup power battery inverter test.',
        status: 'APPROVED',
        completedDate: new Date(Date.now() - 86400000 * 4),
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 86400000 * 6), note: 'Created by Elena Rostova', updatedBy: 'Elena Rostova' },
          { status: 'ASSIGNED', timestamp: new Date(Date.now() - 86400000 * 5.8), note: 'Assigned to Raj Patel', updatedBy: 'Elena Rostova' },
          { status: 'COMPLETED', timestamp: new Date(Date.now() - 86400000 * 4.5), note: 'Work completed by Raj Patel', updatedBy: 'Raj Patel' },
          { status: 'APPROVED', timestamp: new Date(Date.now() - 86400000 * 4), note: 'Service report approved by Hospital Facility Director Elena Rostova', updatedBy: 'Elena Rostova' }
        ]
      },
      {
        property: properties[0]._id,
        equipment: equipmentUnits[0]._id, // ELEV-EMP-01
        propertyManager: pm1._id,
        assignedTechnician: null,
        requestType: 'Routine Maintenance',
        priority: 'LOW',
        isEmergency: false,
        description: 'Scheduled semi-annual cab illumination LED ballast and hall station push-button tactile replacement.',
        status: 'REQUESTED',
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Submitted by Sarah Chen', updatedBy: 'Sarah Chen' }
        ]
      },
      {
        property: properties[2]._id,
        equipment: equipmentUnits[11]._id, // ELEV-WSF-01
        propertyManager: pm2._id,
        assignedTechnician: technicians[1]._id,
        requestType: 'Inspection',
        priority: 'MEDIUM',
        isEmergency: false,
        description: 'Full controller diagnostic readout on Otis Compass dispatch processor unit.',
        status: 'ON_THE_WAY',
        etaMinutes: 22,
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 3), note: 'Created request', updatedBy: 'David Miller' },
          { status: 'ACCEPTED', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Accepted by Carlos Ramirez', updatedBy: 'Carlos Ramirez' },
          { status: 'ON_THE_WAY', timestamp: new Date(Date.now() - 3600000 * 0.5), note: 'En route in company service truck. ETA: 22 mins.', updatedBy: 'Carlos Ramirez' }
        ]
      },
      {
        property: properties[3]._id,
        equipment: equipmentUnits[16]._id, // ELEV-GCG-01
        propertyManager: pm2._id,
        assignedTechnician: technicians[6]._id, // Priya Sharma
        requestType: 'Preventive Maintenance',
        priority: 'MEDIUM',
        isEmergency: false,
        description: 'Glass panoramic cab exterior guide rails cleaning and door clutch adjustment.',
        status: 'INSPECTION',
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 4), note: 'Logged request', updatedBy: 'David Miller' },
          { status: 'ACCEPTED', timestamp: new Date(Date.now() - 3600000 * 3), note: 'Accepted by Priya Sharma', updatedBy: 'Priya Sharma' },
          { status: 'ARRIVED', timestamp: new Date(Date.now() - 3600000 * 1.5), note: 'Arrived at Galleria', updatedBy: 'Priya Sharma' },
          { status: 'INSPECTION', timestamp: new Date(Date.now() - 3600000 * 0.8), note: 'Inspecting door clutch alignment and interlock microswitches.', updatedBy: 'Priya Sharma' }
        ]
      },
      {
        property: properties[0]._id,
        equipment: equipmentUnits[4]._id, // ESCL-EMP-01
        propertyManager: pm1._id,
        assignedTechnician: technicians[3]._id,
        requestType: 'Routine Maintenance',
        priority: 'MEDIUM',
        isEmergency: false,
        description: 'Monthly skirt brush clearance check and comb segment tooth wear measurement.',
        status: 'COMPLETED',
        completedDate: new Date(Date.now() - 86400000 * 1),
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 86400000 * 2), note: 'Created request', updatedBy: 'Sarah Chen' },
          { status: 'COMPLETED', timestamp: new Date(Date.now() - 86400000 * 1), note: 'Job finished. Service report submitted.', updatedBy: 'Sarah Jenkins' }
        ]
      },
      {
        property: properties[4]._id,
        equipment: equipmentUnits[22]._id, // ELEV-LIB-02
        propertyManager: pm3._id,
        assignedTechnician: technicians[2]._id, // Alex Becker
        requestType: 'Routine Maintenance',
        priority: 'LOW',
        isEmergency: false,
        description: 'Routine oil analysis and leveling sensor calibration on Floor 12 and 18.',
        status: 'APPROVED',
        completedDate: new Date(Date.now() - 86400000 * 3),
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 86400000 * 5), note: 'Created by Elena Rostova', updatedBy: 'Elena Rostova' },
          { status: 'APPROVED', timestamp: new Date(Date.now() - 86400000 * 3), note: 'Approved by Elena Rostova', updatedBy: 'Elena Rostova' }
        ]
      },
      {
        property: properties[1]._id,
        equipment: equipmentUnits[6]._id, // ELEV-HUD-01
        propertyManager: pm1._id,
        assignedTechnician: technicians[6]._id,
        requestType: 'Inspection',
        priority: 'LOW',
        isEmergency: false,
        description: 'Scenic hoistway LED backlighting check and cab ventilation blower motor test.',
        status: 'CLOSED',
        completedDate: new Date(Date.now() - 86400000 * 5),
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 86400000 * 7), note: 'Created request', updatedBy: 'Sarah Chen' },
          { status: 'CLOSED', timestamp: new Date(Date.now() - 86400000 * 5), note: 'Approved and closed', updatedBy: 'Sarah Chen' }
        ]
      },
      {
        property: properties[2]._id,
        equipment: equipmentUnits[12]._id, // ELEV-WSF-02
        propertyManager: pm2._id,
        assignedTechnician: null,
        requestType: 'Preventive Maintenance',
        priority: 'MEDIUM',
        isEmergency: false,
        description: 'Upcoming scheduled preventative brake shoe lining inspection.',
        status: 'REQUESTED',
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 12), note: 'Created request', updatedBy: 'David Miller' }
        ]
      },
      {
        property: properties[3]._id,
        equipment: equipmentUnits[18]._id, // ESCL-GCG-01
        propertyManager: pm2._id,
        assignedTechnician: technicians[3]._id,
        requestType: 'Routine Maintenance',
        priority: 'LOW',
        isEmergency: false,
        description: 'Bi-weekly handrail sanitizing UV module lamp replacement and drive chain tension check.',
        status: 'COMPLETED',
        completedDate: new Date(Date.now() - 86400000 * 1.5),
        timeline: [
          { status: 'COMPLETED', timestamp: new Date(Date.now() - 86400000 * 1.5), note: 'Completed by Sarah Jenkins', updatedBy: 'Sarah Jenkins' }
        ]
      },
      {
        property: properties[0]._id,
        equipment: equipmentUnits[3]._id, // ELEV-EMP-04
        propertyManager: pm1._id,
        assignedTechnician: technicians[4]._id, // Liam O'Connor
        requestType: 'Routine Maintenance',
        priority: 'MEDIUM',
        isEmergency: false,
        description: 'Door operator belt replacement and car sill groove debris cleaning.',
        status: 'ACCEPTED',
        etaMinutes: 40,
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 8), note: 'Created request', updatedBy: 'Sarah Chen' },
          { status: 'ACCEPTED', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Accepted by Liam O Connor', updatedBy: 'Liam O Connor' }
        ]
      },
      {
        property: properties[1]._id,
        equipment: equipmentUnits[8]._id, // ELEV-HUD-03
        propertyManager: pm1._id,
        assignedTechnician: technicians[5]._id,
        requestType: 'Installation',
        priority: 'LOW',
        isEmergency: false,
        description: 'Installation of stainless steel protective wall padding for upcoming tenant move-in operations.',
        status: 'ASSIGNED',
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 14), note: 'Logged request', updatedBy: 'Sarah Chen' },
          { status: 'ASSIGNED', timestamp: new Date(Date.now() - 3600000 * 9), note: 'Assigned to Titan Heavy Lift', updatedBy: 'Sarah Chen' }
        ]
      },
      {
        property: properties[2]._id,
        equipment: equipmentUnits[15]._id, // ESCL-WSF-01
        propertyManager: pm2._id,
        assignedTechnician: technicians[7]._id,
        requestType: 'Routine Maintenance',
        priority: 'MEDIUM',
        isEmergency: false,
        description: 'Handrail drive roller replacement and emergency stop button testing.',
        status: 'APPROVED',
        completedDate: new Date(Date.now() - 86400000 * 6),
        timeline: [
          { status: 'COMPLETED', timestamp: new Date(Date.now() - 86400000 * 6.5), note: 'Work completed', updatedBy: 'Marcus Brody' },
          { status: 'APPROVED', timestamp: new Date(Date.now() - 86400000 * 6), note: 'Approved by David Miller', updatedBy: 'David Miller' }
        ]
      },
      {
        property: properties[3]._id,
        equipment: equipmentUnits[17]._id, // ELEV-GCG-02
        propertyManager: pm2._id,
        assignedTechnician: null,
        requestType: 'Routine Maintenance',
        priority: 'LOW',
        isEmergency: false,
        description: 'Hall call station chime volume adjustment on levels 14 through 18.',
        status: 'REQUESTED',
        timeline: [
          { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 16), note: 'Logged request', updatedBy: 'David Miller' }
        ]
      },
      {
        property: properties[0]._id,
        equipment: equipmentUnits[1]._id, // ELEV-EMP-02
        propertyManager: pm1._id,
        assignedTechnician: technicians[0]._id,
        requestType: 'Inspection',
        priority: 'MEDIUM',
        isEmergency: false,
        description: 'High-speed buffer oil level verification and counterweight guide shoe measurement.',
        status: 'CLOSED',
        completedDate: new Date(Date.now() - 86400000 * 8),
        timeline: [
          { status: 'APPROVED', timestamp: new Date(Date.now() - 86400000 * 8), note: 'Closed', updatedBy: 'Sarah Chen' }
        ]
      },
      {
        property: properties[4]._id,
        equipment: equipmentUnits[21]._id, // ELEV-LIB-01
        propertyManager: pm3._id,
        assignedTechnician: technicians[1]._id,
        requestType: 'Emergency',
        priority: 'CRITICAL',
        isEmergency: true,
        etaMinutes: 15,
        description: 'Door interlock fault on Floor 3 surgery trauma entrance. Solenoid lock stuck in locked state.',
        status: 'COMPLETED',
        completedDate: new Date(Date.now() - 86400000 * 7),
        timeline: [
          { status: 'COMPLETED', timestamp: new Date(Date.now() - 86400000 * 7), note: 'Emergency resolved and certified', updatedBy: 'Carlos Ramirez' }
        ]
      }
    ];

    const requests = await MaintenanceRequest.create(sampleRequests);
    console.log(`[Seed] Created ${requests.length} maintenance requests.`);

    // 7. Create Service Reports for the Completed/Approved requests
    const serviceReportsData = [
      {
        maintenanceRequest: requests[3]._id, // ELEV-WSF-03 (Raj Patel)
        technician: technicians[0]._id,
        equipment: equipmentUnits[13]._id,
        property: properties[2]._id,
        inspectionDetails: 'Conducted mechanical overspeed governor test at 115% rated speed. Governor jaw engagement tripped safety wedges symmetrically on both guide rails.',
        problemIdentified: 'Slight carbon dusting observed on governor rope sheave and minor wear on door sensor photoelectric receiver lens.',
        workPerformed: 'Cleaned and calibrated governor tripping mechanism, cleaned photoelectric lenses, tested safety circuit interlocks and recorded 0.04s relay trip time.',
        partsReplaced: ['Photoelectric Sensor Optic Head', 'Governor Calibration Seal'],
        recommendations: 'System compliant with ASME A17.1 Section 8.11. Next annual inspection scheduled for October 2027.',
        beforeImages: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80'
        ],
        afterImages: [
          'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80'
        ],
        technicianNotes: 'Governor safety wedges reset cleanly. Cab test runs smoothly under full rated load.',
        laborHours: 3.5,
        costEstimate: 520,
        status: 'PENDING_APPROVAL'
      },
      {
        maintenanceRequest: requests[5]._id, // ELEV-LIB-01 Hospital (Raj Patel)
        technician: technicians[0]._id,
        equipment: equipmentUnits[21]._id,
        property: properties[4]._id,
        inspectionDetails: 'Full bi-monthly critical care inspection of traction drive machine, emergency battery lowering unit, and firefighter Phase I & II operations.',
        problemIdentified: 'Battery lowering inverter cell voltage was marginally low (23.4V vs nominal 24.0V).',
        workPerformed: 'Replaced auxiliary backup battery bank, verified automatic floor leveling upon simulated mains power cut. Tested key switch recall to Ground Floor trauma bay.',
        partsReplaced: ['Dual 12V 18Ah AGM Backup Batteries', 'Phase I Fire Recall Relay'],
        recommendations: 'Emergency backup tested and fully verified. In compliance with Joint Commission Hospital Standards.',
        beforeImages: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
        ],
        afterImages: [
          'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80'
        ],
        technicianNotes: 'Elevator certified for hospital code red operations.',
        laborHours: 4.0,
        costEstimate: 780,
        status: 'APPROVED',
        managerFeedback: 'Excellent response time. Crucial for our trauma department. Certified and approved.',
        approvedAt: new Date(Date.now() - 86400000 * 4)
      },
      {
        maintenanceRequest: requests[9]._id, // ESCL-EMP-01 (Sarah Jenkins)
        technician: technicians[3]._id,
        equipment: equipmentUnits[4]._id,
        property: properties[0]._id,
        inspectionDetails: 'Measured skirt panel deflection and checked clearance between step treads and skirt brush seals.',
        problemIdentified: 'Left skirt brush worn down at entry landing, creating minor safety gap hazard.',
        workPerformed: 'Replaced 4 meters of left-side skirt deflector brush assembly, adjusted comb plate teeth height to 5mm penetration into tread grooves.',
        partsReplaced: ['High-Density Skirt Safety Brush Strip (4m)', 'Comb Plate Segment Tooth Castings (x2)'],
        recommendations: 'Check handrail drive chain tension at next quarterly service.',
        beforeImages: [
          'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80'
        ],
        afterImages: [
          'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80'
        ],
        technicianNotes: 'Escalator restarted and observed for 30 minutes without anomalous sound or friction.',
        laborHours: 2.5,
        costEstimate: 420,
        status: 'PENDING_APPROVAL'
      }
    ];

    await ServiceReport.create(serviceReportsData);
    console.log(`[Seed] Created ${serviceReportsData.length} service reports.`);

    // 8. Create Realistic Notifications
    const notificationsData = [
      {
        recipient: pm1._id,
        title: '🚨 Emergency Service in Progress',
        message: 'Technician Sarah Jenkins is on-site repairing ESCL-HUD-01 at Hudson Horizon Plaza.',
        type: 'EMERGENCY',
        link: `/requests/${requests[0]._id}`,
        isRead: false
      },
      {
        recipient: pm2._id,
        title: '📋 Service Report Ready for Approval',
        message: 'Raj Elevator Services submitted service report for ELEV-WSF-03 at Wall Street Financial Center.',
        type: 'REPORT_SUBMITTED',
        link: `/requests/${requests[3]._id}`,
        isRead: false
      },
      {
        recipient: technicians[0].user,
        title: '🎉 Service Report Approved!',
        message: 'Elena Rostova approved your report for Hospital Elevator ELEV-LIB-01. $780 credited.',
        type: 'STATUS_CHANGE',
        link: '/technician/jobs',
        isRead: true
      },
      {
        recipient: admin._id,
        title: 'Technician Verification Pending',
        message: 'Zack Taylor (NextGen Vertical Mobility) has uploaded credentials awaiting admin review.',
        type: 'VERIFICATION',
        link: '/admin/verifications',
        isRead: false
      }
    ];

    await Notification.create(notificationsData);
    console.log('[Seed] Seed completed successfully!');
    return true;
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    throw err;
  }
};

module.exports = seedDatabase;
