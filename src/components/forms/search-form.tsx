'use client';

import React, { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, ChevronsUpDown, Check } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CardContent, CardHeader, CardTitle, Card } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import _axios from '@/lib/axios';
import { cn } from '@/lib/utils';

const searchSchema = z.object({
  startingStation: z.string().min(1, 'Nhập điểm đi'),
  endingStation: z.string().min(1, 'Nhập điểm đến'),
  date: z.date(),
});

type InferredSearchSchema = z.infer<typeof searchSchema>;

const defaultValues: InferredSearchSchema = {
  startingStation: '',
  endingStation: '',
  date: new Date(),
};

export default function SearchForm() {
  const [query, setQuery] = useState<InferredSearchSchema>();

  const { data: stationData } = useQuery({
    queryKey: ['stations'],
    queryFn: () => {
      return _axios.get('/station');
    },
  });

  const { data: journeyData } = useQuery({
    queryKey: ['journeys', query],
    queryFn: () => {
      return _axios.get('/journey', { params: query });
    },
  });

  const form = useForm<InferredSearchSchema>({
    defaultValues,
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = async (formData: InferredSearchSchema) => {
    setQuery(formData);
  };

  // console.log(journeyData.data);

  return (
    <div className="space-y-5">
      <Card className="w-2/5">
        <CardHeader>
          <CardTitle>Thông tin hành trình</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="startingStation"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ga đi</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'justify-between',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? stationData?.data?.find(
                                  (station) => station.id === field.value,
                                )?.name
                              : 'Chọn ga đến'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Chọn ga đi" />
                          <CommandList>
                            <CommandEmpty>
                              Không tìm được ga phù hợp
                            </CommandEmpty>
                            <CommandGroup>
                              {stationData?.data?.map((station) => (
                                <CommandItem
                                  value={station.id}
                                  key={station.id}
                                  onSelect={() => {
                                    form.setValue(
                                      'startingStation',
                                      station.id,
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      station.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {station.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endingStation"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ga đến</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'justify-between',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? stationData?.data?.find(
                                  (station) => station.id === field.value,
                                )?.name
                              : 'Chọn ga đến'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Chọn ga đến" />
                          <CommandList>
                            <CommandEmpty>
                              Không tìm được ga phù hợp
                            </CommandEmpty>
                            <CommandGroup>
                              {stationData?.data?.map((station) => (
                                <CommandItem
                                  value={station.id}
                                  key={station.id}
                                  onSelect={() => {
                                    form.setValue('endingStation', station.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      station.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {station.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày đi</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Tìm kiếm</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {journeyData?.data.map((journey) => (
        <Card key={journey.id}>
          <CardHeader>
            <CardTitle>{journey.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
