import React from 'react';
import { ChevronDown, ChevronUp, Trash2, GripVertical } from 'lucide-react';

export const CURRENCIES = ['USD', 'KES', 'EUR', 'GBP'];
export const CATEGORIES = [
  'Luxury Safari','Beach Holiday','Cultural Experience','Adventure',
  'Family','Honeymoon','Corporate','Educational','Conservation',
  'Private Expedition','Photography','Research',
];
export const PROPERTY_TYPES = [
  'Luxury Lodge','Safari Camp','Tented Camp','Boutique Hotel',
  'Villa','Resort','Private Camp','Eco Lodge',
];
export const DIFFICULTIES = ['Easy','Moderate','Challenging','Strenuous'];
export const TRAVEL_STYLES = ['Private','Couple','Family','Group','Solo'];
export const MEAL_OPTIONS = ['Breakfast','Lunch','Dinner','All Inclusive','Self Catering'];

export const TRAVEL_TYPES = [
  { value: 'experience', label: '01 · Experience (4–12h Day Escape)', durationHint: 'e.g. 12 Hours' },
  { value: 'journey',    label: '02 · Journey (Safari & Bespoke Multi-Day)', durationHint: 'e.g. 5 Days 4 Nights' },
  { value: 'worldwide',  label: '03 · Worldwide (Global Curated Collection)', durationHint: 'e.g. 7 Days 6 Nights' },
];

export const EMPTY_FORM = {
  title:'', subtitle:'', slug:'', travelType:'journey', destinationRef:'', destination:'', country:'', region:'',
  description:'', fullDescription:'', category:'Luxury Safari',
  duration:'', nights:'', minTravelers:1, maxTravelers:20,
  difficulty:'Easy', travelStyle:'Private', bestSeason:'',
  price:'', currency:'USD', priceType:'per_person', displayPrice:'',
  pricingRules:[],
  tag:'', image:null, gallery:[], videoUrl:'', status:'draft', featured:false,
  seoTitle:'', seoDescription:'', seoKeywords:'', seoSlug:'',
  highlights:[],
  itinerary:[],
  accommodationOptions:[],
  experienceOptions:[],
  transportOptions:[],
  inclusions:[], exclusions:[],
  bestTimeToVisit:'', whatToPack:'', travelRequirements:'',
  healthSafety:'', cancellationPolicy:'', importantNotes:'',
  bookingType:'enquiry', requiresApproval:true, availability:'On Request',
  onlinePayment:false,
  notes:'',
  faq:[],
};

export const INPUT    = 'w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/40 focus:bg-white transition-all';
export const LABEL    = 'text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1.5 block';
export const TEXTAREA = 'w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/40 focus:bg-white transition-all resize-none';

export const SectionHeader = ({ icon, title, subtitle, count, open, onToggle, action }) => (
  <div className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer" onClick={onToggle}>
    <div className="flex items-center gap-3">
      {icon && <span className="text-base">{icon}</span>}
      <div>
        <p className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${count > 0 ? 'bg-accent/15 text-accent' : 'bg-gray-100 text-gray-400'}`}>
              {count}
            </span>
          )}
        </p>
        {subtitle && <p className="text-[11px] text-gray-400 mt-0.5 font-normal">{subtitle}</p>}
      </div>
    </div>
    <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
      {action}
      <span className="pointer-events-none">
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </span>
    </div>
  </div>
);

export const RemoveBtn = ({ onClick }) => (
  <button type="button" onClick={onClick}
    className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1">
    <Trash2 size={13} />
  </button>
);

export const DragHandle = () => (
  <span className="cursor-grab text-gray-300 hover:text-gray-500 flex-shrink-0">
    <GripVertical size={14} />
  </span>
);

export const AddBtn = ({ onClick, label }) => (
  <button type="button" onClick={onClick}
    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent hover:text-primary transition-colors border border-accent/30 hover:border-primary/30 px-3 py-1.5 rounded-lg whitespace-nowrap">
    + {label}
  </button>
);
