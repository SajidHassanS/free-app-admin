"use client";

import React, { useMemo, useState } from "react";
import { useDeleteSupplier } from "@/hooks/apis/useSupplier";
import { useContextConsumer } from "@/context/Context";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "react-hot-toast";
import PasswordModal from "@/components/Forms/forms-modal/passwords/AddPassword";
import { useGetAllPasswords } from "@/hooks/apis/usePasswords";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { format } from "date-fns";

const Passwords = () => {
  const { token } = useContextConsumer();
  const [isAddPasswordModalOpen, setIsAddPasswordModalOpen] =
    useState<boolean>(false);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] =
    useState<boolean>(false);
  const [selectedPasswordToView, setSelectedPasswordToView] = useState({});

  const { data, isLoading } = useGetAllPasswords(token);
  // const { mutate: deletePassword, isPending: deletingPassword } =
  //   useDeletePassword(token);

  const passwords = data?.data || [];

  console.log(data, "passwordspaswwords");

  const handleView = (password: any) => {
    setIsUpdatePasswordModalOpen(true);
    setSelectedPasswordToView(password);
  };

  // const handleDelete = async (supplierId: any) => {
  //   const isConfirmed = await SweetAlert(
  //     "Delete Supplier?",
  //     "",
  //     "warning",
  //     "Yes, delete it!",
  //     "#15803D"
  //   );
  //   if (isConfirmed) {
  //     deletePassword(supplierId);
  //   }
  // };

  const passwordColumns = useMemo(
    () => [
      {
        Header: "Password",
        accessor: "password",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ row }: any) =>
          format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a"),
      },
      {
        Header: "Updated At",
        accessor: "updatedAt",
        Cell: ({ row }: any) =>
          format(new Date(row.original.updatedAt), "dd MMM yyyy, hh:mm a"),
      },
      {
        Header: "Status",
        accessor: "active",
        Cell: ({ row }: any) => (
          <Badge variant={row.original.active ? "success" : "destructive"}>
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
              // onClick={() => handleDelete(row.original.uuid)}
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
          <h2 className="text-xl font-bold">All Passwords</h2>
          <Button
            className="text-xs"
            size="sm"
            onClick={() => setIsAddPasswordModalOpen(true)}
          >
            Create Password
            <Plus className="h-4 w-4 ml-1 font-bold" />
          </Button>
        </div>
        {isLoading ? (
          <SkeletonCard className="w-full h-80" />
        ) : passwords.length <= 0 ? (
          <p>No Password Data Available!</p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={passwordColumns}
              data={passwords}
              paginate={passwords.length > 10}
            />
          </div>
        )}
      </div>
      <PasswordModal
        open={isAddPasswordModalOpen}
        onOpenChange={setIsAddPasswordModalOpen}
        mode="add"
      />
      <PasswordModal
        open={isUpdatePasswordModalOpen}
        onOpenChange={setIsUpdatePasswordModalOpen}
        password={selectedPasswordToView}
        mode="view"
      />
    </>
  );
};

export default Passwords;
