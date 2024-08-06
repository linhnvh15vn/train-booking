import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  // Add your component props here
}

export default function TrainCard(props: Props) {
  return (
    <Card className="size-64 cursor-pointer hover:bg-accent">
      <CardHeader>
        <CardTitle className="text-center">HP1</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <h4 className="font-bold">TG đi</h4>
          <span className="text-right">21/07 06:00</span>
        </div>
        <div className="flex items-center justify-between">
          <h4 className="font-bold">TG đến</h4>
          <span className="text-right">21/07 08:25</span>
        </div>
        <div className="mt-4 grid grid-cols-2">
          <div className="flex flex-col items-start">
            <span className="text-xs">SL chỗ đặt</span>
            <span className="font-bold">2</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs">SL chỗ trống</span>
            <span className="font-bold">309</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
