// Mock Database & API Service for LiftCare Network
// Provides persistent in-browser demonstration state (via localStorage)
// Enables seamless role switching, real-time-like updates, and full UI interactivity on static deployments (e.g. Vercel)

const STORAGE_KEY = 'liftcare_mock_db_v1';

// Initial Seed Data
const INITIAL_USERS = [
  {
    _id: 'user-admin-1',
    name: 'Marcus Vance',
    email: 'admin@liftcare.com',
    role: 'ADMIN',
    phone: '+1 (555) 100-2000',
    companyName: 'LiftCare Network Global HQ',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2026-01-10T00:00:00.000Z'
  },
  {
    _id: 'user-pm-1',
    name: 'Sarah Chen',
    email: 'pm1@apexprop.com',
    role: 'PROPERTY_MANAGER',
    phone: '+1 (555) 301-4421',
    companyName: 'Apex Commercial Real Estate Partners',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    _id: 'user-pm-2',
    name: 'David Miller',
    email: 'pm2@metrotower.com',
    role: 'PROPERTY_MANAGER',
    phone: '+1 (555) 412-8890',
    companyName: 'Metro Horizon Asset Management',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2026-01-18T00:00:00.000Z'
  },
  {
    _id: 'user-pm-3',
    name: 'Elena Rostova',
    email: 'pm3@sterlingasset.com',
    role: 'PROPERTY_MANAGER',
    phone: '+1 (555) 789-2234',
    companyName: 'Sterling Tower Holdings Group',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2026-01-20T00:00:00.000Z'
  },
  {
    _id: 'user-tech-1',
    name: 'Raj Patel',
    email: 'tech1@patellift.com',
    role: 'TECHNICIAN',
    phone: '+1 (555) 900-1428',
    companyName: 'Raj Elevator Services NYC',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z'
  },
  {
    _id: 'user-tech-2',
    name: 'Carlos Ramirez',
    email: 'tech2@apexvertical.com',
    role: 'TECHNICIAN',
    phone: '+1 (555) 900-2481',
    companyName: 'Apex Vertical Systems LLC',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2026-02-03T00:00:00.000Z'
  },
  {
    _id: 'user-tech-4',
    name: 'Sarah Jenkins',
    email: 'tech4@metroescalator.com',
    role: 'TECHNICIAN',
    phone: '+1 (555) 900-4821',
    companyName: 'Metro Escalator Techs',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2026-02-05T00:00:00.000Z'
  },
  {
    _id: 'user-tech-9',
    name: 'Zack Taylor',
    email: 'tech9@nextgenlift.com',
    role: 'TECHNICIAN',
    phone: '+1 (555) 900-9124',
    companyName: 'NextGen Vertical Mobility Inc.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2026-03-01T00:00:00.000Z'
  }
];

const INITIAL_TECHNICIANS = [
  {
    _id: 'tech-profile-1',
    user: INITIAL_USERS[4],
    company: 'Raj Elevator Services NYC',
    experience: 8,
    rating: 4.8,
    ratingCount: 38,
    licenseNumber: 'NY-ELEV-94821',
    skills: ['Traction Elevators', 'Hydraulic Elevators', 'Emergency Rescue', 'Door Operators', 'Routine Inspection'],
    certifications: ['QEI Certified Inspector', 'OSHA 30 Safety', 'NAEC CET'],
    serviceRadius: 35,
    location: {
      address: 'Tribeca, New York, NY',
      lat: 40.7180,
      lng: -74.0020
    },
    availability: true,
    completedJobs: 42,
    earnings: 16800,
    verificationStatus: 'VERIFIED',
    verificationNotes: 'License active with NY Department of Buildings.',
    documents: {
      licenseDoc: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      certDoc: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      idDoc: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
    }
  },
  {
    _id: 'tech-profile-2',
    user: INITIAL_USERS[5],
    company: 'Apex Vertical Systems LLC',
    experience: 12,
    rating: 4.9,
    ratingCount: 54,
    licenseNumber: 'NY-ELEV-81203',
    skills: ['High-Rise Elevators', 'Modernization', 'Microprocessor Controllers', 'Escalators', 'Variable Frequency Drives'],
    certifications: ['Master Elevator Mechanic License', 'KONE Certified Specialist', 'CET National'],
    serviceRadius: 40,
    location: {
      address: 'SoHo, New York, NY',
      lat: 40.7240,
      lng: -73.9980
    },
    availability: true,
    completedJobs: 68,
    earnings: 28400,
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Master mechanic credential verified.',
    documents: {
      licenseDoc: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      certDoc: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
    }
  },
  {
    _id: 'tech-profile-4',
    user: INITIAL_USERS[6],
    company: 'Metro Escalator Techs',
    experience: 9,
    rating: 4.9,
    ratingCount: 41,
    licenseNumber: 'NY-ESCL-66512',
    skills: ['Heavy Escalators', 'Step Chains', 'Comb Plates', 'Balustrades', 'Handrail Friction Drives'],
    certifications: ['Escalator Master Technician', 'Schindler Escalator Specialist'],
    serviceRadius: 30,
    location: {
      address: 'Financial District, New York, NY',
      lat: 40.7090,
      lng: -74.0150
    },
    availability: false,
    completedJobs: 51,
    earnings: 22500,
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Escalator master certificate confirmed.',
    documents: {
      licenseDoc: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
    }
  },
  {
    _id: 'tech-profile-9',
    user: INITIAL_USERS[7],
    company: 'NextGen Vertical Mobility Inc.',
    experience: 2,
    rating: 4.4,
    ratingCount: 6,
    licenseNumber: 'NY-ELEV-11902',
    skills: ['Passenger Elevators', 'Basic Electrical', 'Preventive Maintenance'],
    certifications: ['Junior Elevator Technician'],
    serviceRadius: 25,
    location: {
      address: 'Hell’s Kitchen, New York, NY',
      lat: 40.7600,
      lng: -73.9850
    },
    availability: true,
    completedJobs: 3,
    earnings: 1200,
    verificationStatus: 'PENDING',
    verificationNotes: 'Awaiting primary ID proof and state inspector endorsement.',
    documents: {
      licenseDoc: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
    }
  }
];

const INITIAL_PROPERTIES = [
  {
    _id: 'prop-1',
    name: 'Empire Vantage Tower',
    propertyManager: INITIAL_USERS[1], // Sarah Chen
    address: '350 5th Avenue',
    city: 'New York',
    state: 'NY',
    postalCode: '10118',
    coordinates: { lat: 40.7484, lng: -73.9857 },
    buildingType: 'Commercial Office',
    totalFloors: 45,
    contactPhone: '+1 (212) 736-3100',
    contactEmail: 'operations@empirevantage.com',
    imageUrl: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-01-20T00:00:00.000Z'
  },
  {
    _id: 'prop-2',
    name: 'Hudson Horizon Plaza',
    propertyManager: INITIAL_USERS[1], // Sarah Chen
    address: '500 West 33rd Street, Hudson Yards',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    coordinates: { lat: 40.7538, lng: -74.0022 },
    buildingType: 'Commercial Office',
    totalFloors: 38,
    contactPhone: '+1 (212) 880-9200',
    contactEmail: 'facility@hudsonhorizon.com',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-01-22T00:00:00.000Z'
  },
  {
    _id: 'prop-3',
    name: 'Wall Street Financial Center',
    propertyManager: INITIAL_USERS[2], // David Miller
    address: '60 Wall Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10005',
    coordinates: { lat: 40.7075, lng: -74.0090 },
    buildingType: 'Commercial Office',
    totalFloors: 52,
    contactPhone: '+1 (212) 490-1122',
    contactEmail: 'engineering@wallstreetcenter.com',
    imageUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-01-25T00:00:00.000Z'
  },
  {
    _id: 'prop-4',
    name: 'Grand Central Galleria & Atrium',
    propertyManager: INITIAL_USERS[2], // David Miller
    address: '89 East 42nd Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10017',
    coordinates: { lat: 40.7527, lng: -73.9772 },
    buildingType: 'Retail Mall',
    totalFloors: 18,
    contactPhone: '+1 (212) 682-4400',
    contactEmail: 'management@gcgalleria.com',
    imageUrl: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01T00:00:00.000Z'
  },
  {
    _id: 'prop-5',
    name: 'Liberty Medical Pavilion',
    propertyManager: INITIAL_USERS[3], // Elena Rostova
    address: '175 North End Avenue, Battery Park',
    city: 'New York',
    state: 'NY',
    postalCode: '10282',
    coordinates: { lat: 40.7126, lng: -74.0158 },
    buildingType: 'Hospital / Medical',
    totalFloors: 24,
    contactPhone: '+1 (212) 587-9900',
    contactEmail: 'facilities@libertymedical.org',
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-02-05T00:00:00.000Z'
  }
];

const INITIAL_EQUIPMENT = [
  {
    _id: 'eq-1',
    equipmentId: 'ELEV-EMP-01',
    property: INITIAL_PROPERTIES[0],
    type: 'Elevator',
    subType: 'High-Rise Passenger Traction',
    manufacturer: 'Otis',
    model: 'SkyRise High-Speed',
    serialNumber: 'OT-SR-2020-001',
    capacity: '2000 kg / 26 Persons',
    floorsServed: '1-45 (Express)',
    installationDate: '2020-03-12',
    lastMaintenanceDate: '2026-08-15',
    nextMaintenanceDate: '2026-11-15',
    status: 'Operational'
  },
  {
    _id: 'eq-2',
    equipmentId: 'ELEV-EMP-02',
    property: INITIAL_PROPERTIES[0],
    type: 'Elevator',
    subType: 'High-Rise Passenger Traction',
    manufacturer: 'Otis',
    model: 'SkyRise High-Speed',
    serialNumber: 'OT-SR-2020-002',
    capacity: '2000 kg / 26 Persons',
    floorsServed: '1-45 (Express)',
    installationDate: '2020-03-12',
    lastMaintenanceDate: '2026-09-02',
    nextMaintenanceDate: '2026-12-02',
    status: 'Operational'
  },
  {
    _id: 'eq-3',
    equipmentId: 'ELEV-EMP-03',
    property: INITIAL_PROPERTIES[0],
    type: 'Elevator',
    subType: 'Heavy Freight Elevator',
    manufacturer: 'Schindler',
    model: 'Schindler 7000 Freight',
    serialNumber: 'SCH-FR-2019-89',
    capacity: '4500 kg / Heavy Load',
    floorsServed: 'Basement 2 to 45',
    installationDate: '2019-11-20',
    lastMaintenanceDate: '2026-07-10',
    nextMaintenanceDate: '2026-10-10',
    status: 'Maintenance Due'
  },
  {
    _id: 'eq-4',
    equipmentId: 'ESCL-EMP-01',
    property: INITIAL_PROPERTIES[0],
    type: 'Escalator',
    subType: 'Commercial Step-Type',
    manufacturer: 'KONE',
    model: 'TravelMaster 110',
    serialNumber: 'KNE-TM-2020-11',
    capacity: '9,000 Persons / hr',
    floorsServed: 'Concourse to Ground Lobby',
    installationDate: '2020-04-05',
    lastMaintenanceDate: '2026-08-25',
    nextMaintenanceDate: '2026-11-25',
    status: 'Operational'
  },
  {
    _id: 'eq-5',
    equipmentId: 'ELEV-HUD-01',
    property: INITIAL_PROPERTIES[1],
    type: 'Elevator',
    subType: 'Panoramic Glass Elevator',
    manufacturer: 'Schindler',
    model: 'Schindler 5500 Panoramic',
    serialNumber: 'SCH-55-2022-441',
    capacity: '1600 kg / 21 Persons',
    floorsServed: 'Atrium L1 to Sky Garden L38',
    installationDate: '2022-02-14',
    lastMaintenanceDate: '2026-08-30',
    nextMaintenanceDate: '2026-11-30',
    status: 'Operational'
  },
  {
    _id: 'eq-6',
    equipmentId: 'ELEV-HUD-02',
    property: INITIAL_PROPERTIES[1],
    type: 'Elevator',
    subType: 'Passenger Traction',
    manufacturer: 'TK Elevator',
    model: 'momentum High-Rise',
    serialNumber: 'TKE-MM-2021-903',
    capacity: '1800 kg / 24 Persons',
    floorsServed: '1-38',
    installationDate: '2021-08-20',
    lastMaintenanceDate: '2026-09-14',
    nextMaintenanceDate: '2026-12-14',
    status: 'Under Maintenance'
  },
  {
    _id: 'eq-7',
    equipmentId: 'ESCL-HUD-01',
    property: INITIAL_PROPERTIES[1],
    type: 'Escalator',
    subType: 'Heavy Commercial Escalator',
    manufacturer: 'Schindler',
    model: 'Schindler 9300',
    serialNumber: 'SCH-93-2021-701',
    capacity: '7,500 Persons / hr',
    floorsServed: 'Ground to Level 2 Mezzanine',
    installationDate: '2021-06-10',
    lastMaintenanceDate: '2026-08-01',
    nextMaintenanceDate: '2026-11-01',
    status: 'Breakdown'
  },
  {
    _id: 'eq-8',
    equipmentId: 'ELEV-WSF-01',
    property: INITIAL_PROPERTIES[2],
    type: 'Elevator',
    subType: 'Destination Dispatch Traction',
    manufacturer: 'Otis',
    model: 'CompassPlus SkyRise',
    serialNumber: 'OT-CP-2018-091',
    capacity: '2200 kg / 29 Persons',
    floorsServed: '1-52 Bank A',
    installationDate: '2018-06-15',
    lastMaintenanceDate: '2026-09-05',
    nextMaintenanceDate: '2026-12-05',
    status: 'Operational'
  },
  {
    _id: 'eq-9',
    equipmentId: 'ELEV-LIB-01',
    property: INITIAL_PROPERTIES[4],
    type: 'Elevator',
    subType: 'Hospital Gurney & Bed Lift',
    manufacturer: 'KONE',
    model: 'MonoSpace 700 Medical',
    serialNumber: 'KNE-MED-2023-01',
    capacity: '2500 kg / Dual Stretcher',
    floorsServed: 'Emergency ER to Trauma ICU L1-24',
    installationDate: '2023-04-10',
    lastMaintenanceDate: '2026-09-10',
    nextMaintenanceDate: '2026-12-10',
    status: 'Operational'
  }
];

const INITIAL_REQUESTS = [
  {
    _id: 'req-1',
    property: INITIAL_PROPERTIES[1],
    equipment: INITIAL_EQUIPMENT[6], // ESCL-HUD-01 (Breakdown)
    propertyManager: INITIAL_USERS[1],
    assignedTechnician: INITIAL_TECHNICIANS[2], // Sarah Jenkins
    requestType: 'Breakdown',
    priority: 'CRITICAL',
    isEmergency: true,
    etaMinutes: 18,
    description: 'Level 2 Escalator stopped abruptly during peak morning traffic. Error code E-42 on drive control board.',
    status: 'IN_PROGRESS',
    preferredDate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    timeline: [
      { status: 'REQUESTED', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Emergency dispatch triggered by Property Manager', updatedBy: 'Sarah Chen' },
      { status: 'ASSIGNED', timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(), note: 'Dispatched to nearest verified specialist (Metro Escalator Techs)', updatedBy: 'Dispatch System' },
      { status: 'ACCEPTED', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), note: 'Job accepted. En route ETA 18 mins.', updatedBy: 'Sarah Jenkins' },
      { status: 'ARRIVED', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), note: 'Technician on-site. Securing safety stanchions.', updatedBy: 'Sarah Jenkins' },
      { status: 'IN_PROGRESS', timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(), note: 'Diagnosing comb plate microswitch sensors and step band tension.', updatedBy: 'Sarah Jenkins' }
    ]
  },
  {
    _id: 'req-2',
    property: INITIAL_PROPERTIES[1],
    equipment: INITIAL_EQUIPMENT[5], // ELEV-HUD-02
    propertyManager: INITIAL_USERS[1],
    assignedTechnician: INITIAL_TECHNICIANS[1], // Carlos Ramirez
    requestType: 'Preventive Maintenance',
    priority: 'HIGH',
    isEmergency: false,
    description: 'Vibration observed at floors 28-34 during descent. Guide shoe roller bearings inspection required.',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    timeline: [
      { status: 'REQUESTED', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Created by Property Manager', updatedBy: 'Sarah Chen' },
      { status: 'ASSIGNED', timestamp: new Date(Date.now() - 86400000 * 0.9).toISOString(), note: 'Assigned to Apex Vertical Systems', updatedBy: 'Sarah Chen' },
      { status: 'ACCEPTED', timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString(), note: 'Accepted by Carlos Ramirez', updatedBy: 'Carlos Ramirez' },
      { status: 'IN_PROGRESS', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), note: 'Replacing worn polyurethane roller guides in hoistway.', updatedBy: 'Carlos Ramirez' }
    ]
  },
  {
    _id: 'req-3',
    property: INITIAL_PROPERTIES[0],
    equipment: INITIAL_EQUIPMENT[2], // ELEV-EMP-03
    propertyManager: INITIAL_USERS[1],
    assignedTechnician: INITIAL_TECHNICIANS[0], // Raj Patel
    requestType: 'Routine Maintenance',
    priority: 'MEDIUM',
    isEmergency: false,
    description: 'Quarterly routine servicing for freight hoist motor and counterweight buffering system.',
    status: 'ACCEPTED',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    timeline: [
      { status: 'REQUESTED', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Routine service ticket opened', updatedBy: 'Sarah Chen' },
      { status: 'ASSIGNED', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), note: 'Dispatched to Raj Patel', updatedBy: 'Sarah Chen' },
      { status: 'ACCEPTED', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Accepted. Scheduled inspection for tomorrow.', updatedBy: 'Raj Patel' }
    ]
  },
  {
    _id: 'req-4',
    property: INITIAL_PROPERTIES[0],
    equipment: INITIAL_EQUIPMENT[0], // ELEV-EMP-01
    propertyManager: INITIAL_USERS[1],
    assignedTechnician: INITIAL_TECHNICIANS[0], // Raj Patel
    requestType: 'Inspection',
    priority: 'LOW',
    isEmergency: false,
    description: 'Annual safety certificate inspection & load drop testing.',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    timeline: [
      { status: 'REQUESTED', timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), note: 'Scheduled annual test', updatedBy: 'Sarah Chen' },
      { status: 'ASSIGNED', timestamp: new Date(Date.now() - 86400000 * 6.8).toISOString(), note: 'Assigned to Raj Patel', updatedBy: 'Sarah Chen' },
      { status: 'ACCEPTED', timestamp: new Date(Date.now() - 86400000 * 6.5).toISOString(), note: 'Accepted', updatedBy: 'Raj Patel' },
      { status: 'ARRIVED', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), note: 'On site', updatedBy: 'Raj Patel' },
      { status: 'IN_PROGRESS', timestamp: new Date(Date.now() - 86400000 * 4.5).toISOString(), note: 'Testing governor & car safeties', updatedBy: 'Raj Patel' },
      { status: 'COMPLETED', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), note: 'Full inspection passed. Report filed.', updatedBy: 'Raj Patel' }
    ]
  }
];

const INITIAL_REPORTS = [
  {
    _id: 'rep-1',
    maintenanceRequest: INITIAL_REQUESTS[3],
    technician: INITIAL_TECHNICIANS[0],
    property: INITIAL_PROPERTIES[0],
    equipment: INITIAL_EQUIPMENT[0],
    inspectionDetails: 'All hoistway mechanical interlocks, governor cable tensions, car roller shoes, and emergency brake calipers examined according to ASME A17.1 protocols.',
    problemIdentified: 'Minor play in secondary door operator belt; otherwise operational within factory tolerances.',
    workPerformed: 'Calibrated door operator belt tension, lubricated car guide rails with ISO VG 68 oil, completed high-speed full-load arrest test.',
    partsReplaced: ['Otis Door Interlock Spring Assembly (Part #OT-4421)', 'Polyurethane Guide Shoe Inserts (Set of 4)'],
    totalCost: 1250,
    beforeImages: ['https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&auto=format&fit=crop&q=80'],
    afterImages: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'],
    technicianSignature: 'Raj Patel, CET Lic #94821',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    _id: 'notif-1',
    recipient: INITIAL_USERS[1]._id, // Sarah Chen
    title: 'Emergency Dispatch Active',
    message: 'Sarah Jenkins is en route to Hudson Horizon Plaza for Escalator ESCL-HUD-01 (ETA ~18 mins).',
    type: 'EMERGENCY',
    read: false,
    link: '/property-manager/requests/req-1',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    _id: 'notif-2',
    recipient: INITIAL_USERS[1]._id,
    title: 'Work Order Accepted',
    message: 'Raj Patel accepted routine servicing for ELEV-EMP-03 at Empire Vantage Tower.',
    type: 'INFO',
    read: false,
    link: '/property-manager/requests/req-3',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    _id: 'notif-3',
    recipient: INITIAL_USERS[0]._id, // Admin
    title: 'Technician Verification Pending',
    message: 'Zack Taylor (NextGen Vertical Mobility) submitted credentials for verification.',
    type: 'VERIFICATION',
    read: false,
    link: '/admin/verifications',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// Helper to get or initialize database
function getDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[MockDB] Parse error, re-seeding:', err);
  }

  const seeded = {
    users: INITIAL_USERS,
    technicians: INITIAL_TECHNICIANS,
    properties: INITIAL_PROPERTIES,
    equipment: INITIAL_EQUIPMENT,
    requests: INITIAL_REQUESTS,
    reports: INITIAL_REPORTS,
    notifications: INITIAL_NOTIFICATIONS
  };

  saveDB(seeded);
  return seeded;
}

function saveDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('[MockDB] Save error:', err);
  }
}

// Generate unique ID
function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}

// Compute property stats dynamically
function enrichProperty(prop, db) {
  const equip = db.equipment.filter((e) => (typeof e.property === 'object' ? e.property?._id : e.property) === prop._id);
  const elevators = equip.filter((e) => e.type === 'Elevator').length;
  const escalators = equip.filter((e) => e.type === 'Escalator' || e.type === 'Moving Walk').length;
  const activeRequests = db.requests.filter(
    (r) => (typeof r.property === 'object' ? r.property?._id : r.property) === prop._id && !['COMPLETED', 'APPROVED', 'CLOSED'].includes(r.status)
  ).length;

  return {
    ...prop,
    stats: {
      totalEquipment: equip.length,
      elevators,
      escalators,
      activeRequests
    }
  };
}

// Dynamic Analytics Calculator for Admin Dashboard
function computeAnalytics(db) {
  const totalUsers = db.users.length;
  const propertyManagersCount = db.users.filter((u) => u.role === 'PROPERTY_MANAGER').length;
  const techniciansCount = db.users.filter((u) => u.role === 'TECHNICIAN').length;

  const verifiedTechnicians = db.technicians.filter((t) => t.verificationStatus === 'VERIFIED').length;
  const pendingVerification = db.technicians.filter((t) => t.verificationStatus === 'PENDING').length;
  const rejectedTechnicians = db.technicians.filter((t) => t.verificationStatus === 'REJECTED').length;

  const totalProperties = db.properties.length;
  const totalEquipment = db.equipment.length;
  const elevatorsCount = db.equipment.filter((e) => e.type === 'Elevator').length;
  const escalatorsCount = db.equipment.filter((e) => e.type === 'Escalator').length;
  const movingWalksCount = db.equipment.filter((e) => e.type === 'Moving Walk').length;

  const operationalEquipment = db.equipment.filter((e) => e.status === 'Operational').length;
  const maintenanceDueEquipment = db.equipment.filter((e) => e.status === 'Maintenance Due').length;
  const underMaintenanceEquipment = db.equipment.filter((e) => e.status === 'Under Maintenance').length;
  const breakdownEquipment = db.equipment.filter((e) => e.status === 'Breakdown').length;

  const totalRequests = db.requests.length;
  const activeJobs = db.requests.filter((r) => !['COMPLETED', 'APPROVED', 'CLOSED'].includes(r.status)).length;
  const emergencyJobs = db.requests.filter((r) => r.isEmergency).length;
  const completedJobs = db.requests.filter((r) => ['COMPLETED', 'APPROVED', 'CLOSED'].includes(r.status)).length;

  const totalReports = db.reports.length;
  const pendingReports = db.reports.filter((r) => r.status === 'PENDING_APPROVAL').length;

  const monthlyTrends = [
    { month: 'May', requests: 14, emergencies: 2, completed: 12 },
    { month: 'Jun', requests: 22, emergencies: 4, completed: 19 },
    { month: 'Jul', requests: 18, emergencies: 3, completed: 16 },
    { month: 'Aug', requests: 28, emergencies: 5, completed: 25 },
    { month: 'Sep', requests: 31, emergencies: 6, completed: 28 },
    { month: 'Oct', requests: totalRequests + 18, emergencies: emergencyJobs + 3, completed: completedJobs + 15 }
  ];

  return {
    success: true,
    stats: {
      totalUsers,
      propertyManagersCount,
      techniciansCount,
      verifiedTechnicians,
      pendingVerification,
      rejectedTechnicians,
      totalProperties,
      totalEquipment,
      elevatorsCount,
      escalatorsCount,
      movingWalksCount,
      operationalEquipment,
      maintenanceDueEquipment,
      underMaintenanceEquipment,
      breakdownEquipment,
      totalRequests,
      activeJobs,
      emergencyJobs,
      completedJobs,
      totalReports,
      pendingReports
    },
    charts: {
      requestTypes: [
        { name: 'Breakdown', value: 8 },
        { name: 'Preventive Maintenance', value: 12 },
        { name: 'Routine Maintenance', value: 6 },
        { name: 'Inspection', value: 4 }
      ],
      priorityBreakdown: [
        { name: 'CRITICAL', value: emergencyJobs },
        { name: 'HIGH', value: 5 },
        { name: 'MEDIUM', value: 8 },
        { name: 'LOW', value: 4 }
      ],
      equipmentStatus: [
        { name: 'Operational', count: operationalEquipment },
        { name: 'Maintenance Due', count: maintenanceDueEquipment },
        { name: 'Under Maintenance', count: underMaintenanceEquipment },
        { name: 'Breakdown / Offline', count: breakdownEquipment }
      ],
      monthlyTrends
    }
  };
}

// Router for Mock API calls
export async function handleMockRequest(config) {
  const method = (config.method || 'get').toUpperCase();
  // Strip baseURL or leading host
  let url = config.url || '';
  if (url.startsWith('/api')) url = url.replace('/api', '');
  if (!url.startsWith('/')) url = '/' + url;

  // Split path & query
  const [path, queryString] = url.split('?');
  const params = new URLSearchParams(queryString || '');
  const data = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});

  const db = getDB();

  // Simulated latency
  await new Promise((res) => setTimeout(res, 60));

  // 1. AUTH
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = data;
    const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      return { status: 401, data: { success: false, message: 'Invalid credentials. Demo accounts available above.' } };
    }
    const technician = user.role === 'TECHNICIAN'
      ? db.technicians.find((t) => (typeof t.user === 'object' ? t.user?._id : t.user) === user._id)
      : null;

    const token = `demo-token-${user._id}`;
    return {
      status: 200,
      data: {
        success: true,
        token,
        user,
        technician
      }
    };
  }

  if (path === '/auth/register' && method === 'POST') {
    const newUser = {
      _id: uid('user'),
      name: data.name,
      email: data.email,
      role: data.role || 'PROPERTY_MANAGER',
      phone: data.phone || '',
      companyName: data.companyName || data.company || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);

    let techProfile = null;
    if (newUser.role === 'TECHNICIAN') {
      techProfile = {
        _id: uid('tech'),
        user: newUser,
        company: newUser.companyName || `${newUser.name} Services`,
        experience: data.experience || 3,
        licenseNumber: data.licenseNumber || `LIC-${Math.floor(100000 + Math.random() * 900000)}`,
        skills: data.skills || ['Passenger Elevators', 'Routine Inspection'],
        certifications: ['Junior Elevator Technician'],
        serviceRadius: 25,
        location: { address: 'New York, NY', lat: 40.7128, lng: -74.0060 },
        availability: true,
        completedJobs: 0,
        earnings: 0,
        verificationStatus: 'PENDING',
        verificationNotes: 'Self-registered account awaiting admin review.',
        documents: {}
      };
      db.technicians.push(techProfile);
    }
    saveDB(db);

    const token = `demo-token-${newUser._id}`;
    return {
      status: 201,
      data: {
        success: true,
        token,
        user: newUser,
        technician: techProfile
      }
    };
  }

  if (path === '/auth/me' && method === 'GET') {
    const token = localStorage.getItem('liftcare_token');
    const userId = token?.replace('demo-token-', '');
    const user = db.users.find((u) => u._id === userId) || db.users[1]; // default Sarah Chen
    const technician = user?.role === 'TECHNICIAN'
      ? db.technicians.find((t) => (typeof t.user === 'object' ? t.user?._id : t.user) === user._id)
      : null;

    return {
      status: 200,
      data: { success: true, user, technician }
    };
  }

  if (path === '/auth/profile' && method === 'PUT') {
    const token = localStorage.getItem('liftcare_token');
    const userId = token?.replace('demo-token-', '');
    const idx = db.users.findIndex((u) => u._id === userId);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...data };
      saveDB(db);
      return { status: 200, data: { success: true, user: db.users[idx] } };
    }
    return { status: 404, data: { success: false, message: 'User not found' } };
  }

  // 2. PROPERTIES
  if (path === '/properties' && method === 'GET') {
    const enriched = db.properties.map((p) => enrichProperty(p, db));
    return { status: 200, data: { success: true, count: enriched.length, properties: enriched } };
  }

  if (path === '/properties' && method === 'POST') {
    const newProp = {
      _id: uid('prop'),
      ...data,
      coordinates: data.coordinates || { lat: 40.7128, lng: -74.0060 },
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };
    db.properties.unshift(newProp);
    saveDB(db);
    return { status: 201, data: { success: true, property: enrichProperty(newProp, db) } };
  }

  const propMatch = path.match(/^\/properties\/([^\/]+)$/);
  if (propMatch) {
    const pId = propMatch[1];
    const property = db.properties.find((p) => p._id === pId);
    if (!property) return { status: 404, data: { success: false, message: 'Property not found' } };

    if (method === 'GET') {
      const equip = db.equipment.filter((e) => (typeof e.property === 'object' ? e.property?._id : e.property) === pId);
      const activeRequests = db.requests.filter((r) => (typeof r.property === 'object' ? r.property?._id : r.property) === pId);
      const recentReports = db.reports.filter((r) => (typeof r.property === 'object' ? r.property?._id : r.property) === pId);
      return {
        status: 200,
        data: {
          success: true,
          property: enrichProperty(property, db),
          equipment: equip,
          activeRequests,
          recentReports
        }
      };
    }
    if (method === 'PUT') {
      const idx = db.properties.findIndex((p) => p._id === pId);
      db.properties[idx] = { ...db.properties[idx], ...data };
      saveDB(db);
      return { status: 200, data: { success: true, property: enrichProperty(db.properties[idx], db) } };
    }
  }

  // 3. EQUIPMENT
  if (path === '/equipment' && method === 'GET') {
    let list = [...db.equipment];
    const propId = params.get('propertyId');
    const status = params.get('status');
    const type = params.get('type');

    if (propId) list = list.filter((e) => (typeof e.property === 'object' ? e.property?._id : e.property) === propId);
    if (status) list = list.filter((e) => e.status === status);
    if (type) list = list.filter((e) => e.type === type);

    return { status: 200, data: { success: true, count: list.length, equipment: list } };
  }

  if (path === '/equipment' && method === 'POST') {
    const prop = db.properties.find((p) => p._id === data.property) || db.properties[0];
    const newEq = {
      _id: uid('eq'),
      ...data,
      property: prop,
      status: data.status || 'Operational',
      historyTimeline: [
        {
          date: new Date().toISOString(),
          type: 'Installation',
          title: 'Initial Commissioning',
          description: 'Added to property inventory.',
          performedBy: 'Operations'
        }
      ]
    };
    db.equipment.unshift(newEq);
    saveDB(db);
    return { status: 201, data: { success: true, equipment: newEq } };
  }

  const eqMatch = path.match(/^\/equipment\/([^\/]+)$/);
  if (eqMatch) {
    const eqId = eqMatch[1];
    const eq = db.equipment.find((e) => e._id === eqId);
    if (!eq) return { status: 404, data: { success: false, message: 'Equipment unit not found' } };

    if (method === 'GET') {
      const activeRequests = db.requests.filter((r) => (typeof r.equipment === 'object' ? r.equipment?._id : r.equipment) === eqId);
      const recentReports = db.reports.filter((r) => (typeof r.equipment === 'object' ? r.equipment?._id : r.equipment) === eqId);
      return {
        status: 200,
        data: {
          success: true,
          equipment: eq,
          activeRequests,
          recentReports
        }
      };
    }
    if (method === 'PUT') {
      const idx = db.equipment.findIndex((e) => e._id === eqId);
      db.equipment[idx] = { ...db.equipment[idx], ...data };
      saveDB(db);
      return { status: 200, data: { success: true, equipment: db.equipment[idx] } };
    }
  }

  // 4. TECHNICIANS
  if (path === '/technicians' && method === 'GET') {
    let list = [...db.technicians];
    if (params.get('verifiedOnly') === 'true') {
      list = list.filter((t) => t.verificationStatus === 'VERIFIED');
    }
    return { status: 200, data: { success: true, count: list.length, technicians: list } };
  }

  if (path === '/technicians/me/profile' && method === 'GET') {
    const token = localStorage.getItem('liftcare_token');
    const userId = token?.replace('demo-token-', '');
    const tech = db.technicians.find((t) => (typeof t.user === 'object' ? t.user?._id : t.user) === userId) || db.technicians[0];
    return { status: 200, data: { success: true, technician: tech } };
  }

  if (path === '/technicians/me/profile' && method === 'PUT') {
    const token = localStorage.getItem('liftcare_token');
    const userId = token?.replace('demo-token-', '');
    const idx = db.technicians.findIndex((t) => (typeof t.user === 'object' ? t.user?._id : t.user) === userId);
    if (idx !== -1) {
      db.technicians[idx] = { ...db.technicians[idx], ...data };
      saveDB(db);
      return { status: 200, data: { success: true, technician: db.technicians[idx] } };
    }
    return { status: 200, data: { success: true, technician: db.technicians[0] } };
  }

  const techMatch = path.match(/^\/technicians\/([^\/]+)$/);
  if (techMatch && method === 'GET') {
    const tId = techMatch[1];
    const tech = db.technicians.find((t) => t._id === tId);
    if (!tech) return { status: 404, data: { success: false, message: 'Technician not found' } };
    const completedJobsList = db.requests.filter(
      (r) => (typeof r.assignedTechnician === 'object' ? r.assignedTechnician?._id : r.assignedTechnician) === tId && ['COMPLETED', 'APPROVED'].includes(r.status)
    );
    return { status: 200, data: { success: true, technician: tech, completedJobsList } };
  }

  // 5. MAINTENANCE REQUESTS
  if (path === '/maintenance' && method === 'GET') {
    let list = [...db.requests];
    const status = params.get('status');
    const propId = params.get('propertyId');
    const techId = params.get('technicianId');
    const isEmerg = params.get('isEmergency');

    if (status) list = list.filter((r) => r.status === status);
    if (propId) list = list.filter((r) => (typeof r.property === 'object' ? r.property?._id : r.property) === propId);
    if (techId) list = list.filter((r) => (typeof r.assignedTechnician === 'object' ? r.assignedTechnician?._id : r.assignedTechnician) === techId);
    if (isEmerg === 'true') list = list.filter((r) => r.isEmergency);

    return { status: 200, data: { success: true, count: list.length, requests: list } };
  }

  if (path === '/maintenance' && method === 'POST') {
    const prop = db.properties.find((p) => p._id === data.property) || db.properties[0];
    const eq = db.equipment.find((e) => e._id === data.equipment) || db.equipment[0];
    let tech = null;
    if (data.assignedTechnician) {
      tech = db.technicians.find((t) => t._id === data.assignedTechnician) || null;
    }

    const newReq = {
      _id: uid('req'),
      ...data,
      property: prop,
      equipment: eq,
      assignedTechnician: tech,
      status: tech ? 'ASSIGNED' : 'REQUESTED',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'REQUESTED',
          timestamp: new Date().toISOString(),
          note: data.isEmergency ? 'Emergency dispatch alert generated.' : 'Work request logged.',
          updatedBy: 'Sarah Chen'
        }
      ]
    };

    if (data.isEmergency) {
      // Auto assign nearest tech
      newReq.assignedTechnician = db.technicians[0];
      newReq.status = 'IN_PROGRESS';
      newReq.etaMinutes = 15;
      newReq.timeline.push({
        status: 'ASSIGNED',
        timestamp: new Date().toISOString(),
        note: 'Auto-dispatched to nearest certified specialist (Raj Patel).',
        updatedBy: 'Autonomous Emergency Dispatcher'
      });
      // Mark equipment as Breakdown
      const eqIdx = db.equipment.findIndex((e) => e._id === eq._id);
      if (eqIdx !== -1) {
        db.equipment[eqIdx].status = 'Breakdown';
      }
    }

    db.requests.unshift(newReq);
    saveDB(db);
    return { status: 201, data: { success: true, request: newReq } };
  }

  const reqMatch = path.match(/^\/maintenance\/([^\/]+)$/);
  if (reqMatch) {
    const rId = reqMatch[1];
    const req = db.requests.find((r) => r._id === rId);
    if (!req) return { status: 404, data: { success: false, message: 'Work order request not found' } };

    if (method === 'GET') {
      return { status: 200, data: { success: true, request: req } };
    }
  }

  const reqStatusMatch = path.match(/^\/maintenance\/([^\/]+)\/status$/);
  if (reqStatusMatch && (method === 'PUT' || method === 'PATCH')) {
    const rId = reqStatusMatch[1];
    const idx = db.requests.findIndex((r) => r._id === rId);
    if (idx !== -1) {
      const nextStatus = data.status;
      db.requests[idx].status = nextStatus;
      db.requests[idx].timeline.push({
        status: nextStatus,
        timestamp: new Date().toISOString(),
        note: data.note || `Status progressed to ${nextStatus}`,
        updatedBy: 'Technician'
      });

      if (['COMPLETED', 'APPROVED'].includes(nextStatus)) {
        const eqId = typeof db.requests[idx].equipment === 'object' ? db.requests[idx].equipment?._id : db.requests[idx].equipment;
        const eqIdx = db.equipment.findIndex((e) => e._id === eqId);
        if (eqIdx !== -1) db.equipment[eqIdx].status = 'Operational';
      }

      saveDB(db);
      return { status: 200, data: { success: true, request: db.requests[idx] } };
    }
  }

  const reqAssignMatch = path.match(/^\/maintenance\/([^\/]+)\/assign$/);
  if (reqAssignMatch && method === 'POST') {
    const rId = reqAssignMatch[1];
    const idx = db.requests.findIndex((r) => r._id === rId);
    if (idx !== -1) {
      const tech = db.technicians.find((t) => t._id === data.technicianId);
      db.requests[idx].assignedTechnician = tech;
      db.requests[idx].status = 'ASSIGNED';
      db.requests[idx].timeline.push({
        status: 'ASSIGNED',
        timestamp: new Date().toISOString(),
        note: `Technician assigned: ${tech?.company || 'Verified Specialist'}`,
        updatedBy: 'Property Manager'
      });
      saveDB(db);
      return { status: 200, data: { success: true, request: db.requests[idx] } };
    }
  }

  // 6. SERVICE REPORTS
  if (path === '/service-reports' && method === 'GET') {
    return { status: 200, data: { success: true, count: db.reports.length, reports: db.reports } };
  }

  if (path === '/service-reports' && method === 'POST') {
    const req = db.requests.find((r) => r._id === data.maintenanceRequest) || db.requests[0];
    const newRep = {
      _id: uid('rep'),
      ...data,
      maintenanceRequest: req,
      property: req.property,
      equipment: req.equipment,
      technician: req.assignedTechnician || db.technicians[0],
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString()
    };
    db.reports.unshift(newRep);

    // Advance request to COMPLETED
    const reqIdx = db.requests.findIndex((r) => r._id === req._id);
    if (reqIdx !== -1) {
      db.requests[reqIdx].status = 'COMPLETED';
      db.requests[reqIdx].timeline.push({
        status: 'COMPLETED',
        timestamp: new Date().toISOString(),
        note: 'Service report completed and submitted for review.',
        updatedBy: 'Technician'
      });
    }

    saveDB(db);
    return { status: 201, data: { success: true, report: newRep } };
  }

  const repReqMatch = path.match(/^\/service-reports\/request\/([^\/]+)$/);
  if (repReqMatch && method === 'GET') {
    const rId = repReqMatch[1];
    const rep = db.reports.find((r) => (typeof r.maintenanceRequest === 'object' ? r.maintenanceRequest?._id : r.maintenanceRequest) === rId);
    return { status: 200, data: { success: true, report: rep || null } };
  }

  const repApproveMatch = path.match(/^\/service-reports\/([^\/]+)\/approve$/);
  if (repApproveMatch && (method === 'PATCH' || method === 'PUT')) {
    const repId = repApproveMatch[1];
    const idx = db.reports.findIndex((r) => r._id === repId);
    if (idx !== -1) {
      db.reports[idx].status = 'APPROVED';
      saveDB(db);
      return { status: 200, data: { success: true, report: db.reports[idx] } };
    }
  }

  // 7. ADMIN ENDPOINTS
  if (path === '/admin/analytics' && method === 'GET') {
    return { status: 200, data: computeAnalytics(db) };
  }

  if (path === '/admin/verifications' && method === 'GET') {
    let list = db.technicians.filter((t) => ['PENDING', 'RESUBMISSION_REQUESTED'].includes(t.verificationStatus));
    const status = params.get('status');
    if (status && status !== 'ALL') {
      list = db.technicians.filter((t) => t.verificationStatus === status);
    }
    return { status: 200, data: { success: true, technicians: list } };
  }

  const verifyMatch = path.match(/^\/admin\/verifications\/([^\/]+)$/);
  if (verifyMatch && (method === 'PUT' || method === 'PATCH')) {
    const tId = verifyMatch[1];
    const idx = db.technicians.findIndex((t) => t._id === tId);
    if (idx !== -1) {
      db.technicians[idx].verificationStatus = data.status || 'VERIFIED';
      db.technicians[idx].verificationNotes = data.verificationNotes || '';
      saveDB(db);
      return { status: 200, data: { success: true, technician: db.technicians[idx] } };
    }
  }

  if (path === '/users' && method === 'GET') {
    let list = [...db.users];
    const role = params.get('role');
    const search = params.get('search');
    if (role) list = list.filter((u) => u.role === role);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }
    return { status: 200, data: { success: true, count: list.length, users: list } };
  }

  const toggleUserMatch = path.match(/^\/users\/([^\/]+)\/toggle-status$/);
  if (toggleUserMatch && (method === 'PUT' || method === 'PATCH')) {
    const uId = toggleUserMatch[1];
    const idx = db.users.findIndex((u) => u._id === uId);
    if (idx !== -1) {
      db.users[idx].isActive = !db.users[idx].isActive;
      saveDB(db);
      return { status: 200, data: { success: true, user: db.users[idx] } };
    }
  }

  // 8. NOTIFICATIONS
  if (path === '/notifications' && method === 'GET') {
    return { status: 200, data: { success: true, count: db.notifications.length, notifications: db.notifications } };
  }

  if (path === '/notifications/read-all' && (method === 'PATCH' || method === 'PUT')) {
    db.notifications.forEach((n) => (n.read = true));
    saveDB(db);
    return { status: 200, data: { success: true } };
  }

  const notifReadMatch = path.match(/^\/notifications\/([^\/]+)\/read$/);
  if (notifReadMatch && (method === 'PATCH' || method === 'PUT')) {
    const nId = notifReadMatch[1];
    const notif = db.notifications.find((n) => n._id === nId);
    if (notif) notif.read = true;
    saveDB(db);
    return { status: 200, data: { success: true } };
  }

  // Fallback
  return {
    status: 200,
    data: {
      success: true,
      message: 'Demo action processed successfully.'
    }
  };
}
