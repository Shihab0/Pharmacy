import React from 'react';
import {
  Stethoscope,
  ShieldCheck,
  PhoneCall,
  Clock,
  MapPin,
  CheckCircle2,
  Lock,
  LogIn,
  Sparkles,
  Pill,
  Syringe,
  Wheat,
  HeartPulse,
  Award,
  Users
} from 'lucide-react';
import { Product } from '../../types';

interface ShopLandingPageProps {
  onLoginClick: () => void;
  products: Product[];
}

export const ShopLandingPage: React.FC<ShopLandingPageProps> = ({
  onLoginClick,
  products
}) => {
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="w-full bg-slate-900 text-slate-100 overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>আধুনিক পশুপাখি চিকিৎসা ও ডিজিটাল ফার্মেসি কেন্দ্র</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            এগ্রোভেট <span className="text-emerald-400">ফার্মেসি</span> ও চিকিৎসা সেবা
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            খামারীদের বিশ্বস্ত প্রতিষ্ঠান। এখানে রেজিস্টার্ড কোম্পানীর গুণগত মানসম্পন্ন ভেটেরিনারি ওষুধ, কোল্ড-চেইন সংরক্ষিত ভ্যাকসিন, ভিটামিন সাপ্লিমেন্ট এবং সরাসরি পশু চিকিৎসকের মাধ্যমে আধুনিক চিকিৎসা সেবা প্রদান করা হয়।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-900/40 transition active:scale-95 text-sm sm:text-base border border-emerald-400/30"
            >
              <LogIn className="w-5 h-5" />
              <span>স্টাফ / এডমিন লগইন ও ড্যাশবোর্ড</span>
            </button>

            <a
              href="tel:01700000000"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-3.5 rounded-2xl transition text-sm sm:text-base border border-slate-700"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>জরুরী হটলাইন: ০১৭০০-০০০০০০</span>
            </a>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl text-center">
            <Pill className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="font-bold text-sm text-white">১০০% আসল ওষুধ</div>
            <div className="text-[11px] text-slate-400">রেজিস্টার্ড কোম্পানি</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl text-center">
            <Syringe className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            <div className="font-bold text-sm text-white">কোল্ড-চেইন ভ্যাকসিন</div>
            <div className="text-[11px] text-slate-400">তাপমাত্রা নিয়ন্ত্রিত</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl text-center">
            <Stethoscope className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="font-bold text-sm text-white">পশু চিকিৎসক সেবা</div>
            <div className="text-[11px] text-slate-400">অন-কল পরামর্শ</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl text-center">
            <Wheat className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="font-bold text-sm text-white">মানসম্মত ফিড</div>
            <div className="text-[11px] text-slate-400">ক্যাটল ও পোল্ট্রি</div>
          </div>
        </div>
      </section>


      {/* Services & Doctors Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">আমাদের সেবাসমূহ</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">খামারি ও ডেইরি ফার্মের সেবা সমাধান</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">জরুরী চিকিৎসা ও ডক্টর ভিসিট</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              গরু, ছাগল ও হাঁস-মুরগির যে কোনো জটিল রোগে অভিজ্ঞ ভেটেরিনারি টেকনিশিয়ান ও চিকিৎসকের মাধ্যমে খামারে গিয়ে চিকিৎসা প্রদান।
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Syringe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">ভ্যাকসিনেশন শেডিউল</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              তড়কা, ক্ষুরারোগ (FMD), পিপিআর (PPR) এবং রানীক্ষেত রোগের সঠিক তাপমাত্রায় সংরক্ষিত ভ্যাকসিন প্রদান ও পরামর্শ।
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">ডিজিটাল মেমো ও হিসেব নিকেশ</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              খামারিদের জন্য অটোমেটিক কম্পিউটারাইজড মেমো, বাকির খাতা এবং দ্রুত ক্যাশ কাউন্টার বিক্রয় সুবিধা।
            </p>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 px-4 text-center text-xs space-y-4">
        <div className="flex flex-wrap justify-center gap-6 text-slate-300 font-medium">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> বাজার রোড, উপজেলা মোড়</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> প্রতিদিন সকাল ৮:০০ - রাত ১০:০০</span>
          <span className="flex items-center gap-1.5"><PhoneCall className="w-4 h-4 text-emerald-400" /> হটলাইন: ০১৭০০-০০০০০০</span>
        </div>
        <p className="text-slate-500">
          © {new Date().getFullYear()} এগ্রোভেট ফার্মেসি ও চিকিৎসা কেন্দ্র। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </footer>
    </div>
  );
};
