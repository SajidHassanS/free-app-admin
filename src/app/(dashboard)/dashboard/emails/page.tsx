"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useContextConsumer } from "@/context/Context";
import { Button } from "@/components/ui/button";
import { Filter, Pencil, Search, Trash2, X } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "react-hot-toast";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useGetAllEmails, useGetDuplicateEmails } from "@/hooks/apis/useEmails";
import BulkEmailUpdateModal from "@/components/Forms/forms-modal/emails/BulkEmail";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { filterEmailSchema } from "@/schemas/FormsValidation";
import LabelInputContainer from "@/components/Forms/LabelInputContainer";
import { Input } from "@/components/ui/input";
import { filterStatus } from "@/constant/data";
import { useSearchParams } from "next/navigation";
import InsertEmailsModals from "@/components/Forms/forms-modal/emails/InsertBulkEmails";

const Emails = () => {
  const { token } = useContextConsumer();
  const searchParams = useSearchParams();
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);
  const [showDuplicateEmails, setShowDuplicateEmails] = useState(false);
  const [selectedEmailToView, setSelectedEmailToView] = useState({});
  // const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>([]);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [isInsertEmailsModalOpen, setIsInsertEmailsModalOpen] = useState(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const duplicateSectionRef = useRef<HTMLDivElement>(null);

  const [filterCriteria, setFilterCriteria] = useState<{
    status: string;
    startDate?: string;
    endDate?: string;
  }>({
    status: "",
  });

  const form = useForm<z.infer<typeof filterEmailSchema>>({
    resolver: zodResolver(filterEmailSchema),
    defaultValues: {
      status: "",
    },
  });

  const { data, isLoading } = useGetAllEmails(token, filterCriteria);
  const { data: duplicateEmailsData, isLoading: duplicateLoading } =
    useGetDuplicateEmails(token);

  const duplicateEmails = duplicateEmailsData?.data || [];

  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const handleFilterSubmit = (criteria: any) => {
    setFilterCriteria({
      ...criteria,
    });
  };

  const filteredEmails = useMemo(() => {
    if (!data || !data?.data) return [];
    return data?.data
      .filter((emails: any) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          emails.user?.username?.toLowerCase().includes(searchLower) ||
          emails.email?.toLowerCase().includes(searchLower)
        );
      })
      .filter((email: any) => {
        if (filterCriteria.status && email.status !== filterCriteria.status)
          return false;

        if (filterCriteria.startDate) {
          const emailCreatedAt = new Date(email.createdAt);
          const startDate = new Date(filterCriteria.startDate);
          if (emailCreatedAt < startDate) return false;
        }

        if (filterCriteria.endDate) {
          const emailCreatedAt = new Date(email.createdAt);
          const endDate = new Date(filterCriteria.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (emailCreatedAt > endDate) return false;
        }

        return true;
      });
  }, [data, searchQuery, filterCriteria]);

  const handleShowDuplicate = () => {
    setShowDuplicateEmails(true);
    setTimeout(() => {
      duplicateSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  useEffect(() => {
    const scrollParam = searchParams.get("scroll");
    if (scrollParam === "duplicate") {
      setShowDuplicateEmails(true);
      setTimeout(() => {
        duplicateSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [searchParams]);

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
    ],
    []
  );

  return (
    <>
      <Toaster />
      <div className="space-y-4 p-10 rounded-2xl">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Available Emails</h2>
          <div className="flex gap-2">
            <Button
              className="text-xs"
              size="sm"
              variant="outline"
              onClick={() => setIsBulkUpdateModalOpen(true)}
            >
              Bulk Update
            </Button>
            <Button
              className="text-xs"
              size="sm"
              onClick={() => setIsInsertEmailsModalOpen(true)}
            >
              Bulk Insert Emails
            </Button>
            <Button className="text-xs" size="sm" onClick={handleShowDuplicate}>
              Show Duplicate Email
            </Button>
          </div>
        </div>
        <div>
          <p className="text-md lg:pl-2 font-normal pb-4 text-left dark:text-farmacieGrey">
            Filter and search the email from the list.
          </p>
          <Card
            className={cn(
              "w-full py-6 rounded-xl text-center bg-primary/10",
              showSearch ? "mb-2" : "mb-6"
            )}
          >
            <CardContent className="p-0 px-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFilterSubmit)}>
                  <div className="lg:grid grid-cols-3 xl:grid-cols-6 gap-4">
                    {/* Status */}
                    <LabelInputContainer>
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    {filterStatus.map((item) => (
                                      <SelectItem
                                        key={item.value}
                                        value={item.value}
                                      >
                                        {item.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>

                    {/* Start Date */}
                    <LabelInputContainer>
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                placeholder="Start Date"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>

                    {/* End Date */}
                    <LabelInputContainer>
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                placeholder="End Date"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>

                    {/* Order By */}
                    <LabelInputContainer>
                      <FormField
                        control={form.control}
                        name="orderBy"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Order By" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="createdAt">
                                    Created At
                                  </SelectItem>
                                  <SelectItem value="updatedAt">
                                    Updated At
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </LabelInputContainer>

                    <div className="flex gap-2">
                      <Button
                        className="lg:col-span-1 w-full text-white font-medium"
                        type="submit"
                      >
                        Filter <Filter size={18} className="ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        className="lg:col-span-1 w-full dark:text-farmacieWhite font-medium border border-primary"
                        type="button"
                        onClick={() => setShowSearch(true)}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          {showSearch && (
            <Card className="w-full py-6 rounded-xl text-center bg-primary/10 mb-6">
              <CardContent className="p-0 px-6">
                <div className="flex justify-between items-center gap-2">
                  <div className="relative max-w-md lg:max-w-lg w-full">
                    <Input
                      placeholder="Search supplier by username or email"
                      type="text"
                      className="outline-none border py-5 border-primary rounded-full pl-12 w-full"
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <Search className="absolute left-3.5 -translate-y-1/2 bottom-0.5 w-5 h-5 text-gray-400" />
                  </div>
                  <Button
                    size="icon"
                    className="text-white font-medium"
                    type="button"
                    onClick={() => setShowSearch(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        {isLoading ? (
          <SkeletonCard className="w-full h-80" />
        ) : filteredEmails.length <= 0 ? (
          <p>No Email Data Available!</p>
        ) : (
          <div className="border rounded-2xl">
            <DataTable
              columns={emailColumns}
              data={filteredEmails}
              paginate={filteredEmails.length > 100}
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
        // uuids={selectedUUIDs}
      />
      <InsertEmailsModals
        open={isInsertEmailsModalOpen}
        onOpenChange={setIsInsertEmailsModalOpen}
      />
    </>
  );
};

export default Emails;
