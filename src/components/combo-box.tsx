'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Props {
  data: {
    value: string;
    label: string;
  }[];
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
  canCreate?: boolean;
}

export function ComboBox({ data, placeholder, onChange, value, disabled = false, canCreate = false }: Props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleChange = (value: string) => {
    onChange(value);
    setOpen(false);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()));
  }, [data, inputValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value ? (data.find((item) => item.value === value)?.label ?? value) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: triggerRef.current?.offsetWidth }}>
        <Command shouldFilter={false}>
          <CommandInput placeholder="Pesquisar..." value={inputValue} onValueChange={setInputValue} />
          <CommandList>
            {filteredData.length === 0 && canCreate ? (
              <div className="p-1">
                <button
                  onClick={() => handleChange(inputValue)}
                  className="hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative flex w-full cursor-default items-center gap-1 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                >
                  <b>Novo fabricante:</b>
                  {inputValue}
                </button>
              </div>
            ) : (
              <>
                <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                <CommandGroup>
                  {filteredData.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        handleChange(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', value === item.value ? 'opacity-100' : 'opacity-0')} />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
