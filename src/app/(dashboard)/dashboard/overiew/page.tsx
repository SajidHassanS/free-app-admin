"use client";
import { useContextConsumer } from "@/context/Context";
import { Toaster } from "react-hot-toast";
import {
  CheckCircle,
  Hourglass,
  XCircle,
  Mail,
  UserCircle,
  CalendarDays,
  Banknote,
  PlusCircle,
} from "lucide-react";
import { useGetEmailStats } from "@/hooks/apis/useEmails";
import { useGetWithdrawlStats } from "@/hooks/apis/useWithdrawl";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddFaqsModal from "@/components/Forms/forms-modal/emails/AddFaqs";
import MarqueeModal from "@/components/Forms/forms-modal/marquee/AddMarquee";

export default function Home() {
  const { token } = useContextConsumer();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddMarqueeModalOpen, setIsAddMarqueeModalOpen] =
    useState<boolean>(false);

  const { data: emailStatsData } = useGetEmailStats(token);
  const { data: withdrawlStatsData } = useGetWithdrawlStats(token);

  const emailStats = emailStatsData?.data || {};
  const withdrawStats = withdrawlStatsData?.data || {};

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <main className="relative min-h-[calc(100vh-4rem)] w-full bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-6xl p-6 md:p-12 mx-auto space-y-10">
          <div className="flex items-center justify-end gap-2 w-full mb-4">
            <Button
              size="sm"
              className="text-xs flex items-center gap-2 shadow-sm"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Add FAQ
            </Button>
            <Button
              size="sm"
              className="text-xs flex items-center gap-2 shadow-sm"
              onClick={() => setIsAddMarqueeModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Add Marquee
            </Button>
          </div>
          {emailStats && (
            <div className="dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4">
                Email Stats Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total"
                  value={emailStats.total ?? 0}
                  icon={<Mail className="text-blue-500 w-5 h-5" />}
                  bgColor="bg-blue-100 dark:bg-blue-900"
                  textColor="text-blue-700 dark:text-blue-300"
                />
                <StatCard
                  label="Pending"
                  value={emailStats.pending ?? 0}
                  icon={<Hourglass className="text-yellow-500 w-5 h-5" />}
                  bgColor="bg-yellow-100 dark:bg-yellow-900"
                  textColor="text-yellow-700 dark:text-yellow-300"
                />
                <StatCard
                  label="Good"
                  value={emailStats.good ?? 0}
                  icon={<CheckCircle className="text-green-500 w-5 h-5" />}
                  bgColor="bg-green-100 dark:bg-green-900"
                  textColor="text-green-700 dark:text-green-300"
                />
                <StatCard
                  label="Bad"
                  value={emailStats.bad ?? 0}
                  icon={<XCircle className="text-red-500 w-5 h-5" />}
                  bgColor="bg-red-100 dark:bg-red-900"
                  textColor="text-red-700 dark:text-red-300"
                />
              </div>
            </div>
          )}

          {withdrawStats && (
            <div className="dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4">
                Withdrawals Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Withdrawn Today"
                  value={withdrawStats.totalWithdrawnToday ?? 0}
                  icon={<CalendarDays className="text-blue-500 w-5 h-5" />}
                  bgColor="bg-blue-100 dark:bg-blue-900"
                  textColor="text-blue-700 dark:text-blue-300"
                />
                <StatCard
                  label="Withdrawn This Month"
                  value={withdrawStats.totalWithdrawnThisMonth ?? 0}
                  icon={<CalendarDays className="text-emerald-500 w-5 h-5" />}
                  bgColor="bg-emerald-100 dark:bg-emerald-900"
                  textColor="text-emerald-700 dark:text-emerald-300"
                />
                <StatCard
                  label="Pending Requests"
                  value={withdrawStats.pendingWithdrawalsCount ?? 0}
                  icon={<Hourglass className="text-yellow-500 w-5 h-5" />}
                  bgColor="bg-yellow-100 dark:bg-yellow-900"
                  textColor="text-yellow-700 dark:text-yellow-300"
                />
                <StatCard
                  label="Total Withdrawn"
                  value={withdrawStats.totalAmountWithdrawn ?? 0}
                  icon={<Banknote className="text-green-500 w-5 h-5" />}
                  bgColor="bg-green-100 dark:bg-green-900"
                  textColor="text-green-700 dark:text-green-300"
                />
              </div>

              {/* Top Users */}
              {withdrawStats.topUsers?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Top Users by Withdrawals
                  </h3>
                  <div className="space-y-3">
                    {withdrawStats.topUsers.map((user: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700"
                      >
                        <div className="flex items-center gap-3">
                          <UserCircle className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {user.user?.username || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.user?.phone || "N/A"}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {user.totalAmount} PKR
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <AddFaqsModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <MarqueeModal
        open={isAddMarqueeModalOpen}
        onOpenChange={setIsAddMarqueeModalOpen}
        mode="add"
      />
    </>
  );
}

const StatCard = ({
  label,
  value,
  icon,
  bgColor,
  textColor,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}) => (
  <div className={`rounded-lg p-4 flex items-center gap-4 ${bgColor}`}>
    <div className="p-2 rounded-full bg-white dark:bg-zinc-800 shadow">
      {icon}
    </div>
    <div>
      <h4 className={`text-sm font-medium ${textColor}`}>{label}</h4>
      <p className={`text-lg font-semibold ${textColor}`}>{value}</p>
    </div>
  </div>
);
