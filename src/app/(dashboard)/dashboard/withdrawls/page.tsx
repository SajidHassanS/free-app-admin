"use client";

import { useContextConsumer } from "@/context/Context";
import { Toaster } from "react-hot-toast";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import DataTable from "@/components/Table/DataTable";
import { format } from "date-fns";
import {
  useGetWithdrawl,
  useGetWithdrawlBonus,
} from "@/hooks/apis/useWithdrawl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import WithdrawlUpdateModal from "@/components/Forms/forms-modal/withdrawl/UpdateWithdrawl";
import { useMemo, useRef, useState } from "react";

const Withdrawals = () => {
  const { token } = useContextConsumer();
  const bonusSectionRef = useRef<HTMLDivElement>(null);
  const [isUpdateWithdrawlModalOpen, setIsUpdateWithdrawlModalOpen] =
    useState(false);
  const [isUpdateWithdrawlBonusModalOpen, setIsUpdateWithdrawlBonusModalOpen] =
    useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [selectedWithdrawlToView, setSelectedWithdrawlToView] = useState({});

  const { data: withdrawlsData, isLoading: loading } = useGetWithdrawl(token);
  const { data: withdrawlsBonusData, isLoading: bonusDataloading } =
    useGetWithdrawlBonus(token);

  const withdrawls = withdrawlsData?.data || [];
  const withdrawlBonus = withdrawlsBonusData?.data || [];

  const handleView = (data: any) => {
    setIsUpdateWithdrawlModalOpen(true);
    setSelectedWithdrawlToView(data);
  };

  const handleBonusView = (data: any) => {
    setIsUpdateWithdrawlBonusModalOpen(true);
    setSelectedWithdrawlToView(data);
  };

  const handleShowBonus = () => {
    setShowBonus(true);
    setTimeout(() => {
      bonusSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const columns = [
    {
      Header: "User Title",
      accessor: "user.userTitle",
      Cell: ({ row }: any) => row.original.user?.userTitle || "-",
    },
    {
      Header: "Username",
      accessor: "user.username",
    },
    {
      Header: "Method Type",
      accessor: "withdrawalMethod.methodType",
      Cell: ({ row }: any) => row.original.withdrawalMethod?.methodType || "-",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }: any) => {
        const status = row.original.status;
        let colorClass = "bg-gray-100 text-gray-700";
        if (status === "approved") colorClass = "bg-green-100 text-green-700";
        else if (status === "pending")
          colorClass = "bg-yellow-100 text-yellow-700";
        else if (status === "rejected") colorClass = "bg-red-100 text-red-700";

        return <Badge className={`capitalize ${colorClass}`}>{status}</Badge>;
      },
    },
    {
      Header: "Account Number",
      accessor: "withdrawalMethod.accountNumber",
      Cell: ({ row }: any) =>
        row.original.withdrawalMethod?.accountNumber || "-",
    },
    {
      Header: "Account Title",
      accessor: "withdrawalMethod.accountTitle",
      Cell: ({ row }: any) =>
        row.original.withdrawalMethod?.accountTitle || "-",
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ row }: any) =>
        format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
    },
    {
      Header: "",
      accessor: "actions",
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-end gap-2.5">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7"
            onClick={() => handleView(row.original)}
          >
            <Pencil className="h-3.5 w-3.5 text-gray-600" />
          </Button>
        </div>
      ),
    },
  ];

  const withdrawlBonusColoumns = useMemo(
    () => [
      {
        Header: "User Title",
        accessor: "user.userTitle",
        Cell: ({ row }: any) => row.original.user?.userTitle || "-",
      },
      {
        Header: "Username",
        accessor: "user.username",
      },
      {
        Header: "Type",
        accessor: "bonus.type",
        Cell: ({ row }: any) =>
          row.original.bonus?.type?.charAt(0).toUpperCase() +
            row.original.bonus?.type?.slice(1) || "-",
      },
      {
        Header: "Amount",
        accessor: "bonus.amount",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: any) => {
          const status = row.original.status;
          let colorClass = "bg-gray-100 text-gray-700";
          if (status === "approved") colorClass = "bg-green-100 text-green-700";
          else if (status === "pending")
            colorClass = "bg-yellow-100 text-yellow-700";
          else if (status === "rejected")
            colorClass = "bg-red-100 text-red-700";

          return <Badge className={`capitalize ${colorClass}`}>{status}</Badge>;
        },
      },
      {
        Header: "Method Type",
        accessor: "withdrawalMethod.methodType",
        Cell: ({ row }: any) =>
          row.original.withdrawalMethod?.methodType || "-",
      },
      {
        Header: "Account Number",
        accessor: "withdrawalMethod.accountNumber",
        Cell: ({ row }: any) =>
          row.original.withdrawalMethod?.accountNumber || "-",
      },
      {
        Header: "Account Title",
        accessor: "withdrawalMethod.accountTitle",
        Cell: ({ row }: any) =>
          row.original.withdrawalMethod?.accountTitle || "-",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ row }: any) =>
          format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
      },
      {
        Header: "",
        accessor: "actions",
        Cell: ({ row }: any) => (
          <div className="flex items-center justify-end gap-2.5">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => handleBonusView(row.original)}
            >
              <Pencil className="h-3.5 w-3.5 text-gray-600" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Toaster />
      <div className="space-y-4 p-10 rounded-2xl max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary mb-4">Withdrawals</h2>
          <Button className="text-xs" size="sm" onClick={handleShowBonus}>
            Show Bonus Withdrawals
          </Button>
        </div>
        {loading ? (
          <SkeletonCard className="w-full h-40" />
        ) : withdrawls.length <= 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No withdrawal data available.
          </p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={columns}
              data={withdrawls}
              paginate={withdrawls.length > 10}
            />
          </div>
        )}

        {showBonus && (
          <div ref={bonusSectionRef} className="pt-10">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Bonus Withdrawals
            </h2>
            {bonusDataloading ? (
              <SkeletonCard className="w-full h-40" />
            ) : withdrawlBonus.length <= 0 ? (
              <p>No Duplicate Emails Found.</p>
            ) : (
              <div className="border rounded-2xl">
                <DataTable
                  columns={withdrawlBonusColoumns}
                  data={withdrawlBonus}
                  paginate={withdrawlBonus.length > 10}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <WithdrawlUpdateModal
        withdrawl={selectedWithdrawlToView}
        open={isUpdateWithdrawlModalOpen}
        onClose={setIsUpdateWithdrawlModalOpen}
      />
      <WithdrawlUpdateModal
        withdrawl={selectedWithdrawlToView}
        open={isUpdateWithdrawlBonusModalOpen}
        onClose={setIsUpdateWithdrawlBonusModalOpen}
        bonus
      />
    </>
  );
};

export default Withdrawals;
