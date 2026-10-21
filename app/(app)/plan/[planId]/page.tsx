import type { Metadata } from "next";
import { Suspense } from "react";
import { MESSAGES } from "@/lib/constants/messages";
import { PlanDetailView } from "@/features/plans/components/PlanDetailView/PlanDetailView";

interface PlanDetailPageProps {
  params: Promise<{
    planId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PlanDetailPageProps): Promise<Metadata> {
  const { planId } = await params;
  return {
    title: `${MESSAGES.PLANS.DETAIL.TITLE} #${planId} | ${MESSAGES.BRAND.NAME}`,
  };
}

async function PlanContentWrapper({ params }: PlanDetailPageProps) {
  const { planId } = await params;
  return <PlanDetailView planId={planId} />;
}

export default function PlanDetailPage({ params }: PlanDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-zinc-400">
          {MESSAGES.PLANS.DETAIL.LOADING}
        </div>
      }
    >
      <PlanContentWrapper params={params} />
    </Suspense>
  );
}
