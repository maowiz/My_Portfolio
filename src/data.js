// ============================================================
//  PORTFOLIO DATA — Muhammad Maowiz Saleem
//  All content crafted for maximum recruiter/CEO impact.
// ============================================================

export const personalInfo = {
  name: 'Muhammad Maowiz Saleem',
  firstName: 'Maowiz',
  title: 'AI/ML Engineer',
  tagline:
    'From 3M+ transactions to real-time computer vision — I engineer AI that works in the real world.',
  email: 'maowizsaleem009@gmail.com',
  phone: '+92-333-8789838',
  location: 'Punjab, Pakistan',
  github: 'https://github.com/maowiz',
  linkedin:
    'https://linkedin.com/in/muhammad-maowiz-saleem-0700272b1',
  avatar: '/assets/profile.jpeg',
};

export const summary =
  "I build production ML systems that real businesses depend on. Over the past 1.5 years, I've deployed computer vision pipelines processing thousands of frames daily, engineered voice AI handling 200+ calls, and architected demand forecasting on 3M+ retail transactions — shipping end-to-end from data engineering through cloud deployment. I care deeply about code that ships, models that monitor, and systems that scale.";

export const stats = [
  { value: 1.5, suffix: '+', label: 'Years Experience' },
  { value: 94, suffix: '%', label: 'Detection Accuracy' },
  { value: 5, suffix: '+', label: 'Client Projects' },
  { value: 3.95, suffix: '/4', label: 'CGPA' },
];

export const skills = {
  'ML & Deep Learning': [
    'CNNs', 'RNNs/LSTMs', 'Transformers', 'XGBoost',
    'Random Forest', 'Time-Series', 'Ensemble Methods',
  ],
  'NLP & Generative AI': [
    'NLP', 'RAG', 'Prompt Engineering', 'LLM Fine-Tuning',
    'Vector Embeddings', 'Semantic Search', 'NER',
  ],
  'Computer Vision': [
    'OpenCV', 'YOLO', 'SSD', 'Image Classification',
    'Real-Time Video', 'Data Annotation',
  ],
  'Frameworks': [
    'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn',
    'Hugging Face', 'LangChain', 'NumPy', 'Pandas',
  ],
  'MLOps & Cloud': [
    'Docker', 'Git', 'CI/CD', 'MLflow', 'W&B',
    'AWS S3', 'AWS EC2', 'SageMaker',
  ],
  'Deployment': [
    'FastAPI', 'Flask', 'Streamlit', 'Hugging Face Spaces',
    'REST APIs', 'Linux',
  ],
};

export const toolLogos = [
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', alt: 'Python', title: 'Python' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg', alt: 'TensorFlow', title: 'TensorFlow' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg', alt: 'PyTorch', title: 'PyTorch' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg', alt: 'OpenCV', title: 'OpenCV' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', alt: 'Docker', title: 'Docker' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', alt: 'AWS', title: 'AWS' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg', alt: 'FastAPI', title: 'FastAPI' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg', alt: 'Flask', title: 'Flask' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', alt: 'PostgreSQL', title: 'PostgreSQL' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', alt: 'Git', title: 'Git' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', alt: 'Linux', title: 'Linux' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg', alt: 'C++', title: 'C++' },
];

export const experience = [
  {
    title: 'AI/ML Engineer — Computer Vision & NLP',
    company: 'Freelance (Remote)',
    location: 'Clients across UAE, USA, and Pakistan',
    period: 'May 2024 — Jan 2026',
    highlights: [
      'Replaced a 3-person manual inspection team with 94%+ accurate PPE compliance detection (TensorFlow/OpenCV), cutting inspection costs by 40%.',
      'Automated 200+ daily customer calls with a voice AI system (FastAPI + NLP), reducing missed inquiries by 60%.',
      'Delivered complete ML pipelines for 3+ research clients — scraping through deployment — boosting model accuracy 12-18%.',
      'Shipped 5+ projects on time, managing full lifecycle from requirements to deployment and client handoff.',
    ],
  },
  {
    title: 'Machine Learning Research Assistant',
    company: 'COMSATS University — Dept. of Computer Science',
    location: 'Punjab, Pakistan',
    period: 'Jan 2024 — May 2024',
    highlights: [
      'Benchmarked ResNet, VGG, and EfficientNet on 10,000+ labeled medical images with custom augmentation pipelines.',
      'Tracked 50+ experiment runs in MLflow, establishing reproducible research practices for the department.',
      'Co-authored internal reports on model comparison; presented findings to faculty and graduate researchers.',
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: 'RetailFlow AI',
    subtitle: 'Demand Forecasting & Inventory Optimization',
    description:
      'Processes 3M+ retail transactions with ensemble ML, achieving <8% forecast error — projected to cut inventory costs by 15%.',
    fullDescription:
      'Architected modular ETL pipelines using XGBoost, Random Forest, and Prophet. Engineered 40+ time-series features including lag, rolling stats, and holiday indicators. Implemented Safety Stock, ROP, and EOQ algorithms. Deployed end-to-end via FastAPI + Streamlit + Docker with LLM-generated executive summaries for non-technical stakeholders.',
    tech: ['Python', 'XGBoost', 'Prophet', 'FastAPI', 'Streamlit', 'Docker', 'AWS'],
    image: '/assets/retailflow.png',
    url: 'https://huggingface.co/spaces/maowi/sales-forecast-optimizer',
    github: 'https://github.com/maowiz',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
    year: '2025',
    metric: '3M+ transactions',
  },
  {
    id: 2,
    title: 'ULTON',
    subtitle: 'Offline AI Desktop Assistant',
    description:
      'Privacy-first desktop AI running quantized LLaMA on CPU with 95%+ task completion — zero cloud dependency.',
    fullDescription:
      'Real-time LLM inference using 4-bit quantized LLaMA via llama.cpp with AVX2 SIMD optimization — 75% memory reduction vs. standard inference. Modular architecture: voice commands (Whisper), desktop automation, email composing, and local knowledge retrieval with SQLite-based context management.',
    tech: ['Python', 'LLaMA.cpp', 'AVX2', 'Whisper', 'SQLite'],
    image: '/assets/ulton.png',
    url: null,
    github: 'https://github.com/maowiz',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
    year: '2024',
    metric: '75% memory saved',
  },
  {
    id: 3,
    title: 'BOT_M',
    subtitle: 'AI Knowledge Bot Builder (SaaS)',
    description:
      'SaaS platform for custom AI assistants from websites, PDFs, and notes — 89%+ answer relevance, sub-2s response.',
    fullDescription:
      'RAG pipeline built with LangChain + sentence-transformers + FAISS. Supports 50+ concurrent knowledge bases with content ingestion via web crawling, PDF parsing, and intelligent chunking. FastAPI backend with embeddable JavaScript chat widget for seamless third-party integration.',
    tech: ['Python', 'FastAPI', 'RAG', 'LangChain', 'FAISS', 'Embeddings'],
    image: '/assets/botm.jpg',
    url: 'https://maowiz-bot-m.hf.space',
    github: 'https://github.com/maowiz',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
    year: '2024',
    metric: '89% relevance',
  },
];

export const education = {
  school: 'COMSATS University',
  location: 'Punjab, Pakistan',
  degree: 'BS Software Engineering',
  cgpa: '3.95 / 4.0',
  honor: "Dean's List",
  expected: 'January 2026',
  image: '/assets/comsats.png',
  coursework: [
    'Machine Learning', 'Artificial Intelligence',
    'Data Structures & Algorithms', 'Database Systems',
    'Probability & Statistics', 'Linear Algebra',
    'Computer Networks', 'Operating Systems',
  ],
};

export const certifications = [
  {
    title: 'Machine Learning with Python',
    issuer: 'IBM',
    year: '2025',
    badge: 'Credly Verified',
    image: '/assets/IBM.jpg',
    url: 'https://www.credly.com/badges/f48e2260-9516-4d96-81eb-583426ce8dfa/public_url',
  },
  {
    title: 'Python for Machine Learning',
    issuer: 'Kaggle',
    year: '2024',
    badge: 'Kaggle Certified',
    image: '/assets/kaggle.jpg',
    url: 'https://www.kaggle.com/learn/certification/maowizsaleem/python',
  },
];

export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];
