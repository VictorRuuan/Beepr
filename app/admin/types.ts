import { Ionicons } from '@expo/vector-icons';

export type IconName = keyof typeof Ionicons.glyphMap;

export type SectionKey =
  | 'dashboard'
  | 'analytics'
  | 'customers'
  | 'providers'
  | 'dispensaries'
  | 'businessApplications'
  | 'brandApplications'
  | 'products'
  | 'productCatalog'
  | 'categories'
  | 'productCategories'
  | 'reviews'
  | 'reviewModeration'
  | 'questions'
  | 'faqs'
  | 'compliance'
  | 'reports'
  | 'moderation'
  | 'geoFencing'
  | 'settings';

export type NavItem = {
  key: SectionKey;
  label: string;
  icon: IconName;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type OverviewCard = {
  label: string;
  value: string;
  hint: string;
  icon: IconName;
};

export type CustomerRow = {
  initials: string;
  tone: string;
  userId: string;
  email: string;
  firstName: string;
  medicalCard: string;
  joined: string;
};

export type BusinessRow = {
  business: string;
  email: string;
  contact: string;
  phone: string;
  type: string;
  status: string;
  submitted: string;
};

export type PlaceholderContent = {
  title: string;
  subtitle: string;
  icon: IconName;
};
