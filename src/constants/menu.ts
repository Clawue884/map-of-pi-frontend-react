export const menu = {
  Languages: {
    id: 1,
    title: 'Languages',
    icon: `/images/shared/sidebar/language.svg`,
    url: '',
    children: [
      {
        id: 1,
        code: 'en',
        label: 'EN/US',
        title: 'American English',
        translation: 'English',
        icon: '/images/shared/language/en_us.svg',
      },
      {
        id: 2,
        code: 'en-GB',
        label: 'EN/GB',
        title: 'British English',
        translation: 'English',
        icon: '/images/shared/language/en_gb.svg',
      },
      {
        id: 3,
        code: 'es',
        label: 'ES',
        title: 'Spanish',
        translation: 'Español',
        icon: '/images/shared/language/es.svg',
      },
      {
        id: 4,
        code: 'ar',
        label: 'AR',
        title: 'Arabic',
        translation: 'العربية',
        icon: '/images/shared/language/ar.svg',
      },
      {
        id: 5,
        code: 'ko',
        label: 'KO',
        title: 'Korean',
        translation: '한국어',
        icon: '/images/shared/language/ko.svg',
      },
      {
        id: 6,
        code: 'hau-NG',
        label: 'NG/HAU',
        title: 'Nigerian Hausa',
        translation: 'Hausa',
        icon: '/images/shared/language/ng.svg',
      },
      {
        id: 7,
        code: 'ewe-BJ',
        label: 'BJ/EWE',
        title: 'Benin Ewe',
        translation: 'Ewe',
        icon: '/images/shared/language/bj.svg',
      }
    ],
  },
  
  about: {
    id: 2,
    title: 'About Map of Pi',
    icon: `/images/shared/sidebar/info.svg`,
    url: '',
    children: [
      {
        id: 1,
        title: 'App Version',
        icon: '',
        code: 'version',
      },
      {
        id: 2,
        title: 'Privacy Policy',
        icon: '',
        code: 'privacy-policy',
      },
      {
        id: 3,
        title: 'Terms of Service',
        icon: '',
        code: 'tos',
      },
    ],
  },
};
