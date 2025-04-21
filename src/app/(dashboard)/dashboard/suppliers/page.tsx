"use client";

import React, { useMemo, useState } from "react";
import {
  useDeleteSupplier,
  useGetAllSuppliers,
} from "@/hooks/apis/useSupplier";
import { useContextConsumer } from "@/context/Context";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import SupplierModal from "@/components/Forms/forms-modal/supplier/AddSupplier";
import { Toaster } from "react-hot-toast";
import { SweetAlert } from "@/components/alerts/SweetAlert";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import Link from "next/link";

const Suppliers = () => {
  const { token } = useContextConsumer();
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] =
    useState<boolean>(false);
  const [isUpdateSupplierModalOpen, setIsUpdateSupplierModalOpen] =
    useState<boolean>(false);
  const [selectedSupplierToView, setSelectedSupplierToView] = useState({});

  const { data, isLoading } = useGetAllSuppliers(token);
  const { mutate: deleteSupplier, isPending: deletingSupplier } =
    useDeleteSupplier(token);
  const suppliers = data?.data || [];

  const handleView = (supplier: any) => {
    setIsUpdateSupplierModalOpen(true);
    setSelectedSupplierToView(supplier);
  };

  const handleDelete = async (supplierId: any) => {
    const isConfirmed = await SweetAlert(
      "Delete Supplier?",
      "",
      "warning",
      "Yes, delete it!",
      "#15803D"
    );
    if (isConfirmed) {
      deleteSupplier(supplierId);
    }
  };

  const supplierColumns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
        Cell: ({ row }: any) => (
          <Link
            href={`/dashboard/suppliers/supplier/${row.original.uuid}`}
            className="text-primary underline italic"
          >
            {row.original.username}
          </Link>
        ),
      },
      {
        Header: "Phone",
        accessor: "combinedPhone",
        Cell: ({ row }: any) => {
          const countryCode = row.original.countryCode || "-";
          const phone = row.original.phone || "-";
          return (
            <span>
              {countryCode} {phone}
            </span>
          );
        },
      },
      {
        Header: "User Title",
        accessor: "userTitle",
        Cell: ({ value }: any) => value || "-",
      },
      {
        Header: "Refer Code",
        accessor: "referCode",
        Cell: ({ value }: any) => value || "-",
      },
      {
        Header: "Bonus",
        accessor: "bonus",
        Cell: ({ value }: any) =>
          value !== null && value !== undefined ? value : "-",
      },
      {
        Header: "Status",
        accessor: "active",
        Cell: ({ row }: any) => (
          <Badge
            variant={row.original.active ? "success" : "destructive"}
            className={
              row.original.active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {row.original.active ? "Active" : "Inactive"}
          </Badge>
        ),
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
            <Button
              size="icon"
              variant="destructive"
              className="h-7 w-7"
              onClick={() => handleDelete(row.original.uuid)}
            >
              <Trash2 className="h-3.5 w-3.5" />
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
      <div className="space-y-4 p-10 rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">All Suppliers</h2>
          <Button
            className="text-xs"
            size="sm"
            onClick={() => setIsAddSupplierModalOpen(true)}
          >
            Add Supplier
            <Plus className="h-4 w-4 ml-1 font-bold" />
          </Button>
        </div>
        {isLoading ? (
          <SkeletonCard className="w-full h-80" />
        ) : suppliers.length <= 0 ? (
          <p>No Suppliers Data Available!</p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={supplierColumns}
              data={suppliers}
              paginate={suppliers.length > 10}
            />
          </div>
        )}
      </div>
      <SupplierModal
        open={isAddSupplierModalOpen}
        onOpenChange={setIsAddSupplierModalOpen}
        mode="add"
      />
      <SupplierModal
        open={isUpdateSupplierModalOpen}
        onOpenChange={setIsUpdateSupplierModalOpen}
        supplier={selectedSupplierToView}
        mode="view"
      />
    </>
  );
};

export default Suppliers;
