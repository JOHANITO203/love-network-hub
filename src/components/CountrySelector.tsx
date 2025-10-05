import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { countries, type Country } from '@/data/countries';

interface CountrySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CountrySelector = ({
  value,
  onValueChange,
  placeholder = 'Sélectionnez un pays',
  disabled = false,
  className,
}: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCountry = useMemo(() => {
    return countries.find((country) => country.code === value);
  }, [value]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;

    const query = searchQuery.toLowerCase();
    return countries.filter((country) =>
      country.name.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between h-12',
            !value && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Rechercher un pays..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {filteredCountries.map((country) => (
              <CommandItem
                key={country.code}
                value={country.code}
                onSelect={(currentValue) => {
                  onValueChange(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === country.code ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <span className="text-xl mr-2">{country.flag}</span>
                <span>{country.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
