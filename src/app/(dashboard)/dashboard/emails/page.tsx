"use client";

import React, { useMemo, useRef, useState } from "react";
import { useContextConsumer } from "@/context/Context";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "react-hot-toast";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { format } from "date-fns";
import {
  useBulkEmailUpdate,
  useGetAllEmails,
  useGetDuplicateEmails,
} from "@/hooks/apis/useEmails";
import BulkEmailUpdateModal from "@/components/Forms/forms-modal/emails/BulkEmail";
// import BulkEmailUpdateModal from "@/components/Forms/forms-modal/emails/BulkEmailUpdateModal";

const Emails = () => {
  const { token } = useContextConsumer();
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);
  const [showDuplicateEmails, setShowDuplicateEmails] = useState(false);
  const [selectedEmailToView, setSelectedEmailToView] = useState({});
  const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>([]);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const duplicateSectionRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetAllEmails(token);
  const { data: duplicateEmailsData, isLoading: duplicateLoading } =
    useGetDuplicateEmails(token);

  const emails = data?.data || [];
  const duplicateEmails = duplicateEmailsData?.data || [];

  const handleView = (email: any) => {
    setIsUpdateEmailModalOpen(true);
    setSelectedEmailToView(email);
  };

  const handleShowDuplicate = () => {
    setShowDuplicateEmails(true);
    setTimeout(() => {
      duplicateSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const toggleEmailSelection = (uuid: string) => {
    setSelectedUUIDs((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const duplicateColumns = useMemo(
    () => [
      {
        Header: "Email",
        accessor: "originalEmail.email",
      },
      {
        Header: "Status",
        accessor: "originalEmail.status",
        Cell: ({ row }: any) => (
          <Badge
            className={
              row.original.originalEmail.status === "good"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }
          >
            {row.original.originalEmail.status}
          </Badge>
        ),
      },
      {
        Header: "Duplicate File",
        accessor: "fileName",
      },
      {
        Header: "Uploader",
        accessor: "uploader.username",
      },
      {
        Header: "Original File",
        accessor: "originalEmail.fileName",
      },
    ],
    []
  );

  const emailColumns = useMemo(
    () => [
      {
        Header: "",
        accessor: "select",
        Cell: ({ row }: any) =>
          row.original.status === "bad" && (
            <input
              type="checkbox"
              checked={selectedUUIDs.includes(row.original.uuid)}
              onChange={() => toggleEmailSelection(row.original.uuid)}
            />
          ),
      },
      {
        Header: "Supplier",
        accessor: "user.username",
        Cell: ({ row }: any) => row.original.user?.username || "-",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Password",
        accessor: "password",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: any) => (
          <Badge
            variant={row.original.status === "bad" ? "secondary" : "success"}
            className={
              row.original.status === "bad"
                ? "bg-red-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        Header: "Screenshot",
        accessor: "emailScreenshot",
        Cell: ({ row }: any) => (
          <a
            href={row.original.emailScreenshot}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-xs"
          >
            View Image
          </a>
        ),
      },
      {
        Header: "Remarks",
        accessor: "remarks",
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
            <Button size="icon" variant="destructive" className="h-7 w-7">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [selectedUUIDs]
  );

  return (
    <>
      <Toaster />
      <div className="space-y-4 p-10 rounded-2xl">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h2 className="text-xl font-bold">Available Emails</h2>
          <div className="flex gap-2">
            <Button
              className="text-xs"
              size="sm"
              variant="outline"
              disabled={selectedUUIDs.length === 0}
              onClick={() => setIsBulkUpdateModalOpen(true)}
            >
              Bulk Update
            </Button>
            <Button className="text-xs" size="sm" onClick={handleShowDuplicate}>
              Show Duplicate Email
            </Button>
          </div>
        </div>
        {isLoading ? (
          <SkeletonCard className="w-full h-80" />
        ) : emails.length <= 0 ? (
          <p>No Email Data Available!</p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={emailColumns}
              data={emails}
              paginate={emails.length > 10}
            />
          </div>
        )}

        {showDuplicateEmails && (
          <div ref={duplicateSectionRef} className="pt-10">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Duplicate Emails
            </h2>
            {duplicateLoading ? (
              <SkeletonCard className="w-full h-40" />
            ) : duplicateEmails.length <= 0 ? (
              <p>No Duplicate Emails Found.</p>
            ) : (
              <div className="border rounded-2xl">
                <DataTable
                  columns={duplicateColumns}
                  data={duplicateEmails}
                  paginate={duplicateEmails.length > 10}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <BulkEmailUpdateModal
        open={isBulkUpdateModalOpen}
        onClose={setIsBulkUpdateModalOpen}
        uuids={selectedUUIDs}
      />
    </>
  );
};

export default Emails;
