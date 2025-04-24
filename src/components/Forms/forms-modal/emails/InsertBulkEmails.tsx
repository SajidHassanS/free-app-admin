import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LabelInputContainer from "../../LabelInputContainer";
import { Label } from "@/components/ui/label";
import { insertEmails } from "@/schemas/FormsValidation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { filterStatus } from "@/constant/data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSupplierList, useInsertEmails } from "@/hooks/apis/useEmails";
import { useContextConsumer } from "@/context/Context";
import { Textarea } from "@/components/ui/textarea";

const InsertEmailsModals: React.FC<any> = ({ open, onOpenChange }) => {
  const { token } = useContextConsumer();

  const form = useForm<z.infer<typeof insertEmails>>({
    resolver: zodResolver(insertEmails),
    defaultValues: {
      userUuid: "",
      emails: "",
      status: "",
      remarks: "",
    },
  });

  const { data: list } = useGetSupplierList(token);
  const { mutate: insert, isPending: inserting } = useInsertEmails();

  const onSubmit = (formData: z.infer<typeof insertEmails>) => {
    insert(
      {
        data: formData,
        token: token,
      },
      {
        onSuccess: (res) => {
          if (res?.success) {
            // form.reset();
            onOpenChange();
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-md h-[95vh] overflow-y-auto scrollbar-custom">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold">
            Insert Emails
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 mb-4">
              <LabelInputContainer className="mb-1">
                <Label htmlFor="userUuid" className="dark:text-farmacieGrey">
                  Select Supplier
                </Label>
                <FormField
                  control={form.control}
                  name="userUuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="p-3 py-5 rounded-md border border-estateLightGray">
                            <SelectValue placeholder="Select Supplier" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectGroup>
                              <SelectLabel>Supplier List</SelectLabel>
                              {list?.data?.map((supplier: any) => (
                                <SelectItem
                                  key={supplier.uuid}
                                  value={supplier.uuid}
                                >
                                  {supplier.username}
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

              <LabelInputContainer className="mb-1">
                <Label htmlFor="emails" className="dark:text-farmacieGrey">
                  Enter Emails
                </Label>
                <FormField
                  control={form.control}
                  name="emails"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          placeholder="Paste multiple emails here (comma or newline separated)"
                          className="w-full p-3 rounded-md border border-estateLightGray dark:bg-background dark:text-white outline-none focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </LabelInputContainer>

              {/* Status Dropdown */}
              <LabelInputContainer className="mb-1">
                <Label htmlFor="status" className="dark:text-farmacieGrey">
                  Status
                </Label>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="p-3 py-5 rounded-md border border-estateLightGray">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              {filterStatus.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
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

              {/* Remarks Input */}
              <LabelInputContainer>
                <Label htmlFor="remarks">Remarks</Label>
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter remarks (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </LabelInputContainer>
            </div>

            <Button
              className="w-full text-white font-medium mt-4"
              type="submit"
              disabled={inserting}
            >
              Submit
            </Button>
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mt-6 h-[1px] w-full" />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InsertEmailsModals;
