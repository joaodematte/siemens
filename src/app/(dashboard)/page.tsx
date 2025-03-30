import { ArrowDownUp, Columns2, File } from 'lucide-react';
import { Metadata } from 'next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInvertersLength } from '@/server/queries/inverter/get-inverters-length';
import { getPanelsLength } from '@/server/queries/panel/get-panels-length';
import { getSingleLineDiagramsLength } from '@/server/queries/single-line-diagram/get-single-line-diagrams-length';
import { createClient } from '@/server/supabase/server';

export const metadata: Metadata = {
  title: 'Topsun Engenharia | Dashboard'
};

export default async function Home() {
  const supabase = await createClient();

  const [panelsLength, invertersLength, singleLineDiagramsLength] = await Promise.all([
    getPanelsLength(supabase),
    getInvertersLength(supabase),
    getSingleLineDiagramsLength(supabase)
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Diagramas Gerados</CardTitle>
          <File size={18} strokeWidth={2.5} className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{singleLineDiagramsLength}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Painéis Cadastrados</CardTitle>
          <Columns2 size={18} strokeWidth={2.5} className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{panelsLength}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inversores Cadastrados</CardTitle>
          <ArrowDownUp size={18} strokeWidth={2.5} className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invertersLength}</div>
        </CardContent>
      </Card>
    </div>
  );
}
