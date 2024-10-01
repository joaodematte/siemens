import { ArrowDownUp, Columns2, File } from 'lucide-react';
import { Metadata } from 'next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInverters } from '@/server/queries/inverter/get-inverters';
import { getPanels } from '@/server/queries/panel/get-panels';
import { getSingleLineDiagrams } from '@/server/queries/single-line-diagram/get-single-line-diagrams';
import { createClient } from '@/server/supabase/server';

export const metadata: Metadata = {
  title: 'Topsun Engenharia | Dashboard'
};

export default async function Home() {
  const supabase = createClient();

  const [panels, inverters, singleLineDiagrams] = await Promise.all([
    getPanels(supabase),
    getInverters(supabase),
    getSingleLineDiagrams(supabase)
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Diagramas Gerados
          </CardTitle>
          <File
            size={18}
            strokeWidth={2.5}
            className="h-4 w-4 text-muted-foreground"
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{singleLineDiagrams?.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Painéis Cadastrados
          </CardTitle>
          <Columns2
            size={18}
            strokeWidth={2.5}
            className="h-4 w-4 text-muted-foreground"
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{panels?.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Inversores Cadastrados
          </CardTitle>
          <ArrowDownUp
            size={18}
            strokeWidth={2.5}
            className="h-4 w-4 text-muted-foreground"
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inverters?.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}
