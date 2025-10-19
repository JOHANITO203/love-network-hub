export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export const countries: Country[] = [
  { code: 'RU', name: 'Russie', flag: '🇷🇺', dialCode: '+7' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', dialCode: '+49' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', dialCode: '+44' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', dialCode: '+1' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', dialCode: '+34' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', dialCode: '+39' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', dialCode: '+32' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', dialCode: '+41' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', dialCode: '+31' },
  { code: 'SE', name: 'Suède', flag: '🇸🇪', dialCode: '+46' },
  { code: 'NO', name: 'Norvège', flag: '🇳🇴', dialCode: '+47' },
  { code: 'DK', name: 'Danemark', flag: '🇩🇰', dialCode: '+45' },
  { code: 'FI', name: 'Finlande', flag: '🇫🇮', dialCode: '+358' },
  { code: 'PL', name: 'Pologne', flag: '🇵🇱', dialCode: '+48' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380' },
  { code: 'BY', name: 'Biélorussie', flag: '🇧🇾', dialCode: '+375' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7' },
  { code: 'GE', name: 'Géorgie', flag: '🇬🇪', dialCode: '+995' },
  { code: 'AM', name: 'Arménie', flag: '🇦🇲', dialCode: '+374' },
  { code: 'AZ', name: 'Azerbaïdjan', flag: '🇦🇿', dialCode: '+994' },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷', dialCode: '+90' },
  { code: 'GR', name: 'Grèce', flag: '🇬🇷', dialCode: '+30' },
  { code: 'CZ', name: 'République tchèque', flag: '🇨🇿', dialCode: '+420' },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹', dialCode: '+43' },
  { code: 'HU', name: 'Hongrie', flag: '🇭🇺', dialCode: '+36' },
  { code: 'RO', name: 'Roumanie', flag: '🇷🇴', dialCode: '+40' },
  { code: 'BG', name: 'Bulgarie', flag: '🇧🇬', dialCode: '+359' },
  { code: 'RS', name: 'Serbie', flag: '🇷🇸', dialCode: '+381' },
  { code: 'HR', name: 'Croatie', flag: '🇭🇷', dialCode: '+385' },
  { code: 'SI', name: 'Slovénie', flag: '🇸🇮', dialCode: '+386' },
  { code: 'SK', name: 'Slovaquie', flag: '🇸🇰', dialCode: '+421' },
  { code: 'LT', name: 'Lituanie', flag: '🇱🇹', dialCode: '+370' },
  { code: 'LV', name: 'Lettonie', flag: '🇱🇻', dialCode: '+371' },
  { code: 'EE', name: 'Estonie', flag: '🇪🇪', dialCode: '+372' },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪', dialCode: '+353' },
  { code: 'IL', name: 'Israël', flag: '🇮🇱', dialCode: '+972' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', dialCode: '+61' },
  { code: 'NZ', name: 'Nouvelle-Zélande', flag: '🇳🇿', dialCode: '+64' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', dialCode: '+81' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷', dialCode: '+82' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳', dialCode: '+86' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', dialCode: '+91' },
  { code: 'TH', name: 'Thaïlande', flag: '🇹🇭', dialCode: '+66' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷', dialCode: '+54' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽', dialCode: '+52' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', dialCode: '+27' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', dialCode: '+20' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', dialCode: '+212' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', dialCode: '+213' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', dialCode: '+216' },
  { code: 'AE', name: 'Émirats arabes unis', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SA', name: 'Arabie saoudite', flag: '🇸🇦', dialCode: '+966' },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(c => c.code === code);
};

export const getCountryFlag = (code: string): string => {
  const country = getCountryByCode(code);
  return country?.flag || '🌍';
};

export const getCountryName = (code: string): string => {
  const country = getCountryByCode(code);
  return country?.name || code;
};
