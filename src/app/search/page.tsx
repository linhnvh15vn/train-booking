import React from 'react';

import qs from 'query-string';

import TrainCard from '@/components/train-card';

interface Props {
  searchParams: {
    startingStation: string;
    endingStation: string;
    date: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const url = qs.stringifyUrl({
    url: 'http://127.0.0.1:8080/journey',
    query: searchParams,
  });

  const response = await fetch(url, { cache: 'no-cache' });
  const journeys = await response.json();

  return (
    <div className="flex items-center gap-6">
      {journeys.map((journey) => (
        <TrainCard key={journey.id} />
      ))}
    </div>
  );
}
