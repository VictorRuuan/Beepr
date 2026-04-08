import {
  BusinessRow,
  CustomerRow,
  NavSection,
  OverviewCard,
  PlaceholderContent,
  SectionKey,
} from './types';

export const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
      { key: 'analytics', label: 'Review & Analytics', icon: 'pulse-outline' },
    ],
  },
  {
    title: "Customer's",
    items: [
      { key: 'customers', label: 'Customer Management', icon: 'people-outline' },
      { key: 'providers', label: 'Providers', icon: 'storefront-outline' },
      { key: 'dispensaries', label: 'Dispensary Management', icon: 'business-outline' },
    ],
  },
  {
    title: 'Applications',
    items: [
      { key: 'businessApplications', label: 'Business Applications', icon: 'document-text-outline' },
      { key: 'brandApplications', label: 'Brand Applications', icon: 'pricetags-outline' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { key: 'products', label: 'Products', icon: 'cube-outline' },
      { key: 'productCatalog', label: 'Product Catalog', icon: 'albums-outline' },
      { key: 'categories', label: 'Categories', icon: 'layers-outline' },
      { key: 'productCategories', label: 'Product Categories', icon: 'copy-outline' },
    ],
  },
  {
    title: 'Trust',
    items: [
      { key: 'reviews', label: 'Reviews', icon: 'chatbubble-ellipses-outline' },
      { key: 'reviewModeration', label: 'Review Moderation', icon: 'shield-checkmark-outline' },
      { key: 'questions', label: 'Questions', icon: 'help-circle-outline' },
      { key: 'faqs', label: 'FAQs', icon: 'information-circle-outline' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { key: 'compliance', label: 'Compliance', icon: 'ribbon-outline' },
      { key: 'reports', label: 'Reports', icon: 'bar-chart-outline' },
      { key: 'moderation', label: 'Moderation', icon: 'eye-outline' },
      { key: 'geoFencing', label: 'Geo-Fencing', icon: 'locate-outline' },
      { key: 'settings', label: 'Settings', icon: 'settings-outline' },
    ],
  },
];

export const customerRows: CustomerRow[] = [
  {
    initials: 'KE',
    tone: '#ef4444',
    userId: 'b4f1ca41...',
    email: 'kendleowens@gmail.com',
    firstName: 'Kendle',
    medicalCard: 'No',
    joined: '2/9/2026',
  },
  {
    initials: 'DR',
    tone: '#0ea5e9',
    userId: '0cdeaebd...',
    email: 'dave1.rcp@gmail.com',
    firstName: 'Not set',
    medicalCard: 'No',
    joined: '2/9/2026',
  },
];

export const businessRows: BusinessRow[] = [
  {
    business: "Ryder's Test Business",
    email: 'testing.beepr@gmail.com',
    contact: 'Ryder Spradlin',
    phone: '(916) 202-0309',
    type: 'Storefront',
    status: 'Approved',
    submitted: '11/22/2025',
  },
  {
    business: 'Goldenhour Collective',
    email: 'haylee@goldenhourcollective.org',
    contact: 'Haylee Parker',
    phone: '9162478325',
    type: 'Storefront',
    status: 'Approved',
    submitted: '10/13/2025',
  },
];

export const overviewCards: OverviewCard[] = [
  { label: 'Total Customers', value: '2', hint: 'Accounts from the app', icon: 'people-outline' },
  { label: 'Business Apps', value: '2', hint: 'Ready for review', icon: 'document-text-outline' },
  { label: 'Brand Apps', value: '0', hint: 'No pending queue', icon: 'pricetags-outline' },
  { label: 'Reviews Pending', value: '4', hint: 'Need moderation', icon: 'chatbubble-outline' },
];

export const placeholderContent: Record<
  Exclude<SectionKey, 'dashboard' | 'customers' | 'businessApplications' | 'brandApplications'>,
  PlaceholderContent
> = {
  analytics: {
    title: 'Review & Analytics',
    subtitle: 'Analytics widgets and reports can be added here next.',
    icon: 'pulse-outline',
  },
  providers: {
    title: 'Providers',
    subtitle: 'Manage provider accounts and access levels from this section.',
    icon: 'storefront-outline',
  },
  dispensaries: {
    title: 'Dispensary Management',
    subtitle: 'Track storefront approvals, status changes and compliance data.',
    icon: 'business-outline',
  },
  products: {
    title: 'Products',
    subtitle: 'Product moderation and lifecycle tools can live in this panel.',
    icon: 'cube-outline',
  },
  productCatalog: {
    title: 'Product Catalog',
    subtitle: 'Use this area for your full catalog browsing and bulk actions.',
    icon: 'albums-outline',
  },
  categories: {
    title: 'Categories',
    subtitle: 'Organize top-level catalog categories here.',
    icon: 'layers-outline',
  },
  productCategories: {
    title: 'Product Categories',
    subtitle: 'Map products into category groups with the same admin visual style.',
    icon: 'copy-outline',
  },
  reviews: {
    title: 'Reviews',
    subtitle: 'Review feed, customer sentiment, and moderation shortcuts can appear here.',
    icon: 'chatbubble-ellipses-outline',
  },
  reviewModeration: {
    title: 'Review Moderation',
    subtitle: 'Approve, reject, or flag reviews from a dedicated moderation queue.',
    icon: 'shield-checkmark-outline',
  },
  questions: {
    title: 'Questions',
    subtitle: 'Customer Q&A tools can be added here as you send more references.',
    icon: 'help-circle-outline',
  },
  faqs: {
    title: 'FAQs',
    subtitle: 'Publish and manage FAQ entries in this section.',
    icon: 'information-circle-outline',
  },
  compliance: {
    title: 'Compliance',
    subtitle: 'Legal, jurisdiction and policy monitoring can live here.',
    icon: 'ribbon-outline',
  },
  reports: {
    title: 'Reports',
    subtitle: 'Metrics dashboards and export tools fit naturally in this panel.',
    icon: 'bar-chart-outline',
  },
  moderation: {
    title: 'Moderation',
    subtitle: 'Centralize flags, approvals and safety tooling in this module.',
    icon: 'eye-outline',
  },
  geoFencing: {
    title: 'Geo-Fencing',
    subtitle: 'Location-based controls and restricted areas can be managed here.',
    icon: 'locate-outline',
  },
  settings: {
    title: 'Settings',
    subtitle: 'System configuration and admin preferences can be adjusted here.',
    icon: 'settings-outline',
  },
};

export function isSectionKey(value: unknown): value is SectionKey {
  return (
    typeof value === 'string' &&
    navSections.some((section) => section.items.some((item) => item.key === value))
  );
}
