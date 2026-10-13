export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  color: "mint" | "peach" | "purple";
  status: string;
  challenge: string;
  approach: string;
  outcome: string;
  liveUrl?: string;
  sourceUrl?: string;
};

export const portfolio = {
  name: "MICHAEL KWEKU KISSI DARKO",
  shortName: "MICHAEL DARKO",
  role: "Software engineer & creative problem solver",
  intro: "Code, curiosity, and a human touch.",
  about: "I’m Michael, a software engineer based in Ghana. I build software systems, automate workflows, and turn data into useful insights. My experience spans Java backends, web development, data analytics, and teaching computer science. This studio is where those interests come together.",
  email: "michael.kk.darko@gmail.com",
  github: "https://github.com/Kimiqo",
  linkedin: "https://www.linkedin.com/in/mkkd-michael-darko/",
  cvUrl: "/michael-darko-cv.pdf",
  skills: ["Java", "Python", "PHP", "Spring Boot", "WordPress", "SQL", "NoSQL", "Power BI", "Data analysis", "Artificial intelligence"],
  education: {
    institution: "Ghana Institute of Management and Public Administration",
    qualification: "BSc Computer Science",
    dates: "February 2023 – July 2026",
    awards: "First Class Honours · GIMPA 2026 Valedictorian · Dean’s Excellence Award",
  },
  experience: [
    { company: "SankofaTech AIT Fellowship", role: "Software Engineering Fellow (National Service)", dates: "October 2026 – October 2027", detail: "Developing software systems and automating workflows for Harlem Independent Living Center, alongside a Ghana-focused capstone project." },
    { company: "MTN Ghana", role: "Data Analytics Intern", dates: "August – October 2026", detail: "Automated data extraction, developed dynamic dashboards, and built Quiz Master for an AI inter-divisional competition." },
    { company: "Anjef International School", role: "Part-time Computer Science Tutor", dates: "January 2024 – June 2026", detail: "Taught practical computer science and prepared students for IGCSE and A-Level examinations." },
    { company: "Ecobank Ghana", role: "Software Engineering Intern", dates: "July – September 2024", detail: "Developed and refactored Java backend code using Spring Boot and NetBeans with senior developers." },
    { company: "Farm Radio International", role: "Software Engineering Intern", dates: "June – July 2024", detail: "Designed a WordPress intranet, configured a LAMP environment on macOS, and tested PHP APIs." },
  ],
  interests: ["Piano", "Soccer", "Field hockey", "Basketball", "Table tennis"],
  certification: "Google AI Fundamentals",
  volunteer: "General Secretary at Harvest American Foundation, supporting communications, coordination, and outreach programmes since March 2026.",
  projects: [
    {
      id: "maxease-manager", number: "01", title: "MaxEase Manager", category: "STUDENT TOOLS",
      description: "A lecture and exam timetable manager for GIMPA students, with campus selection and searchable schedules.",
      tags: ["React", "JavaScript", "Vite"], color: "mint", status: "GIMPA timetable platform",
      challenge: "Make lecture and exam timetables easier for students to find and navigate across GIMPA campuses.",
      approach: "Organised the experience around campus selection, dedicated lecture and exam views, search, and compact timetable components.",
      outcome: "A live timetable manager with access to schedules for Accra, Tema, Kumasi, and Takoradi campuses.",
      liveUrl: "https://max-ease-manager.vercel.app/", sourceUrl: "https://github.com/Kimiqo/MaxEase-Manager",
    },
    {
      id: "ball-n-stick", number: "02", title: "Ball N Stick", category: "SPORT & COMMUNITY",
      description: "A field hockey platform bringing together events, stories, galleries, and community initiatives.",
      tags: ["React", "TypeScript", "Motion"], color: "peach", status: "Hockey & community platform",
      challenge: "Bring hockey development, media, events, and community programmes together in one digital home.",
      approach: "Built a multi-page experience with animated storytelling, event and gallery content, partner profiles, and an administration area.",
      outcome: "A live platform for exploring the Ball N Stick community, its programmes, and ways to get involved.",
      liveUrl: "https://ball-and-stick-xi.vercel.app/", sourceUrl: "https://github.com/Kimiqo/Ball-N-Stick",
    },
    {
      id: "nowcomplaints", number: "03", title: "NowComplaints", category: "STUDENT SERVICES",
      description: "A student complaints management system for submitting concerns and tracking them in one place.",
      tags: ["React", "Vite", "Student services"], color: "purple", status: "Student complaints management",
      challenge: "Give student complaints a dedicated place in a web-based system.",
      approach: "Created student complaint submission and tracking views, with dedicated administration areas for reviewing complaints and department requests.",
      outcome: "The application is available at nowcomplaints.site. Explore the live site for its current experience.",
      liveUrl: "https://www.nowcomplaints.site/",
    },
    {
      id: "efd-services", number: "04", title: "EFD Services", category: "BUSINESS & COMMERCE",
      description: "A digital storefront for embroidery and design services, with a gallery, shop, and custom-order experience.",
      tags: ["React", "TypeScript", "Vite"], color: "mint", status: "Embroidery & design website",
      challenge: "Give an embroidery and design business a clear online presence for showcasing work and welcoming enquiries.",
      approach: "Developed service and company pages alongside a product gallery, shop, custom-order page, and content administration tools.",
      outcome: "A live business website connecting visitors with EFD Services and its embroidery and design work.",
      liveUrl: "https://efdservicescom.vercel.app/", sourceUrl: "https://github.com/Kimiqo/EFDServices.com",
    },
  ] as Project[],
};
