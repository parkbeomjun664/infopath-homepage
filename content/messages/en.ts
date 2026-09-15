import type { Messages } from './ko';

/**
 * 영문 메시지
 * ko.ts와 구조가 다르면 타입 에러가 납니다 — 키 누락을 컴파일 단계에서 잡습니다.
 * [draft] 표기는 회사 확인 전 임시 카피입니다.
 */

const en: Messages = {
  meta: {
    siteName: 'INFOPATH',
    titleDefault: 'INFOPATH — Smart Factory MES',
    titleTemplate: '%s | INFOPATH',
    description:
      'INFOPATH lowers the cost of smart factory adoption with INFOLINK, a proven MES platform linking all eight stages from order intake to close.',
  },

  nav: {
    home: 'Home',
    infolink: 'INFOLINK',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    menu: 'Menu',
    close: 'Close',
    language: 'Select language',
    skipToContent: 'Skip to content',
  },

  common: {
    inquire: 'Get in touch',
    learnMore: 'Learn more',
    viewSolution: 'View INFOLINK',
    goHome: 'Back to home',
    required: 'Required',
    optional: 'Optional',
  },

  hero: {
    sloganEn: 'Start Small, Run Smart',
    productShotAlt: 'An INFOLINK screen in day-to-day use',

    slides: {
      primary: {
        alt: 'An industrial robot arm in a white exhibition space',
      },
      layered: {
        headline: 'You do not have to\nchange it all at once',
        highlight: 'change it all at once',
        sub: 'Begin with production output, quality or inventory — whichever is most urgent — and widen while running.',
        alt: 'A 3D render of translucent panels stacked in layers with data flowing into them',
      },
      connect: {
        headline: 'From order to close,\nnothing breaks.',
        highlight: 'nothing breaks.',
        sub: 'A stage opens only when the one before it is done. That constraint is what enforces quality.',
        alt: 'Production line with connected conveyors',
      },
    },
    variants: {
      a: {
        headline: 'MES starts with order,\nnot with budget.',
        highlight: 'not with budget.',
        sub: 'Start on a platform that already works, with what you actually need first.',
      },
    },
    ctaPrimary: 'Talk to us',
    ctaSecondary: 'Explore INFOLINK',
    slideNav: 'Choose a hero slide',
    scrollHint: 'Scroll down',
  },

  statsBand: {
    caption: 'What INFOPATH already has',
    captionSub: 'Measured on INFOLINK, our own MES platform',
    items: [
      { id: 'flow', value: '8', name: 'stages, order intake to close' },
      { id: 'modules', value: '11', name: 'business modules' },
      { id: 'screens', value: '128', name: 'work screens' },
    ],
  },



  approach: {
    label: 'WHY INFOPATH',
    heading: 'What makes INFOPATH different',
    lead: 'You already know you need a smart factory. The problem is always what comes next. Owning the MES platform changes that point.',
    items: [
      {
        id: 'cost',
        no: '01',
        wall: 'The cost wall',
        problem: 'The quote comes back outside the budget',
        problemBody: 'You need part of it now, but the quote is for building all of it.',
        answer: 'Pay only for what you need',
        answerBody: 'You start on a platform where all eight stages are already built, so requirements and development are not repeated from scratch. Begin with one urgent module and that is what it costs.',
      },
      {
        id: 'time',
        no: '02',
        wall: 'The time wall',
        problem: 'A year to deploy, and the floor stays as it is',
        problemBody: 'While requirements are defined and validated, improvement stands still.',
        answer: 'Start using it without waiting',
        answerBody: 'You do not cover every process at once. Put one urgent module into service first, then widen as you use it.',
      },
      {
        id: 'fit',
        no: '03',
        wall: 'The fit wall',
        problem: 'They say it has to be rebuilt to match our process',
        problemBody: 'Every plant runs differently, and a standard package cannot hold that difference.',
        answer: 'Configured on screen, not developed',
        answerBody: 'Items, BOMs, inspection criteria, warehouses and permissions are registered on screen. Nothing is re-coded, so a change in your process does not wait on a development schedule.',
      },
    ],
  },

  buildProcess: {
    label: 'HOW WE WORK',
    heading: 'How a project runs',
    lead: 'The order we work in from contract to live operation, and who does what at each step.',
    owner: {
      infopath: 'INFOPATH',
      together: 'Together',
      client: 'Your team',
    },
    note: 'Steps may differ with the starting scope and site conditions. Tell us how you run today and we will map it to your case.',
  },

  solutionFeature: {
    label: 'HOW IT WORKS',
    heading: 'From the record to the dashboard',
    lead: 'What operators enter on the floor becomes the management screen itself. Nothing is transcribed or re-totalled.',
    flow: {
      title: 'How data travels, from the floor to the dashboard',
      desc: 'Output and inspection results entered on the floor converge, pass through MES, and fan back out to the screens that need them.',
      equipment: 'Shop floor',
      collect: 'Record',
      mes: 'MES',
      dashboard: 'Dashboard',
    },
    collect: {
      label: 'DATA COLLECTION',
      title: 'Recorded where it happens',
      body: 'Output, inspection and stock movements are recorded where they happen. Operators enter them at the POP shop-floor terminal, and what goes in is organized by process and becomes the input to the next stage.',
      link: 'See how collection works',
      imageAlt: 'Production line with connected conveyors',
    },
    monitor: {
      label: 'MONITORING',
      title: 'Production control and monitoring',
      body: 'Output, defect rates and stock on one screen. The shop floor terminal and the executive dashboard read the same data, so the meeting spent reconciling numbers goes away.',
      link: 'See the capabilities',
      imageAlt: 'Dashboard screen showing metrics and trend charts',
    },
  },

  architecture: {
    label: 'ARCHITECTURE',
    heading: 'Inside the INFOLINK platform',
    lead: 'A layered structure running from the user-facing screens down to the data layer. What is implemented today is set out below.',
    note: 'The diagram above shows the architecture INFOLINK is built toward. The current implementation centres on a PostgreSQL operational database and a FastAPI service layer; time-series and analytical stores and container-based deployment are not part of it yet.',
    zoom: 'View larger',
    zoomHint: 'Zoom',
    close: 'Close',
    openOriginal: 'Open the original image in a new tab',
    scrollHint: 'Scroll sideways to see the full diagram',
    views: {
      solution: {
        tab: 'Solution',
        title: 'Solution architecture',
        caption: 'A data-driven manufacturing operations platform',
        alt: 'INFOLINK target (to-be) architecture diagram — a manufacturing operations platform divided into user and channel, business module, analysis, data, infrastructure and external integration layers',
      },
    },
    more: 'See the full structure',
    layersHeading: 'Layers (target architecture)',
    layers: [
      {
        id: 'channel',
        name: 'Users & channels',
        body: 'Executives, managers, supervisors, operators, quality staff, suppliers and customers each get their own view — on the web, a mobile app, a shop-floor PDA or scanner, or a dashboard.',
      },
      {
        id: 'app',
        name: 'Platform and services',
        body: 'Eight modules: sales and orders, production planning, purchasing and materials, work in process, quality, equipment, shipping and logistics, tracking and analytics. Workflow, approvals, notifications, permissions, audit logs and localization are shared services, carried by an API gateway and master data services underneath.',
      },
      {
        id: 'ai',
        name: 'AI & analytics',
        body: 'Quality deviation analysis, analysis screens for equipment, inventory and planning, analysis output as documents (Excel, Word, PDF), and analysis history kept for audit. Read and analyse only, with no automatic action.',
      },
      {
        id: 'data',
        name: 'Data layer',
        body: 'Operational database (PostgreSQL), time series (InfluxDB), warehouse (DuckDB) and file storage (MinIO/NAS/S3), each for its own purpose, connected by streaming and batch ingestion pipelines.',
      },
      {
        id: 'infra',
        name: 'Infrastructure',
        body: 'Runs on-premise or in a private cloud. Docker and Kubernetes deployment, Prometheus, Grafana and ELK monitoring, backup and DR, firewall, SSL and VPN.',
      },
      {
        id: 'integration',
        name: 'External systems',
        body: 'Connects to ERP (finance, purchasing, HR), PLM (design, BOM), SCM and customer systems over EDI.',
      },
    ],
    valuesHeading: 'What the structure delivers',
    values: [
      { id: 'visibility', name: 'One set of numbers', body: 'The shop-floor terminal and the executive dashboard read the same source' },
      { id: 'decision', name: 'A record that stays', body: 'Totals and history remain as the basis for a decision' },
      { id: 'efficiency', name: 'A fixed order', body: 'A stage opens only when the one before it is done' },
      { id: 'quality', name: 'Steady disposition', body: 'Judged against registered criteria, with the history kept' },
      { id: 'scalability', name: 'Stepwise growth', body: 'Adopt module by module and widen when you need to' },
    ],
  },



  spec: {
    label: 'SPECIFICATIONS',
    heading: 'Technical stack',
    lead: 'The first things an IT team checks when evaluating adoption. Only what is implemented today is listed.',
    groups: [
      { id: 'backend', name: 'Server', items: ['Python 3.12', 'FastAPI', 'uvicorn'] },
      { id: 'database', name: 'Database', items: ['PostgreSQL 17', 'psycopg3'] },
      { id: 'frontend', name: 'Client', items: ['HTML + Alpine.js', 'No separate build step'] },
      {
        id: 'auth',
        name: 'Auth',
        items: ['JWT tokens', 'Role-based access control (RBAC)', 'Per-request authorisation'],
      },
      { id: 'docs', name: 'Documents', items: ['Excel', 'Word', 'PDF'] },
      { id: 'api', name: 'API', items: ['REST — full coverage'] },
      { id: 'deploy', name: 'Deployment', items: ['On-premise', 'Private cloud'] },
    ],
    summary: [
      'Runs on a single PostgreSQL database',
      'No front-end build step',
      'Full REST API coverage',
      'On-premise or private cloud',
    ],
    more: 'See the full stack',
    note: 'Scope reflects the current implementation. Actual configuration depends on site conditions.',
  },

  clients: {
    heading: 'Companies we work with',
    lead: 'We have built and run MES on their factory floors.',
  },

  faq: {
    label: 'FAQ',
    heading: 'Frequently asked questions',
    lead: 'The questions we hear most often while a plant is evaluating adoption.',
    items: [
      {
        id: 'legacy',
        q: 'Our equipment is old. Can it still be connected?',
        a: 'Today we provide integration through a REST API. Any system that can call an API — ERP and accounting systems, barcode and label devices, your own collection programs — can exchange data with INFOLINK. Direct equipment-protocol integration (OPC UA and the like) varies enormously with the equipment involved, so we scope it case by case. In our experience many plants gain more by first getting material, quality and inventory records in order; equipment data is not too late as a following step.',
      },
      {
        id: 'scope',
        q: 'Where can we start?',
        a: 'You do not have to cover every process at once. Start with whichever hurts most — production output, equipment or quality — and widen to the next module while running. Because you start on a platform that already works, the first step is far smaller than building from scratch.',
      },
      {
        id: 'erp',
        q: 'We already run an ERP. Is this redundant?',
        a: 'They do different jobs. ERP handles orders, materials and accounting; MES handles what was actually made on the floor, when, and how much. INFOLINK does not replace your ERP. Production results and inventory are exposed through a REST API, so wiring your ERP to pull them removes the need to enter the same thing twice.',
      },
      {
        id: 'data',
        q: 'Where is our data stored?',
        a: 'On-premise or in a private cloud, whichever you need. If process data cannot leave your building, the platform installs on your own servers. Either way, access control and audit logging come as standard.',
      },
      {
        id: 'support',
        q: 'What happens after the build is finished?',
        a: 'Delivery is not the end. We stay on for operational questions and system checks, and the platform is built so that changes to your process or product can be handled at the configuration layer. Contact us for the specific scope and terms of support.',
      },
    ],
    ctaText: 'Still have a question?',
    ctaLink: 'Ask us directly',
  },



  cta: {
    heading: 'What does your plant actually need?',
    body: 'Just tell us what you make and how you track it today. We will map out what fits and reply within three business days.',
    button: 'Talk to us',
    phoneButton: 'Call us',
    mailLabel: 'Email us',
  },

  about: {
    label: 'ABOUT',
    heading: 'Lowering the barrier to adoption\nwith a platform that already works',
    imageAlt: 'An industrial robot arm in a white exhibition space',
    platformLabel: 'Platform',
    ceo: {
      label: 'LEADERSHIP',
      whyLabel: 'Why we built it',
    },
    bizHeading: 'Business registration',
    domainLabel: 'Domain',
    lead: 'INFOPATH builds execution systems for manufacturing floors. Because we own INFOLINK, our own MES platform, no project starts from an empty repository — we fit the platform to the plant.',

    /** Number band — same device as the home page statsBand. Source: company overview, section III. */
    stats: {
      caption: 'Company overview',
      items: [
        {
          id: 'founded',
          value: '2022',
          unit: '',
          name: 'Founded',
        },
        {
          id: 'people',
          value: '10',
          unit: '',
          name: 'Engineers',
        },
        {
          id: 'fields',
          value: '5',
          unit: '',
          name: 'Industries served',
        },
      ],
    },

    /** Company story — source: company overview, section I */
    story: {
      label: 'COMPANY',
      heading: 'We do not stop at go-live',
      body: 'INFOPATH builds and services MES for manufacturers.\nRather than handing over a system and walking away, we stay on through operations and maintenance — growing alongside the plants we work with.',

      /* The four stages from section II of the company overview — the order is the real sequence. */
      servicesLabel: 'What we do',
      services: [
        'MES solutions',
        'Smart factory consulting',
        'System integration',
        'Managed operations',
      ],
    },

    /** Track record — source: INFOPATH company overview (2025.04), section IV */
    record: {
      heading: 'Track record',
      lead: 'We were building and running MES on factory floors long before INFOLINK.',
      fieldLabel: 'Industry',
      items: [
        {
          id: 'ops',
          field: 'Optical film · Chemicals',
          title: 'MES managed operations',
          body: 'Ran and extended the MES for production lines.',
        },
        {
          id: 'overseas-build',
          field: 'LCD components',
          title: 'Overseas MES implementations',
          body: 'Took part in MES implementation projects at three overseas plants.',
        },
        {
          id: 'overseas-maint',
          field: 'LCD components',
          title: 'Production MES maintenance',
          body: 'Supported MES operations for an overseas subsidiary.',
        },
        {
          id: 'plant-maint',
          field: 'Optical film · Chemicals',
          title: 'Plant MES maintenance',
          body: 'Handled operations and development for TD and MD line MES.',
        },
        {
          id: 'web',
          field: 'Optical film · Chemicals',
          title: 'Web systems maintenance',
          body: 'Operated and maintained groupware and internal portal systems.',
        },
        {
          id: 'ai-quality',
          field: 'Chemicals',
          title: 'AI quality analytics',
          body: 'Built an AI-based quality data analysis system.',
        },
      ],
    },
  },

  contact: {
    label: 'CONTACT',
    heading: 'Get in touch',
    lead: 'Tell us about your processes and where you are stuck. Our team will get back to you.',
    responseNote: 'We reply within three business days.',
    phoneLabel: 'Call us',
    altContact: 'If the form is inconvenient, email us directly.',
    form: {
      name: 'Name',
      company: 'Company',
      position: 'Job title',
      phone: 'Phone',
      email: 'Email',
      inquiryType: 'Type of inquiry',
      message: 'Message',
      messagePlaceholder:
        'Current process setup, the scope you are considering, target timeline — anything helps. (10 characters minimum)',
      phonePlaceholder: '+82 10 0000 0000',
      selectPlaceholder: 'Please choose',
      consent: 'I agree to the collection and use of my personal information',
      consentDetail:
        'Collected: name, company, job title, phone, email, message · Purpose: responding to your inquiry · Retention: 1 year after response',
      consentLink: 'Read the full privacy policy',
      submit: 'Send inquiry',
      submitting: 'Sending…',
      successTitle: 'Your inquiry has been received',
      successBody: 'Our team will review it and get back to you shortly. Thank you.',
      successNote: 'We reply within three business days.',
      successAgain: 'Write another inquiry',
      errorTitle: 'Sending failed',
      errorBody:
        'Please try again in a moment. If it keeps failing, email us directly at the address below.',
      rateLimitTitle: 'Please try again shortly',
      rateLimitBody:
        'Several inquiries came through in a short time. Please send this again in a few minutes.',
      required: 'Required',
      optional: 'Optional',
      types: {
        consult: 'Adoption consulting',
        quote: 'Request a quote',
        demo: 'Request a demo',
        partnership: 'Partnership',
        etc: 'Other',
      },
      validation: {
        required: 'This field is required',
        email: 'Enter a valid email address',
        phone: 'Enter a valid phone number',
        consent: 'Please agree to the collection and use of personal information',
        tooShort: 'Enter at least 10 characters',
        tooLong: 'This is longer than allowed',
      },
    },
  },

  privacy: {
    label: 'PRIVACY',
    heading: 'Privacy Policy',
    lead: 'INFOPATH handles personal information with care and complies with applicable law.',
    draftTitle: 'This is a draft',
    draftBody:
      'Written against a standard template. It must be replaced with a final version after legal review.',
    effectiveLabel: 'Effective date',
    effectivePending: 'To be set on approval',
    sections: [
      {
        id: 'items',
        title: '1. Information we collect',
        body: 'We collect the following to handle your inquiry.\n\n· Required: name, company, phone, email, inquiry type, message\n· Optional: job title\n· Collected automatically: IP address (to block spam and abuse)',
      },
      {
        id: 'purpose',
        title: '2. Why we collect it',
        body: '· To review and respond to your inquiry\n· To arrange consulting, quotes and demo scheduling\n· To block abuse and repeated submissions\n\nWe do not use the information for any other purpose.',
      },
      {
        id: 'retention',
        title: '3. How long we keep it',
        body: 'One year after we respond, then destroyed without delay.\nWhere law requires longer retention, we keep it for that period only.\n\nIf you ask us to delete it sooner, we do so immediately.',
      },
      {
        id: 'destroy',
        title: '4. How we destroy it',
        body: '· Process: destroyed without delay once the retention period ends or the purpose is met.\n· Method: electronic files are permanently erased beyond recovery; printed material is shredded or incinerated.',
      },
      {
        id: 'thirdParty',
        title: '5. Sharing with third parties',
        body: 'We do not provide your personal information to third parties, except where required by law or lawfully requested by an investigative authority.',
      },
      {
        id: 'consign',
        title: '6. Processing entrusted to others',
        body: 'We entrust email delivery to the following provider.\n\n· Provider: Resend (email delivery)\n· Scope: delivering your inquiry by email\n\nOur agreement requires the provider to keep personal information secure.',
      },
      {
        id: 'rights',
        title: '7. Your rights',
        body: 'You may request access, correction, deletion or suspension of processing at any time. Contact us below and we will act without delay.\n\nYou may decline consent, in which case we cannot accept your inquiry.',
      },
      {
        id: 'safety',
        title: '8. How we keep it safe',
        body: '· Encryption in transit (HTTPS)\n· Access limited to those who need it\n· Spam and automated-submission blocking',
      },
      {
        id: 'manager',
        title: '9. Privacy contact',
        body: 'For questions, complaints or remedies regarding personal information, contact us below.',
      },
      {
        id: 'change',
        title: '10. Changes to this policy',
        body: 'If this policy is added to, removed from or amended, we announce it on this site at least seven days before it takes effect.',
      },
    ],
    remedyTitle: 'Where to seek redress',
    remedyBody:
      'For counselling or to report a privacy violation, you may contact the following Korean authorities.\n\n· Privacy Infringement Report Centre (privacy.kisa.or.kr / 118)\n· Personal Information Dispute Mediation Committee (kopico.go.kr / 1833-6972)\n· Supreme Prosecutors’ Office Cyber Investigation (spo.go.kr / 1301)\n· National Police Agency Cyber Bureau (ecrm.police.go.kr / 182)',
  },

  footer: {
    tagline: 'Connecting Manufacturing Intelligence',
    platformNote: 'INFOLINK — the smart factory MES platform by INFOPATH',
    company: 'Company',
    ceo: 'CEO',
    bizNo: 'Business reg. no.',
    address: 'Address',
    tel: 'Tel',
    email: 'Email',
    copyright: '© {year} INFOPATH. All rights reserved.',
    pendingNote: 'Business registration details will be published once confirmed.',
  },

  product: {
    nav: {
      label: 'Jump to a section',
      items: [
        { id: 'why', label: 'Problems' },
        { id: 'process', label: 'Eight stages' },
        { id: 'how', label: 'Record & manage' },
        { id: 'features', label: 'Capabilities' },
        { id: 'tech', label: 'Stack' },
        { id: 'architecture', label: 'Architecture' },
      ],
    },

    hero: {
      label: 'INFOLINK MES',
      imageAlt: 'A 3D render of translucent panels stacked in layers with data flowing into them',
      heading: 'From the moment material arrives to the moment product ships,\nevery step linked by data',
      lead: 'INFOLINK is a manufacturing execution system (MES).',
      values: [
        {
          id: 'traceability',
          name: 'Traceability',
          body: 'Trace any finished product back to the material that went into it.',
        },
        {
          id: 'control',
          name: 'Control',
          body: 'A stage cannot begin until the one before it is complete.',
        },
      ],
    },

    why: {
      label: 'WHY INFOLINK',
      heading: 'Three things that actually stall a plant',
      lead: 'Three situations that come up on floors running without an MES, and how INFOLINK answers each.',
      problemLabel: 'On the floor',
      answerLabel: 'INFOLINK',
      items: [
        {
          id: 'trace',
          no: '01',
          title: 'A defect is reported and the cause cannot be found',
          problem:
            'A customer reports a defect. Answering which materials were used and when means digging through paper logs and staff recollection. Unable to bound the recall, teams cast the net wider than necessary.',
          answer:
            'A LOT (a batch of material produced under the same conditions) number is assigned at goods receipt and carried through inspection and production to the finished product. The link between material LOT and production LOT is written automatically as output is reported, so nothing has to be compiled after the fact.',
        },
        {
          id: 'stock',
          no: '02',
          title: 'Book inventory does not match the shelf',
          problem:
            'The month-end count disagrees with the ledger. With no way to find where it diverged, the number simply gets adjusted.',
          answer:
            'Every action that changes stock passes through a single function, and that function updates the balance and writes the ledger entry in the same transaction. Ledger total therefore always equals current stock, and when it does diverge the responsible transaction can be identified.',
        },
        {
          id: 'gate',
          no: '03',
          title: 'Uninspected material reaches the line',
          problem:
            'When inspection results live outside the system in spreadsheets and on paper, there is no way to stop rejected material from entering production. A written rule gets skipped on a busy day.',
          answer:
            'Material that has not passed inspection is excluded from the issue-candidate list outright. It is not blocked by policy; it does not appear in the results.',
        },
      ],
    },

    flow: {
      label: 'PROCESS',
      heading: 'Eight stages, end to end',
      lead: 'This is not a list of screens. Each stage feeds the next, and work cannot proceed unless the conditions are met.',
      steps: [
        { id: 'sales', no: '01', name: 'Sales', sub: 'Order intake' },
        { id: 'purchase', no: '02', name: 'Purchasing', sub: 'Purchase order' },
        { id: 'receipt', no: '03', name: 'Goods receipt', sub: 'LOT assigned' },
        { id: 'inspection', no: '04', name: 'Inspection', sub: 'Disposition' },
        { id: 'production', no: '05', name: 'Production', sub: 'Work order · output' },
        { id: 'quality', no: '06', name: 'Quality', sub: 'In-process · final' },
        { id: 'shipping', no: '07', name: 'Shipping', sub: 'Dispatch' },
        { id: 'closing', no: '08', name: 'Closing', sub: 'Ledger close' },
      ],
      gateHeading: 'Where work is blocked',
      gates: [
        'Material that has not passed inspection is excluded from the issue-candidate list',
        'An item with no registered inspection criteria cannot have its purchase order confirmed',
        'A work order without reserved material cannot move to Started',
      ],
      thesis: 'It is not that the step can be skipped and should not be. It cannot be taken unless the conditions are met.',
      thesisSub: 'That constraint is what enforces quality.',

      modulesHeading: '11 business modules',
      modulesLead: 'Which module covers which of the eight stages.',
      modules: [
        { id: 'sales', names: 'Sales', stages: '① Sales' },
        { id: 'purchase', names: 'Purchasing / subcontracting', stages: '② Purchasing · ③ Goods receipt' },
        { id: 'quality', names: 'Quality', stages: '④ Inspection · ⑥ Quality' },
        { id: 'production', names: 'Production planning · production · WIP', stages: '⑤ Production' },
        { id: 'inventory', names: 'Inventory', stages: '⑦ Shipping · ⑧ Closing' },
        { id: 'support', names: 'Master data · equipment · system administration · AI analysis', stages: 'Across all stages' },
      ],
      bandAlt: 'Production line with connected conveyors',
      modulesNote: 'MRP (material requirements planning — what to buy, when, and how much, derived from the production plan) review sits within production planning; output reporting sits within production.',
    },

    features: {
      label: 'FEATURES',
      heading: 'Six core capabilities',
      lead: 'What each one solves comes first; the detail and the evidence sit underneath.',
      items: [
        {
          id: 'traceability',
          icon: 'route',
          tone: 'default',
          title: 'LOT traceability',
          summary: 'Answer which material was used and when, the moment a defect is reported.',
          points: [
            'LOT number at goods receipt, carried through inspection and production to the finished product',
            'Backward tracing — what went into this product',
            'Forward tracing — which products this material reached',
            'Consumption history, equipment and operator records per operation',
          ],
          evidence:
            'A dedicated genealogy table links material LOTs to production LOTs, written automatically as output is reported.',
        },
        {
          id: 'inventory',
          icon: 'boxes',
          tone: 'default',
          title: 'Inventory',
          summary: 'Make it possible to retrace why book stock and physical stock differ.',
          points: [
            'Seven warehouses — material · WIP · finished · defect · scrap · quarantine · staging',
            'Location-level storage management',
            'FIFO (first in, first out) automatic issue by expiry and receipt date',
            'Stock reservation — material committed per work order',
            'Transaction ledger — every movement recorded without exception',
          ],
          evidence:
            'Every action that changes stock passes through a single function, which updates the balance and writes the ledger entry in the same transaction. Ledger total therefore always equals current stock.',
        },
        {
          id: 'quality',
          icon: 'shield',
          tone: 'default',
          title: 'Quality',
          summary: 'Accept or reject against registered criteria rather than recollection.',
          points: [
            'Inspection types — incoming · in-process · final and others',
            'Inspection criteria — target, upper and lower limit per characteristic',
            'Automatic disposition — the server compares measurements against the criteria',
            'Sampling plans — 100% · interval · ratio · AQL',
            'On rejection, an NCR (non-conformance report) is raised and the LOT is quarantined to the defect warehouse',
            'Measurement history retained',
          ],
          evidence:
            'The acceptance criteria are read from the server, not taken from the values the screen submits.',
        },
        {
          id: 'production',
          icon: 'factory',
          tone: 'default',
          title: 'Production',
          summary: 'One continuous flow from work order to completion, with no step quietly skipped.',
          points: [
            'BOM (the materials one product needs) and routing (operation sequence) explosion',
            'Work order → reservation → start → output → completion',
            'Two issue methods — pick / backflush',
            'Output and defect totals per operation',
            'POP shop-floor terminal — operators report output where the work happens',
            'Twelve checks run automatically at completion',
          ],
          evidence:
            'BOM and routing are copied and frozen at the moment the work order is issued. A later BOM change does not alter the requirements of an order already released.',
        },
        {
          id: 'wip',
          icon: 'split',
          tone: 'default',
          title: 'WIP LOT transactions',
          summary: 'Splitting and merging LOTs on the floor never happens off the record.',
          points: [
            '28 LOT-level transaction types',
            'Create · split · merge · partial merge · assemble · disassemble · reclassify',
            'Operation start · complete / pause · resume / hold · release',
            'Warehouse move · two-step move (ship · receive) · loss · scrap · reversal',
            'Carried out from a dedicated Workbench screen',
            'Every transaction preserves quantity and records genealogy',
          ],
          evidence:
            'A cancellation does not erase the record. A reversal writes a new opposing entry, so what was cancelled and why remains visible.',
        },
        {
          id: 'ai',
          icon: 'search',
          tone: 'muted',
          title: 'AI analysis support',
          summary: 'Help for when the data is there but it is unclear where to look first.',
          points: [
            'Quality deviation analysis — candidate causes and an investigation order',
            'Analysis screens for equipment, inventory, planning and other areas',
            'Analysis output as a file (Excel · Word · PDF)',
            'Analysis history kept for audit',
          ],
          evidence:
            'Statistics and aggregation are done by the system; the AI explains the result. It does not fix a cause, only proposes candidates and an investigation order, and it does not reorder that ranking. It is read and analyse only, and takes no automatic action such as stopping equipment, holding stock or raising a non-conformance.',
          callout:
            'The AI does not decide for you. It points at where to look first. The judgement and the action stay with your team.',
        },
      ],
      detailLabel: 'See detail',
      evidenceLabel: 'Evidence',
    },

    tech: {
      label: 'TECHNOLOGY',
      heading: 'Technical stack',
      lead: 'What is implemented today.',
      rows: [
        { id: 'backend', name: 'Backend', value: 'Python 3.12 · FastAPI · uvicorn' },
        { id: 'database', name: 'Database', value: 'PostgreSQL 17 (psycopg3)' },
        { id: 'frontend', name: 'Frontend', value: 'HTML + Alpine.js' },
        { id: 'auth', name: 'Auth', value: 'JWT tokens · role-based access control (RBAC)' },
        { id: 'docs', name: 'Documents', value: 'Excel · Word · PDF' },
        { id: 'api', name: 'API', value: 'REST — full coverage' },
        { id: 'deploy', name: 'Deployment', value: 'On-premise · private cloud' },
      ],
      strengthsHeading: 'Why this shape helps',
      strengths: [
        {
          id: 'single-db',
          title: 'One database: PostgreSQL',
          body: 'No burden of operating several stores side by side.',
        },
        {
          id: 'no-build',
          title: 'No front-end build step',
          body: 'Change a file and it takes effect. Deployment stays simple.',
        },
        {
          id: 'light-ops',
          title: 'Light on people',
          body: 'Light to adopt, and light to keep running.',
        },
      ],
      slogan: 'Start Small does not mean features were taken out. It means the system was built this way.',
      accessHeading: 'Access control',
      access: 'Permissions are not a matter of hiding screens. The server checks every request as it arrives, so revoking a permission takes effect immediately.',
    },

    teaser: {
      label: 'OUR PLATFORM',
      heading: 'This is why we are fast',
      kicker: 'INFOPATH owns INFOLINK, its own MES platform.',
      lead: 'All eight stages and the shared functions are already built, so work starts by fitting them to your process. That is what brings the schedule and the cost down.',
      imageAlt: 'A control-room screen showing metrics and trend charts',
      cta: 'Explore INFOLINK',
    },
  },

  cases: {
    label: 'CASE STUDIES',
    heading: 'Where it runs',
    lead: 'What was stuck on each floor, and what became possible.',
    problemLabel: 'Problem',
    resultLabel: 'Result',
  },

  notFound: {
    heading: 'Page not found',
    body: 'This address may have changed or the page may have been removed.',
  },
};

export default en;
