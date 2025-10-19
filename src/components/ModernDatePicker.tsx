import { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DateInfo {
  date: Date | null;
  age: number | null;
  zodiacSign: string;
}

interface ModernDatePickerProps {
  value?: Date | null;
  onChange: (info: DateInfo) => void;
  className?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  minAge?: number;
  maxAge?: number;
}

const MONTHS = [
  { value: 1, name: 'Janvier', short: 'Jan' },
  { value: 2, name: 'Février', short: 'Fév' },
  { value: 3, name: 'Mars', short: 'Mar' },
  { value: 4, name: 'Avril', short: 'Avr' },
  { value: 5, name: 'Mai', short: 'Mai' },
  { value: 6, name: 'Juin', short: 'Jun' },
  { value: 7, name: 'Juillet', short: 'Jul' },
  { value: 8, name: 'Août', short: 'Aoû' },
  { value: 9, name: 'Septembre', short: 'Sep' },
  { value: 10, name: 'Octobre', short: 'Oct' },
  { value: 11, name: 'Novembre', short: 'Nov' },
  { value: 12, name: 'Décembre', short: 'Déc' },
];

const ZODIAC_SIGNS = {
  'bélier': { emoji: '♈', period: 'Mar 21 - Avr 19' },
  'taureau': { emoji: '♉', period: 'Avr 20 - Mai 20' },
  'gémeaux': { emoji: '♊', period: 'Mai 21 - Jun 20' },
  'cancer': { emoji: '♋', period: 'Jun 21 - Jul 22' },
  'lion': { emoji: '♌', period: 'Jul 23 - Aoû 22' },
  'vierge': { emoji: '♍', period: 'Aoû 23 - Sep 22' },
  'balance': { emoji: '♎', period: 'Sep 23 - Oct 22' },
  'scorpion': { emoji: '♏', period: 'Oct 23 - Nov 21' },
  'sagittaire': { emoji: '♐', period: 'Nov 22 - Déc 21' },
  'capricorne': { emoji: '♑', period: 'Déc 22 - Jan 19' },
  'verseau': { emoji: '♒', period: 'Jan 20 - Fév 18' },
  'poissons': { emoji: '♓', period: 'Fév 19 - Mar 20' },
};

export const ModernDatePicker = ({
  value,
  onChange,
  className,
  error,
  label = "Date d'anniversaire",
  placeholder = "Sélectionnez votre date de naissance",
  minAge = 18,
  maxAge = 80
}: ModernDatePickerProps) => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [age, setAge] = useState<number | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string>('');
  const lastEmittedRef = useRef<string>('');
  const isHydratingRef = useRef(false);

  // Generate years array (from current year - maxAge to current year - minAge)
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - maxAge;
  const endYear = currentYear - minAge;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);

  // Generate days array based on selected month and year
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const days = month && year
    ? Array.from({ length: getDaysInMonth(parseInt(month), parseInt(year)) }, (_, i) => i + 1)
    : Array.from({ length: 31 }, (_, i) => i + 1);

  // Calculate age from date
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Get zodiac sign from date
  const getZodiacSign = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'bélier';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taureau';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gémeaux';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'lion';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'vierge';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'balance';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpion';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittaire';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorne';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'verseau';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'poissons';

    return '';
  };

  // Initialize from value
  useEffect(() => {
    isHydratingRef.current = true;

    if (value) {
      const derivedAge = calculateAge(value);
      const derivedZodiac = getZodiacSign(value);

      setDay(value.getDate().toString());
      setMonth((value.getMonth() + 1).toString());
      setYear(value.getFullYear().toString());
      setAge(derivedAge);
      setZodiacSign(derivedZodiac);
      lastEmittedRef.current = `${value.toISOString()}|${derivedAge}|${derivedZodiac}`;
    } else {
      setDay('');
      setMonth('');
      setYear('');
      setAge(null);
      setZodiacSign('');
      lastEmittedRef.current = 'null';
    }
  }, [value]);

  // Update date when day, month, or year changes
  useEffect(() => {
    if (isHydratingRef.current) {
      isHydratingRef.current = false;
      return;
    }

    try {
      const hasDay = day !== '';
      const hasMonth = month !== '';
      const hasYear = year !== '';
      const hasAllParts = hasDay && hasMonth && hasYear;
      const hasNoParts = !hasDay && !hasMonth && !hasYear;

      if (hasAllParts) {
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);

        if (Number.isNaN(dayNum) || Number.isNaN(monthNum) || Number.isNaN(yearNum)) {
          return;
        }

        const selectedDate = new Date(yearNum, monthNum - 1, dayNum);
        const isValidDate =
          selectedDate.getDate() === dayNum &&
          selectedDate.getMonth() === monthNum - 1 &&
          selectedDate.getFullYear() === yearNum;

        if (isValidDate) {
          const calculatedAge = calculateAge(selectedDate);
          const sign = getZodiacSign(selectedDate);
          const emissionKey = `${selectedDate.toISOString()}|${calculatedAge}|${sign}`;

          setAge(calculatedAge);
          setZodiacSign(sign);

          if (lastEmittedRef.current !== emissionKey) {
            onChange({
              date: selectedDate,
              age: calculatedAge,
              zodiacSign: sign
            });
            lastEmittedRef.current = emissionKey;
          }
          return;
        }
      }

      // Incomplete or invalid date
      setAge(null);
      setZodiacSign('');

      if (hasNoParts) {
        if (lastEmittedRef.current !== 'null') {
          onChange({ date: null, age: null, zodiacSign: '' });
          lastEmittedRef.current = 'null';
        }
      }
    } catch (error) {
      console.error('Error updating date:', error);
      setAge(null);
      setZodiacSign('');

      if (lastEmittedRef.current !== 'null') {
        onChange({ date: null, age: null, zodiacSign: '' });
        lastEmittedRef.current = 'null';
      }
    }
  }, [day, month, year, onChange]);

  // Validate if selected day exists in the selected month/year
  const isValidDay = (dayValue: string) => {
    if (!month || !year) return true;
    const maxDays = getDaysInMonth(parseInt(month), parseInt(year));
    return parseInt(dayValue) <= maxDays;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label */}
      {label && (
        <Label className="text-base font-medium flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          {label}
        </Label>
      )}

      {/* Date Selectors */}
      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {/* Day Selector */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Jour</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger className={cn(
                  "h-12 text-base",
                  day && !isValidDay(day) && "border-red-500"
                )}>
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {days.map((dayNum) => (
                    <SelectItem
                      key={dayNum}
                      value={dayNum.toString()}
                      disabled={!isValidDay(dayNum.toString())}
                    >
                      {dayNum.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Month Selector */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Mois</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((monthData) => (
                    <SelectItem key={monthData.value} value={monthData.value.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{monthData.short}</span>
                        <span className="text-muted-foreground text-sm">{monthData.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Selector */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Année</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="----" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {years.map((yearNum) => (
                    <SelectItem key={yearNum} value={yearNum.toString()}>
                      {yearNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview Section */}
          {(day || month || year) && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {day && month && year ? (
                    <>
                      <p className="text-sm text-muted-foreground">Date sélectionnée</p>
                      <p className="font-medium">
                        {day.padStart(2, '0')} {MONTHS.find(m => m.value === parseInt(month))?.name} {year}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {placeholder}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {age !== null && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {age} ans
                    </Badge>
                  )}

                  {zodiacSign && ZODIAC_SIGNS[zodiacSign as keyof typeof ZODIAC_SIGNS] && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <span className="text-base">
                        {ZODIAC_SIGNS[zodiacSign as keyof typeof ZODIAC_SIGNS].emoji}
                      </span>
                      <span className="capitalize">{zodiacSign}</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}

      {/* Age Validation Messages */}
      {age !== null && (
        <div className="space-y-2">
          {age < minAge && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3">
                <p className="text-sm text-red-700">
                  ⚠️ Vous devez avoir au moins {minAge} ans pour utiliser МойDate.
                </p>
              </CardContent>
            </Card>
          )}

          {age > maxAge && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-3">
                <p className="text-sm text-amber-700">
                  💡 Veuillez vérifier votre date de naissance.
                </p>
              </CardContent>
            </Card>
          )}

          {age >= minAge && age <= maxAge && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  ✅ Parfait ! Vous avez {age} ans.
                  {zodiacSign && (
                    <span>
                      Votre signe astrologique est {zodiacSign} {ZODIAC_SIGNS[zodiacSign as keyof typeof ZODIAC_SIGNS]?.emoji}
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tips */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-3">
          <p className="text-xs text-blue-700">
            💡 <strong>Conseil :</strong> Votre âge sera calculé automatiquement et votre signe astrologique sera déterminé pour améliorer la compatibilité.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
