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
import { bulkEmailUpdate } from "@/schemas/FormsValidation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import {
  useBulkEmailUpdate,
  useBulkEmailUpdateUuid,
} from "@/hooks/apis/useEmails";
import { useContextConsumer } from "@/context/Context";
import { Textarea } from "@/components/ui/textarea";

interface BulkEmailUpdateModalProps {
  open: boolean;
  onClose: () => void;
  uuids?: string[];
}

const BulkEmailUpdateModal: React.FC<BulkEmailUpdateModalProps> = ({
  open,
  onClose,
  uuids = [],
}) => {
  const { token } = useContextConsumer();

  const form = useForm<z.infer<typeof bulkEmailUpdate>>({
    resolver: zodResolver(bulkEmailUpdate),
    defaultValues: {
      emails: "",
      status: "",
      remarks: "",
    },
  });

  const { mutate: bulkEmaisUpdate, isPending: updating } = useBulkEmailUpdate();
  const { mutate: bulkUpdateByUuids, isPending: updatingByUuids } =
    useBulkEmailUpdateUuid();

  const isUuidMode = uuids.length > 0;

  const onSubmit = (formData: z.infer<typeof bulkEmailUpdate>) => {
    if (!isUuidMode && !formData.emails?.trim()) {
      form.setError("emails", {
        message: "Please enter at least one email",
      });
      return;
    }

    const payload = {
      data: isUuidMode ? { uuids, ...formData } : formData,
      token,
    };

    const onSuccessHandler = (res: any) => {
      if (res?.success) {
        form.reset();
        onClose();
      }
    };

    if (isUuidMode) {
      bulkUpdateByUuids(payload, { onSuccess: onSuccessHandler });
    } else {
      bulkEmaisUpdate(payload, { onSuccess: onSuccessHandler });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-w-[80vw] md:max-w-md h-[60vh] lg:h-[55vh] overflow-y-auto scrollbar-custom",
          isUuidMode && "lg:h-[40vh]"
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold">
            Bulk Email Update
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 mb-4">
              {!isUuidMode && (
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
              )}
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
                        <Select
                          onValueChange={(value: string) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "p-3 py-5 rounded-md border border-estateLightGray focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-primary/20"
                            )}
                          >
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectGroup>
                              <SelectLabel>Select Status</SelectLabel>
                              {filterStatus.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
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
              <LabelInputContainer>
                <Label htmlFor="remarks">Remarks</Label>
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter remarks"
                          type="text"
                          id="remarks"
                          className="outline-none focus:border-primary"
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
              disabled={updating || updatingByUuids}
              type="submit"
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

export default BulkEmailUpdateModal;
