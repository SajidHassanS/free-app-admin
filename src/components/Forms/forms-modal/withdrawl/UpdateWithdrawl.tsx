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
import { withdrawlUpdate } from "@/schemas/FormsValidation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { withdrawlOption } from "@/constant/data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContextConsumer } from "@/context/Context";
import {
  useWithdrawlBonusUpdate,
  useWithdrawlUpdate,
} from "@/hooks/apis/useWithdrawl";

const WithdrawlUpdateModal: React.FC<any> = ({
  open,
  onClose,
  withdrawl,
  bonus,
}) => {
  const { token } = useContextConsumer();

  const form = useForm<z.infer<typeof withdrawlUpdate>>({
    resolver: zodResolver(withdrawlUpdate),
    defaultValues: {
      action: "",
    },
  });

  const { mutate: updateWithdrawl, isPending: updating } = useWithdrawlUpdate();
  const { mutate: updateBonusWithdrawl, isPending: bonusUpdating } =
    useWithdrawlBonusUpdate();

  const onSubmit = (data: z.infer<typeof withdrawlUpdate>) => {
    const payload = {
      data: {
        withdrawalUuid: withdrawl.uuid,
        action: data.action,
      },
      token,
    };

    if (bonus) {
      updateBonusWithdrawl(payload, {
        onSuccess: (res) => {
          if (res?.success) {
            form.reset();
            onClose();
          }
        },
      });
    } else {
      updateWithdrawl(payload, {
        onSuccess: (res) => {
          if (res?.success) {
            form.reset();
            onClose();
          }
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[80vw] md:max-w-md h-[40vh] overflow-y-auto scrollbar-custom">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold">
            Handle Withdrawl
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 mb-4">
              <LabelInputContainer className="mb-1">
                <Label htmlFor="action" className="dark:text-farmacieGrey">
                  Action
                </Label>
                <FormField
                  control={form.control}
                  name="action"
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
                            <SelectValue placeholder="Select Action" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectGroup>
                              <SelectLabel>Select Action</SelectLabel>
                              {withdrawlOption.map((status) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value}
                                  disabled={status.value === "bad"}
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
            </div>
            <Button
              className="w-full text-white font-medium mt-4"
              type="submit"
              disabled={updating || bonusUpdating}
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

export default WithdrawlUpdateModal;
