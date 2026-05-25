// Initial static data for Shark Cleaning LLC Onboarding Platform

export const DEFAULT_TRACKS = [
  {
    id: "technician",
    title: "Technician Training Track",
    role: "technician",
    description: "Master the skills, safety procedures, and high-quality window cleaning standards to become a certified Shark Cleaning technician.",
    modules: [
      {
        id: "tech-welcome",
        title: "1. Welcome to the Shark Pack",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/zpOULjyy-n8", // High quality general welcome placeholder
        duration: "3:45",
        description: "Meet the team, learn our core mission of providing pristine views, and understand the expectations of a professional Shark technician."
      },
      {
        id: "tech-equipment",
        title: "2. Cleaning Equipment Deep Dive",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/2_N1d2-085I", // Window cleaning tools video
        duration: "8:12",
        description: "A complete overview of our professional gear: squeegees, scrubbers, water-fed poles, extension ladders, detailing towels, and eco-friendly solutions.",
        extraContent: {
          equipmentList: [
            { name: "Squeegee Brass/Aluminium Channel", desc: "For flawless, streak-free water removal. Clean rubber daily." },
            { name: "T-Bar & Microfiber Scrubber Sleeve", desc: "For applying cleaning solution and loosening dirt/grime." },
            { name: "Water-Fed Pole (Pure Water System)", desc: "Deionizing filtration system for scrubbing exterior glass up to 4 stories safely from the ground." },
            { name: "Scrapers & Bronze Wool", desc: "For removing paint overspray, bird droppings, and stubborn sap without scratching tempered glass." },
            { name: "Grade-A Microfiber Detailing Towels", desc: "Surgical towels used strictly for wiping the window borders and frame sills." }
          ]
        }
      },
      {
        id: "tech-process",
        title: "3. Step-by-Step Window Cleaning Process",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/jZ_y19nE4C0", // Pro window cleaning technique
        duration: "12:30",
        description: "Learn the standard 'S-Technique' and 'Straight Pulls' for absolute efficiency. Covers interior detailing, screen washing, and sill cleaning.",
        extraContent: {
          steps: [
            { step: "1. Assess & Prep", detail: "Remove window screens, inspect glass for damage, and place drop cloths under interior windows." },
            { step: "2. Scrub Glass", detail: "Apply cleaning solution using a wet scrubber sleeve, ensuring every corner is thoroughly washed." },
            { step: "3. Squeegee Pull", detail: "Use the S-stroke technique on wide glass, or straight pulls for narrow sills. Angle squeegee to direct water downward." },
            { step: "4. Detail Borders", detail: "Dry the top, sides, and bottom edge with a dry microfiber surgical towel. Wipe sills clean." },
            { step: "5. Screen & Track Clean", detail: "Wash the screens with our screen washer, wipe the tracks free of dust and debris, and re-install." }
          ]
        }
      },
      {
        id: "tech-safety",
        title: "4. Safety Hazards & Ladder Protection",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/XqC94qO1J0c", // Ladder safety video
        duration: "7:45",
        description: "Safety is our absolute priority. Master the 4-to-1 ladder ratio, secure footing, working around power lines, and wasp nest caution.",
        extraContent: {
          hazards: [
            { hazard: "Unstable Ground / Slip Hazards", correction: "Always check ladder levelers. Place ladder feet on firm, dry ground. Never stand on the top three rungs." },
            { hazard: "Power Lines & Overhead Cables", correction: "Maintain a minimum distance of 10 feet. Use carbon fiber poles or wood/fiberglass ladders near electric hazards." },
            { hazard: "Chemical Safety", correction: "Keep cleaning concentrates out of direct sunlight. Use safety goggles when mixing solutions." },
            { hazard: "Tempered Glass Scratches", correction: "Never scrape dry glass. Use bronze wool or a brand new scraper blade at a 30-degree angle with plenty of lubricant." }
          ]
        }
      },
      {
        id: "tech-payment",
        title: "5. Running the Job Site & Payment Processes",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/u1V8tZk7Ysw", // Mobile payment systems
        duration: "6:15",
        description: "How to interact with homeowners, perform pre-walks and post-walks, collect payments on your mobile tablet, and secure five-star Google reviews."
      },
      {
        id: "tech-contractor-guide",
        title: "6. 1099 Independent Contractor Guide & Tax Tips",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/mG9o9mXGv5I", // 1099 tax tips
        duration: "9:20",
        description: "Understand your relationship as a 1099 partner. Learn how to track write-offs (mileage, cell phone, gear), save for quarterly taxes, and maximize profit.",
        extraContent: {
          tips: [
            { title: "Quarterly Taxes", text: "We recommend setting aside 25-30% of your earnings in a separate savings account for tax season." },
            { title: "Mileage Tracking", text: "Keep a daily log of miles driven between job sites. This is a massive tax write-off." },
            { title: "Equipment Deductions", text: "Any tools, safety gear, or uniforms you purchase are tax-deductible." }
          ]
        }
      },
      {
        id: "tech-manual",
        title: "7. Technician Onboarding Manual",
        type: "manual",
        description: "Carefully read through the complete Shark Cleaning LLC Operational Handbook. You will be required to scroll to the bottom and confirm receipt.",
        extraContent: {
          title: "Shark Cleaning LLC - Technician Operations Manual",
          sections: [
            {
              heading: "1. Core Conduct Standards",
              text: "All contractors representing Shark Cleaning LLC must maintain the highest standards of integrity and presentation. Clean uniforms (Shark branded t-shirts, dark shorts/pants, clean athletic shoes) must be worn at all times. Smoking, vaping, or using foul language on customer property is strictly prohibited."
            },
            {
              heading: "2. The Shark Cleaning Guarantee",
              text: "We offer a 100% satisfaction guarantee. If a client finds streaks, smudges, or misses within 48 hours of service, we will return to fix it free of charge. Ensuring absolute detail and conducting a customer walk-through at completion prevents callbacks and maximizes tips."
            },
            {
              heading: "3. Property Protection Procedures",
              text: "Always respect customer property. Remove shoes or wear clean shoe covers (booties) before walking inside. Move fragile items away from window sills before starting. Wipe up any water drips on hardwood floors or carpets immediately. Never drag heavy equipment or ladders across manicured turf or landscaping."
            },
            {
              heading: "4. Independent Contractor Relationship",
              text: "As a 1099 Independent Contractor, you control your own methods, hours, and helper hire. You are responsible for your own liability insurance, health care, and federal/state/local tax obligations. Shark Cleaning LLC will issue a 1099-NEC at the end of each fiscal year for all earnings exceeding $600."
            }
          ]
        }
      },
      {
        id: "tech-agreement",
        title: "8. Contractor Agreement & Sign-off",
        type: "agreement",
        description: "Confirm you have watched all training modules, read the manual, and agree to follow Shark Cleaning's quality standards, safety protocols, and 1099 agreements.",
        extraContent: {
          agreementText: "By signing below, I certify that I have watched all training modules in full, read and understood the Operations Manual, and agree to represent Shark Cleaning LLC with the utmost safety, professionalism, and quality standard. I acknowledge my status as an independent 1099 contractor responsible for my own taxes, equipment maintenance, and personal safety."
        }
      }
    ]
  },
  {
    id: "sales",
    title: "Door-to-Door Sales Track",
    role: "sales",
    description: "Learn the psychology of direct residential sales, master the Shark sales script, and track your metrics to dominate the neighborhood routes.",
    modules: [
      {
        id: "sales-welcome",
        title: "1. Welcome to the Sales Pack",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/zpOULjyy-n8", // Welcome
        duration: "4:10",
        description: "Welcome to the elite Shark D2D sales division. Learn how our sales reps make excellent commissions by unlocking the power of neighborhood clean sweeps."
      },
      {
        id: "sales-pitch",
        title: "2. The Ultimate Door-to-Door Sales Script",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/U3f5yWqfT5I", // D2D sales script tutorial
        duration: "11:45",
        description: "Step-by-step breakdown of the Hook, the Story, the Pricing, and the Close. Learn how to overcome common objections like 'I do it myself' or 'Too expensive.'",
        extraContent: {
          scriptStages: [
            { stage: "1. The Hook", detail: "Hi, I'm [Name] with Shark Cleaning! We're doing a neighborhood clean sweep over on [Street Name] today. I noticed you guys had a bit of pollen buildup on the upper sills..." },
            { stage: "2. The Story", detail: "We are washing screens, cleaning the tracks, and bringing the glass back to crystal clear. Since our trucks and crew are already parked right here, we are doing it for a fraction of the regular price today." },
            { stage: "3. The Value Close", detail: "Normally a home this size runs about $349, but since we are already doing your next-door neighbor, I can get your full home, screens included, taken care of today for just $199." }
          ]
        }
      },
      {
        id: "sales-pricing",
        title: "3. Estimating, Packages, & Payment Setup",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/a-W2pLpQYdY", // Estimating cleaning jobs
        duration: "8:30",
        description: "How to estimate a house instantly by counting window panes. Master our package structure (Silver, Gold, Platinum) and learn how to collect card details to book the job."
      },
      {
        id: "sales-contractor-tips",
        title: "4. 1099 Sales Guide & Commission Maximizer",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/mG9o9mXGv5I", // 1099 tax tips
        duration: "9:20",
        description: "How 1099 commissions work. Track writing off gas, tablet expenses, branding uniforms, and setting up an LLC to optimize your earnings.",
        extraContent: {
          tips: [
            { title: "Tax Write-offs", text: "Every dollar spent on gas, iPad, clothing, and meals with clients can be deducted from your taxable income." },
            { title: "Commission Savings", text: "Save at least 25% of your commission checks for self-employment tax filings." }
          ]
        }
      },
      {
        id: "sales-manual",
        title: "5. Sales Representative Manual",
        type: "manual",
        description: "Read the Shark Cleaning D2D Code of Conduct, neighborhood mapping guidelines, and customer relations standard.",
        extraContent: {
          title: "Shark Cleaning LLC - Sales Representative Operations Manual",
          sections: [
            {
              heading: "1. Respectful Soliciting",
              text: "Shark Cleaning LLC respects local laws. If a neighborhood is strictly marked with 'No Soliciting' signs, check with local ordinances first. Always speak with absolute politeness, stand 6 feet back from the door after knocking, and leave immediately if the homeowner is not interested."
            },
            {
              heading: "2. Ethical Quoting Standards",
              text: "Never over-promise on cleaning capabilities. If a window has hard-water mineral damage or paint scaling, explain to the homeowner that restoration requires separate chemical treatments. Quote accurately and never quote a job lower than our minimum price guide without approval."
            },
            {
              heading: "3. Direct Sales 1099 Agreement",
              text: "Your compensation is entirely commission-based as a 1099 independent contractor. High earners build their routes, upsell packages, and generate referrals to boost their income. You are solely responsible for your sales equipment, transit, and taxes."
            }
          ]
        }
      },
      {
        id: "sales-agreement",
        title: "6. Contractor Agreement & Sign-off",
        type: "agreement",
        description: "Confirm you have watched all training modules, read the D2D handbook, and agree to the sales guidelines and commission payout structure.",
        extraContent: {
          agreementText: "By signing below, I certify that I have watched all D2D sales modules, read the Sales Representative Operations Manual, and agree to practice ethical, professional sales methods. I acknowledge my status as an independent 1099 sales contractor."
        }
      },
      {
        id: "sales-tracking",
        title: "7. Active D2D Sales Tracker Dashboard",
        type: "sales-tracking",
        description: "Use this live tracking dashboard daily to log your doors knocked, leads created, and closed cleaning sales. Let's start tracking your success!",
        extraContent: {}
      }
    ]
  }
];

export const INITIAL_USER_PROGRESS = {
  completedModules: [], // e.g. ["tech-welcome"]
  completedTimes: {}, // moduleID -> timestamp
  isFullyCompleted: false,
  signedName: "",
  signedDate: "",
  signedIp: ""
};

export const INITIAL_SALES_LOGS = [
  { date: "2026-05-20", doors: 45, pitches: 20, leads: 8, closed: 3, revenue: 650 },
  { date: "2026-05-21", doors: 50, pitches: 25, leads: 10, closed: 4, revenue: 900 },
  { date: "2026-05-22", doors: 60, pitches: 30, leads: 12, closed: 5, revenue: 1150 },
  { date: "2026-05-23", doors: 40, pitches: 18, leads: 6, closed: 2, revenue: 400 },
  { date: "2026-05-24", doors: 55, pitches: 28, leads: 11, closed: 4, revenue: 850 }
];
