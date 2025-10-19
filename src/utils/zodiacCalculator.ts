export interface ZodiacSign {
  value: string;
  label: string;
  symbol: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

export const zodiacSigns: ZodiacSign[] = [
  { value: 'aries', label: 'Bélier', symbol: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { value: 'taurus', label: 'Taureau', symbol: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { value: 'gemini', label: 'Gémeaux', symbol: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { value: 'cancer', label: 'Cancer', symbol: '♋', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { value: 'leo', label: 'Lion', symbol: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { value: 'virgo', label: 'Vierge', symbol: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { value: 'libra', label: 'Balance', symbol: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { value: 'scorpio', label: 'Scorpion', symbol: '♏', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { value: 'sagittarius', label: 'Sagittaire', symbol: '♐', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { value: 'capricorn', label: 'Capricorne', symbol: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { value: 'aquarius', label: 'Verseau', symbol: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { value: 'pisces', label: 'Poissons', symbol: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
];

export const calculateZodiacSign = (date: Date): string => {
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();

  for (const sign of zodiacSigns) {
    // Handle signs that span across year boundary (Capricorn)
    if (sign.startMonth > sign.endMonth) {
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      ) {
        return sign.value;
      }
    } else {
      // Normal signs
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay) ||
        (month > sign.startMonth && month < sign.endMonth)
      ) {
        return sign.value;
      }
    }
  }

  return '';
};

export const getZodiacSignInfo = (value: string): ZodiacSign | undefined => {
  return zodiacSigns.find((sign) => sign.value === value);
};

export const getZodiacSymbol = (value: string): string => {
  const sign = getZodiacSignInfo(value);
  return sign?.symbol || '';
};

export const getZodiacLabel = (value: string): string => {
  const sign = getZodiacSignInfo(value);
  return sign?.label || '';
};

export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};
