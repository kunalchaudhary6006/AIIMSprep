import { useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout, loginWithEmail, registerWithEmail, resetPassword, ensureUserDocument, addPurchasedBatchToDB } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, ChevronDown, CheckCircle2,
  Video, BookOpen, PenTool, Users,
  Star, Award, ArrowRight, Phone, Mail, Search,
  PlayCircle, FileJson, GraduationCap
} from 'lucide-react';

const navStructure = [
  {
    title: 'Courses',
    subItems: ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course']
  },
  {
    title: 'Question Bank',
    subItems: ['Oswaal Physics Question Bank PDF', 'Oswaal Chemistry Question Bank PDF', 'Oswaal Biology Question Bank PDF', 'Oswaal Complete NEET Package PDF']
  },
  {
    title: 'Faculty',
    subItems: ['Dr. Vivek Jain', 'Dr. NK Sharma', 'Sir Vipin Agarwal', 'Sir S.S. Bhatia']
  }
];

const Navbar = ({ onAction, user, onLogout }: { onAction: (title: string, type: string) => void, user: User | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed w-full z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="text-3xl font-extrabold text-blue-700 tracking-tight">AIIMS</span>
              <span className="text-3xl font-bold text-orange-500 tracking-tight">prep</span>
            </div>
            <div className="hidden md:flex space-x-2">
              {navStructure.map((navItem) => (
                <div key={navItem.title} className="relative group flex items-center">
                  <button className="inline-flex items-center px-2 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                    {navItem.title}
                    <ChevronDown className="ml-1 w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute top-full left-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-left scale-95 group-hover:scale-100">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2">
                      {navItem.subItems.map((sub, idx) => (
                        <button key={idx} onClick={() => onAction(sub, sub.includes('Oswaal') ? 'pdf_info' : ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course'].includes(sub) ? 'course_info' : 'link')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <input type="text" placeholder="Search..." className="bg-gray-100 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all" />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                  <span className="text-sm font-bold text-gray-700">{user.displayName}</span>
                </div>
                <button onClick={onLogout} className="text-sm font-bold text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => onAction('Login to your account', 'login')} className="text-sm font-bold text-blue-600 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">Login</button>
                <button onClick={() => onAction('Create a new account', 'register')} className="text-sm font-bold bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all">
                  Register
                </button>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
               {navStructure.map((navItem) => (
                <div key={navItem.title} className="border-b border-gray-50">
                  <button 
                    onClick={() => setMobileDropdown(mobileDropdown === navItem.title ? null : navItem.title)} 
                    className="w-full flex items-center justify-between px-2 py-3 text-base font-medium text-gray-800"
                  >
                    {navItem.title}
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${mobileDropdown === navItem.title ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileDropdown === navItem.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50 rounded-lg mx-2 mb-2"
                      >
                        {navItem.subItems.map(sub => (
                          <button 
                            key={sub} 
                            onClick={() => { setIsOpen(false); onAction(sub, sub.includes('Oswaal') ? 'pdf_info' : ['Target Batch 2025', 'Target Batch 2026', 'Masterclass in Biology', 'Foundation Course'].includes(sub) ? 'course_info' : 'link'); }} 
                            className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:text-blue-700 hover:bg-gray-100 transition-colors"
                          >
                            {sub}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-50">
                      <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                      <span className="text-base font-bold text-gray-800">{user.displayName}</span>
                    </div>
                    <button onClick={() => { setIsOpen(false); onLogout(); }} className="w-full text-center text-gray-600 font-bold py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setIsOpen(false); onAction('Login to your account', 'login'); }} className="w-full text-center text-blue-600 font-bold py-3 border border-blue-600 rounded-lg">Login</button>
                    <button onClick={() => { setIsOpen(false); onAction('Create a new account', 'register'); }} className="w-full text-center bg-orange-500 text-white font-bold py-3 rounded-lg">Register</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onAction }: { onAction: (title: string, type: string) => void }) => {
  return (
    <div className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 rounded-bl-[150px] opacity-[0.03] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 text-blue-700 font-semibold text-sm mb-6 border border-blue-200">
              <Star className="w-4 h-4 fill-blue-600 text-blue-600" />
              Exclusive Platform for AIIMS
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Crack AIIMS with <br />
              <span className="text-blue-700">Expert Guidance</span> <br />
              & Target Setting.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              We offer 1 Year & 2 Year online preparation courses. Get access to exhaustive question banks, test series & recorded video lectures.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => onAction('Book your free trial', 'trial')} className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5">
                Book Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => onAction('Watch Platform Demo', 'video')} className="flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
                <PlayCircle className="w-5 h-5 text-blue-600" />
                Watch Demo
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm" src={`https://picsum.photos/seed/face${i}/64/64`} alt="Student" referrerPolicy="no-referrer" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />)}
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-1">Trusted by 200,000+ students</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-emerald-200 rounded-[2rem] transform rotate-3 scale-105 opacity-50 blur-lg"></div>
            <img 
              src="https://picsum.photos/seed/doctor/800/600" 
              alt="Medical Student" 
              className="relative rounded-[2rem] shadow-2xl object-cover w-full h-[500px]" 
              referrerPolicy="no-referrer"
            />
            
            {/* Floating Badge 1 */}
            <div className="absolute -left-8 top-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
              <div className="bg-green-100 p-3 rounded-full">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">7000+</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selections</p>
              </div>
            </div>

            {/* Floating Badge 2 */}
            <div className="absolute -right-8 bottom-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">158k+</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Questions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Stats = () => {
  const stats = [
    { value: '158k+', label: 'Questions Practiced', icon: <PenTool /> },
    { value: '22k+', label: 'Video Lectures', icon: <Video /> },
    { value: '32k+', label: 'Flashcards', icon: <FileJson /> },
    { value: '7000+', label: 'Total Selections', icon: <GraduationCap /> },
  ];

  return (
    <div className="bg-blue-700 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-white mb-1.5">{stat.value}</p>
              <p className="text-blue-200 font-medium text-sm lg:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Offerings = ({ onAction }: { onAction: (title: string, type: string) => void }) => {
  const offerings = [
    {
      title: 'Target Settings',
      description: 'Set daily micro-targets, track completion, and stay ahead of your schedule.',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50',
      border: 'border-purple-100'
    },
    {
      title: 'Video Lectures',
      description: 'Concept-clearing recorded lectures by India\'s top AIIMS faculties.',
      icon: <Video className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      title: 'Question Bank',
      description: 'NCERT based highly relevant objective questions segregated by difficulty.',
      icon: <BookOpen className="w-8 h-8 text-orange-600" />,
      color: 'bg-orange-50',
      border: 'border-orange-100'
    },

  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-700 font-bold uppercase tracking-wider text-sm mb-3">Our Offerings</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Everything you need to crack AIIMS</h3>
          <p className="text-lg text-gray-600">
            A comprehensive, technology-driven platform that supports you through every step of your AIIMS preparation journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {offerings.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={`p-8 rounded-2xl border ${item.border} bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer group`}
            >
              <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                {item.description}
              </p>
              <div onClick={() => onAction('Know more about ' + item.title, 'info')} className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                Know More <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Features = ({ onAction }: { onAction: (title: string, type: string) => void }) => {
  return (
    <div className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Top features that will help you <span className="text-blue-700">outperform the rest</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We focus on active learning methodologies instead of passive binge-watching. Engage with content directly and measure your true standing.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Audio & Text Flashcards', desc: 'Memorize NCERT lines quickly with actively spaced repetition.' },
                { title: 'Mentorship Program', desc: 'Get personal guidance from students who recently cleared AIIMS.' },
                { title: 'Custom Test Generator', desc: 'Create your own tests selecting specific chapters and difficulty.' },
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-gray-900 mb-1">{feat.title}</h5>
                    <p className="text-gray-600">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => onAction('Explore All Features', 'info')} className="mt-10 bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
              Explore All Features
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-[3rem] transform -rotate-3 scale-105"></div>
            <img 
              src="https://picsum.photos/seed/study/800/800" 
              alt="Platform Features" 
              className="relative rounded-[3rem] shadow-xl w-full h-[600px] object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* UI overlay mock */}
            <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 max-w-xs hidden md:block">
              <h6 className="font-bold text-gray-900 mb-2">Today's Target</h6>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div className="bg-green-500 h-2 rounded-full w-[70%]"></div>
              </div>
              <p className="text-sm text-gray-500">70% Chapter completed. Keep going!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pricing = ({ onAction, purchasedBatches }: { onAction: (title: string, type: string) => void, purchasedBatches: string[] }) => {
  const plans = [
    {
      name: "Target Batch 2025",
      price: "₹3,999",
      originalPrice: "₹5,999",
      description: "For class 12th appearing & drop-out students",
      features: [
        "158k+ NCERT Based Questions",
        "Target Generation capability",
        "Unlimited Custom Tests",
        "Complete Mentorship"
      ],
      popular: true
    },
    {
      name: "Target Batch 2026",
      price: "₹4,999",
      originalPrice: "₹7,999",
      description: "For class 11th students (2 Year Validity)",
      features: [
        "Everything in Target 2025",
        "Detailed class 11th foundation",
        "2 Year Test Series Access",
        "Doubt resolution"
      ],
      popular: false
    },
    {
      name: "Masterclass in Biology",
      price: "₹1,999",
      originalPrice: "₹2,999",
      description: "By Dr. N.K. Sharma & Dr. Vivek Jain",
      features: [
        "Audio & Text Flashcards",
        "Assertion-Reasoning Bank",
        "NCERT line-by-line decoding",
        "High-yield topic videos"
      ],
      popular: false
    }
  ];

  return (
    <div className="py-24 bg-gray-50 border-t border-gray-100" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-700 font-bold uppercase tracking-wider text-sm mb-3">Pricing</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Choose your batch</h3>
          <p className="text-lg text-gray-600">
            Affordable, high-quality preparation materials designed to get you selected in AIIMS.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative flex flex-col p-8 rounded-3xl bg-white border ${plan.popular ? 'border-orange-500 shadow-xl scale-105 z-10' : 'border-gray-200 shadow-sm'} transition-all`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-orange-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full">Most Popular</span>
                </div>
              )}
              <h4 className="text-2xl font-extrabold text-gray-900 mb-2">{plan.name}</h4>
              <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
              
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
              
              {purchasedBatches.includes(plan.name) ? (
                <button 
                  onClick={() => onAction(`${plan.name} Dashboard`, 'dashboard')}
                  className="w-full py-4 rounded-xl font-bold text-lg transition-colors bg-green-500 text-white hover:bg-green-600"
                >
                  Access Batch
                </button>
              ) : (
                <button 
                  onClick={() => onAction(`Enroll in ${plan.name}`, 'payment')}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${plan.popular ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                >
                  Enroll Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Faculty = ({ onAction }: { onAction: (title: string, type: string) => void }) => {
  const teachers = [
    { name: 'Dr. Vivek Jain', subject: 'Biology', exp: '15+ Years', img: '10' },
    { name: 'Dr. NK Sharma', subject: 'Biology', exp: '12+ Years', img: '20' },
    { name: 'Sir Vipin Agarwal', subject: 'Chemistry', exp: '20+ Years', img: '30' },
    { name: 'Sir S.S. Bhatia', subject: 'Physics', exp: '18+ Years', img: '40' },
  ];

  return (
    <div className="py-24 bg-white" id="faculty">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Learn from AIIMS Experts</h2>
            <p className="text-lg text-gray-600">Experienced faculties who have produced top ranks over the past decade. They break down complex topics into simple frameworks.</p>
          </div>
          <button onClick={() => onAction('View All Faculty Members', 'list')} className="flex-shrink-0 text-blue-700 font-bold border border-blue-200 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
            View All Staff
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((teacher, idx) => (
            <div key={idx} onClick={() => onAction(teacher.name + ' Bio', 'bio')} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-4 bg-gray-100">
                <img 
                  src={`https://picsum.photos/seed/${teacher.img}/400/500`} 
                  alt={teacher.name} 
                  className="w-full h-[300px] object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="text-white text-sm font-medium">Read Bio</div>
                </div>
              </div>
              <div className="text-center group-hover:-translate-y-1 transition-transform">
                <h4 className="text-xl font-bold text-gray-900">{teacher.name}</h4>
                <p className="text-orange-600 font-semibold mb-1">{teacher.subject}</p>
                <p className="text-gray-500 text-sm font-medium">{teacher.exp} Experience</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CTA = ({ onAction }: { onAction: (title: string, type: string) => void }) => {
  return (
    <div className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-700"></div>
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/pattern/1920/1080')] opacity-10 mix-blend-overlay object-cover"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          Ready to kickstart your preparation?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join India's most trusted AIIMS preparation platform and ensure your seat in a top medical college.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => onAction('Book your free trial', 'trial')} className="bg-orange-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-orange-600 shadow-xl shadow-orange-500/20 transition-all">
            Book Free Trial Now
          </button>
          <button onClick={() => onAction('View Pricing Plans', 'pricing')} className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all">
            View Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ onAction }: { onAction: (title: string, type: string) => void }) => {
  return (
    <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-0 mb-6">
              <span className="text-3xl font-extrabold text-white tracking-tight">AIIMS</span>
              <span className="text-3xl font-bold text-orange-500 tracking-tight">prep</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              AIIMSprep is India's most results-focused AIIMS-exclusive preparation platform. Empowering students with the right strategy and resources.
            </p>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>+91 85275-21718</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>support@neetprep.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Courses</h4>
            <ul className="space-y-4 text-gray-400">
              <li><button onClick={() => onAction('Navigate to Target Batch 2025', 'link')} className="hover:text-white transition-colors text-left">Target Batch 2025</button></li>
              <li><button onClick={() => onAction('Navigate to Target Batch 2026', 'link')} className="hover:text-white transition-colors text-left">Target Batch 2026</button></li>
              
              <li><button onClick={() => onAction('Navigate to Masterclass in Biology', 'link')} className="hover:text-white transition-colors text-left">Masterclass in Biology</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><button onClick={() => onAction('Navigate to About Us', 'link')} className="hover:text-white transition-colors text-left">About Us</button></li>
              <li><button onClick={() => onAction('Navigate to Our Faculties', 'link')} className="hover:text-white transition-colors text-left">Our Faculties</button></li>
              <li><button onClick={() => onAction('Navigate to Selections', 'link')} className="hover:text-white transition-colors text-left">Selections</button></li>
              <li><button onClick={() => onAction('Navigate to Contact Us', 'link')} className="hover:text-white transition-colors text-left">Contact Us</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Legal</h4>
            <ul className="space-y-4 text-gray-400">
              <li><button onClick={() => onAction('Navigate to Privacy Policy', 'link')} className="hover:text-white transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => onAction('Navigate to Terms of Service', 'link')} className="hover:text-white transition-colors text-left">Terms of Service</button></li>
              <li><button onClick={() => onAction('Navigate to Refund Policy', 'link')} className="hover:text-white transition-colors text-left">Refund Policy</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AIIMSPrep (Cloned for preview). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const Modal = ({ config, onClose, onGoogleSignIn, onPaymentSuccess, purchasedBatches, onAction, onEmailAuth, onResetPassword }: { config: any, onClose: () => void, onGoogleSignIn: () => void, onPaymentSuccess: (batch: string) => void, purchasedBatches: string[], onAction: (t: string, ty: string) => void, onEmailAuth: (mode: 'login' | 'register', e: string, p: string) => void, onResetPassword: (e: string) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600 p-1">
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pr-6">{config.title}</h3>
        
        {config.type === 'login' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4 text-center">Please verify your identity to securely log in.</p>
            <form onSubmit={(e) => { e.preventDefault(); const t = e.target as any; onEmailAuth('login', t.email.value, t.password.value); }} className="space-y-3">
              <input type="email" name="email" required placeholder="Email Address" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
              <input type="password" name="password" required placeholder="Password" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">Login</button>
            </form>
            <div className="flex justify-center">
              <button type="button" onClick={() => onAction('Reset Password', 'forgot_password')} className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
            </div>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button onClick={onGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-bold py-3 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {config.type === 'forgot_password' && (
          <form onSubmit={(e) => { e.preventDefault(); const t = e.target as any; onResetPassword(t.email.value); }} className="space-y-4">
            <p className="text-gray-600 text-sm mb-4 text-center">Enter your email address to receive an SMTP link to securely change your password.</p>
            <div>
              <input type="email" name="email" required className="w-full text-base sm:text-sm border border-gray-300 rounded-lg px-4 py-2.5 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="you@example.com" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 sm:py-2.5 rounded-lg hover:bg-blue-700">Send Reset Link</button>
            <div className="text-center mt-2">
               <button type="button" onClick={() => onAction('Login to your account', 'login')} className="text-sm text-gray-500 hover:text-gray-800">Back to Login</button>
            </div>
          </form>
        )}
        
        {config.type === 'register' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4 text-center">Create a new account securely.</p>
            <form onSubmit={(e) => { e.preventDefault(); const t = e.target as any; onEmailAuth('register', t.email.value, t.password.value); }} className="space-y-3">
              <input type="email" name="email" required placeholder="Email Address" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
              <input type="password" name="password" required placeholder="Choose a Password" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2.5 rounded-lg hover:bg-orange-600">Create Account</button>
            </form>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button onClick={onGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-bold py-3 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </div>
        )}

        {config.type === 'trial' && (
          <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">Enter your email address to get access to your free trial.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" required className="w-full text-base sm:text-sm border border-gray-300 rounded-lg px-4 py-2.5 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="you@example.com" />
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 sm:py-2.5 rounded-lg hover:bg-orange-600">Start Free Trial</button>
          </form>
        )}

        {config.type === 'video' && (
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mt-4 mb-4 relative overflow-hidden group cursor-pointer" onClick={onClose}>
            <img src="https://picsum.photos/seed/video/800/400" className="absolute inset-0 w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
            <PlayCircle className="w-16 h-16 text-white z-10 group-hover:scale-110 transition-transform" />
          </div>
        )}

        
        {config.type === 'payment' && (
          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="w-full flex items-center justify-center gap-2 pb-4 border-b border-gray-100">
              <span className="bg-blue-800 text-white font-bold px-3 py-1 rounded-md text-xs tracking-wider">KNITPAY</span>
              <span className="text-gray-800 font-semibold text-sm">UPI Plugin</span>
            </div>
            <p className="text-gray-600 text-center text-sm">Scan the QR code below via Google Pay, PhonePe, or any UPI app to pay for <strong>{config.title.replace('Enroll in ', '')}</strong>.</p>
            <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-md">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=aiimsprep@upi&pn=AIIMSprep" alt="KnitPay UPI QR Code" className="w-48 h-48" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/qr/250/250'; }} />
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl w-full text-center">
                <p className="text-sm text-gray-800 font-medium mb-3">After payment, send your screenshot to our official Telegram:</p>
                <a 
                   href="https://t.me/aiimsprep" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   onClick={() => onPaymentSuccess(config.title.replace('Enroll in ', ''))}
                   className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-3.5 rounded-lg hover:bg-blue-600 transition shadow-sm mb-2"
                >
                   <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.539.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
                   Send Screenshot on Telegram
                </a>
                <p className="text-xs text-orange-700">Admin will verify and grant batch access within minutes.</p>
                <p className="text-xs text-gray-500 mt-2 italic">(Demo Note: Clicking automatically grants access to test the flow)</p>
            </div>

            <p className="text-xs text-gray-400 text-center px-4 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Secured by KnitPay
            </p>
          </div>
        )}

        {config.type === 'course_info' && (
          <div className="space-y-4">
             <div className="mb-6">
                 <p className="text-gray-600">Access exhaustive study materials, test series and video lectures carefully designed for <strong>{config.title}</strong>.</p>
             </div>
             {purchasedBatches.includes(config.title) ? (
               <div className="bg-green-50 border border-green-200 p-5 rounded-xl">
                  <h4 className="text-green-800 font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> You have full access!</h4>
                  <p className="text-sm text-green-700 mb-4">Your enrolment in this batch is active.</p>
                  <button onClick={() => onAction(config.title + ' Dashboard', 'dashboard')} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 shadow-sm transition">Enter Course Dashboard</button>
               </div>
             ) : (
               <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl">
                  <h4 className="text-orange-800 font-bold mb-2 outline-none">This is a premium batch</h4>
                  <p className="text-sm text-orange-700 mb-4 leading-relaxed">Enroll now to unlock premium features including ad-free video lectures, unlimited test submissions, and NCERT flashcards.</p>
                  <button onClick={() => { onClose(); setTimeout(() => onAction('Enroll in ' + config.title, 'payment'), 150); }} className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 shadow-sm transition">Buy Now</button>
               </div>
             )}
          </div>
        )}

        {config.type === 'pdf_info' && (
         <div className="space-y-4">
            <div className="mb-6">
                <p className="text-gray-600">Download the official High-Yield <strong>{config.title}</strong> directly to your device for offline practice.</p>
            </div>
            {purchasedBatches.includes(config.title) ? (
              <div className="bg-green-50 border border-green-200 p-5 rounded-xl">
                 <h4 className="text-green-800 font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> You have full access!</h4>
                 <p className="text-sm text-green-700 mb-4">Your purchase is confirmed.</p>
                 <button onClick={() => onAction(config.title + ' Viewer', 'pdf_viewer')} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 shadow-sm transition">Open PDF</button>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
                 <h4 className="text-blue-800 font-bold mb-2 outline-none">Premium PDF Content</h4>
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-blue-700 leading-relaxed">Secure your copy instantly.</p>
                    <span className="text-xl font-black text-blue-900">
                      ₹{config.title.includes('Complete') ? '999' : config.title.includes('Biology') ? '699' : config.title.includes('Chemistry') ? '499' : '349'}
                    </span>
                 </div>
                 <button onClick={() => { onClose(); setTimeout(() => onAction('Enroll in ' + config.title, 'payment'), 150); }} className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 shadow-sm transition">Buy Now</button>
              </div>
            )}
         </div>
      )}

      {config.type === 'pdf_viewer' && (
         <div className="space-y-4">
            <div className="aspect-[1/1.414] bg-gray-900 rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden group">
               <img src="https://picsum.photos/seed/document/800/1131" className="absolute inset-0 w-full h-full object-cover opacity-20" />
               <FileJson className="w-16 h-16 text-blue-400 mb-4 relative z-10" />
               <h3 className="text-white font-bold text-xl relative z-10 text-center mb-2 text-balance">{config.title.replace(' Viewer', '')}</h3>
               <p className="text-gray-300 text-sm relative z-10 text-center">Page 1 of 450</p>
               <button className="mt-6 bg-white text-gray-900 px-6 py-2 rounded-full font-bold relative z-10 hover:bg-gray-100 cursor-pointer">Download PDF</button>
            </div>
         </div>
      )}

      {config.type === 'dashboard' && (
           <div className="space-y-4">
             <div className="aspect-video bg-gray-900 rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                <img src="https://picsum.photos/seed/biology/800/400" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <PlayCircle className="w-12 h-12 text-blue-400 mb-2 relative z-10" />
                <p className="text-white font-medium relative z-10 text-center">Resume Learning: {config.title.replace(' Dashboard', '')}</p>
             </div>
             <div className="bg-gray-50 rounded-xl p-4 mt-2">
                 <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Your Modules</h4>
                 <ul className="space-y-2">
                    <li onClick={() => onAction('Lecture Video Simulated', 'video')} className="p-3 bg-white border border-gray-100 rounded-lg flex justify-between items-center cursor-pointer hover:border-blue-300 hover:shadow-sm transition">
                        <span className="text-sm font-semibold text-gray-700">1. Anatomy & Physiology</span> 
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                    </li>
                    <li onClick={() => onAction('Lecture Video Simulated', 'video')} className="p-3 bg-white border border-gray-100 rounded-lg flex justify-between items-center cursor-pointer hover:border-blue-300 hover:shadow-sm transition">
                        <span className="text-sm font-semibold text-gray-700">2. Plant Biology</span> 
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                    </li>
                    <li onClick={() => onAction('Simulated Mock Test', 'info')} className="p-3 bg-white border border-gray-100 rounded-lg flex justify-between items-center cursor-pointer hover:border-blue-300 hover:shadow-sm transition">
                        <span className="text-sm font-semibold text-gray-700">Unit Test 1</span> 
                        <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded">Pending</span>
                    </li>
                 </ul>
             </div>
           </div>
        )}

        {config.type === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 text-center">{config.title}</h4>
                <p className="text-gray-500 text-center text-sm">Thank you for your purchase. You can now access all your materials.</p>
                <div className="w-full pt-4">
                  <button onClick={onClose} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-sm">Go to Dashboard</button>
                </div>
            </div>
        )}

        {config.type === 'bio' && (
           <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto overflow-hidden border-4 border-white shadow-lg">
                <img src={`https://ui-avatars.com/api/?name=${config.title.replace(' Bio', '')}&background=random&size=128`} alt="Faculty" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{config.title.replace(' Bio', '')}</h4>
              <p className="text-blue-600 font-bold">Senior AIIMS Faculty Member</p>
              <p className="text-gray-600 text-sm leading-relaxed px-4">With immense passion and years of teaching experience, they have helped thousands of students secure top ranks in medical entrance exams. Their teaching methodology specifically focuses on NCERT decoding and rigorous practice.</p>
              <div className="flex justify-center gap-8 py-4 border-t border-gray-100">
                  <div className="text-center">
                     <span className="block font-extrabold text-2xl text-gray-900">50k+</span>
                     <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Students</span>
                  </div>
                  <div className="text-center">
                     <span className="block font-extrabold text-2xl text-gray-900">4.9</span>
                     <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Rating</span>
                  </div>
              </div>
              <button onClick={onClose} className="w-full font-bold bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition">Close Bio</button>
           </div>
        )}

        {['info', 'link', 'list', 'pricing'].includes(config.type) && (
          <div>
            <p className="text-gray-600 mb-6">This feature is currently simulated. In a real application, this would navigate to the relevant page or open a detailed view.</p>
            <button onClick={onClose} className="w-full bg-gray-100 text-gray-800 font-bold py-2.5 rounded-lg hover:bg-gray-200">Close</button>
          </div>
        )}

      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '' });
  const [user, setUser] = useState<User | null>(null);
  const [purchasedBatches, setPurchasedBatches] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const batches = await ensureUserDocument(currentUser);
          setPurchasedBatches(batches);
        } catch(e) {
          console.error("Error fetching user data:", e);
        }
      } else {
        setPurchasedBatches([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAction = (title: string, type: string = 'info') => {
    if (type === 'pricing') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (type === 'list' && title.includes('Faculty')) {
      document.getElementById('faculty')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (type === 'link' || type === 'info') {
      // Basic simulation, we will still show modal
    }
    setModalConfig({ isOpen: true, title, type });
  };

  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailAuth = async (mode: 'login' | 'register', email: string, pass: string) => {
    try {
      if (mode === 'login') {
        await loginWithEmail(email, pass);
      } else {
        await registerWithEmail(email, pass);
      }
      closeModal();
    } catch (err: any) {
      alert("Auth Error: " + err.message);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
      alert("Password reset email sent via SMTP! Please check your inbox.");
      closeModal();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar onAction={handleAction} user={user} onLogout={logout} />
      <main>
        <Hero onAction={handleAction} />
        <Stats />
        <Pricing onAction={handleAction} purchasedBatches={purchasedBatches} />
        <Offerings onAction={handleAction} />
        <Features onAction={handleAction} />
        <Faculty onAction={handleAction} />
        <CTA onAction={handleAction} />
      </main>
      <Footer onAction={handleAction} />

      <AnimatePresence>
        {modalConfig.isOpen && (
          <Modal config={modalConfig} onClose={closeModal} onGoogleSignIn={handleGoogleSignIn} onPaymentSuccess={async (b) => { 
        if (user) {
          try {
            await addPurchasedBatchToDB(user.uid, b);
          } catch(e) {
            console.error("Failed to save to db:", e);
          }
        }
        setPurchasedBatches(prev => [...prev, b]); 
        closeModal(); 
        handleAction('Payment Successful for ' + b, 'success'); 
      }} purchasedBatches={purchasedBatches} onAction={handleAction} onEmailAuth={handleEmailAuth} onResetPassword={handleResetPassword} />
        )}
      </AnimatePresence>
    </div>
  );
}

