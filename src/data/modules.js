export const MODULE_KEYS = ['CAR_RENTAL', 'CAR_SALES', 'BUY_A_CAR', 'SELL_YOUR_CAR'];

export const MODULE_STATUSES = ['ACTIVE', 'COMING_SOON', 'HIDDEN', 'DRAFT'];

export const MODULE_DEFINITIONS = {
  CAR_RENTAL: {
    key: 'CAR_RENTAL',
    label: 'Car Rental',
    publicPath: '/rental',
    navLabel: 'Car Rental',
    leadType: 'RENTAL',
    dashboardPath: '/dashboard/car-rental',
    description: 'Daily, weekly and monthly rental fleet.',
  },
  CAR_SALES: {
    key: 'CAR_SALES',
    label: 'Car Sales',
    publicPath: '/car-sales',
    navLabel: 'Cars for Sale',
    leadType: 'CAR_SALES',
    dashboardPath: '/dashboard/car-sales',
    description: 'Curated pre-owned and new vehicles for sale.',
  },
  BUY_A_CAR: {
    key: 'BUY_A_CAR',
    label: 'Buy a Car',
    publicPath: '/buy-a-car',
    navLabel: 'Buy a Car',
    leadType: 'BUY_CAR',
    dashboardPath: '/dashboard/car-sales',
    description: 'Buyer enquiries and vehicle sourcing requests.',
  },
  SELL_YOUR_CAR: {
    key: 'SELL_YOUR_CAR',
    label: 'Sell Your Car',
    publicPath: '/sell-your-car',
    navLabel: 'Sell Your Car',
    leadType: 'SELL_CAR',
    dashboardPath: '/dashboard/car-sales',
    description: 'Owner valuations and vehicle acquisition requests.',
  },
};

export const DEFAULT_MODULES = {
  CAR_RENTAL: {
    status: 'COMING_SOON',
    headline: 'Car rental, done properly.',
    description:
      'Our rental fleet is in preparation. Register your interest and the team will contact you as soon as vehicles are available.',
    image: '/assets/images/gallery/workshop-lift.jpg',
    launchDate: '',
  },
  CAR_SALES: {
    status: 'COMING_SOON',
    headline: 'Curated cars, ready for Dubai roads.',
    description:
      'A handled selection of vehicles for sale is on the way. Tell us what you are looking for and we will keep you informed.',
    image: '/assets/images/gallery/ceramic-coating.jpg',
    launchDate: '',
  },
  BUY_A_CAR: {
    status: 'COMING_SOON',
    headline: 'Find your next car with confidence.',
    description:
      'Buyer requests are opening soon. Share your requirements now and our team will follow up when the module goes live.',
    image: '/assets/images/gallery/brake-service.jpg',
    launchDate: '',
  },
  SELL_YOUR_CAR: {
    status: 'COMING_SOON',
    headline: 'Sell your car without the runaround.',
    description:
      'Owner valuations are opening soon. Send your vehicle details and we will be in touch when the module launches.',
    image: '/assets/images/hero/workshop.jpg',
    launchDate: '',
  },
};
