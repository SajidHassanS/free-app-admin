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
import { addFaq } from "@/schemas/FormsValidation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInsertEmails } from "@/hooks/apis/useEmails";
import { useContextConsumer } from "@/context/Context";
import { Textarea } from "@/components/ui/textarea";

const AddFaqsModal: React.FC<any> = ({ open, onOpenChange }) => {
  const { token } = useContextConsumer();

  const form = useForm<z.infer<typeof addFaq>>({
    resolver: zodResolver(addFaq),
    defaultValues: {
      faq: "",
      ans: "",
    },
  });

  const { mutate: insert, isPending: inserting } = useInsertEmails();

  const onSubmit = (formData: z.infer<typeof addFaq>) => {
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
      <DialogContent className="max-w-[80vw] md:max-w-md h-96 overflow-y-auto scrollbar-custom">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold">
            Add FAQ
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 mb-4">
              <LabelInputContainer>
                <Label htmlFor="faq">faq</Label>
                <FormField
                  control={form.control}
                  name="faq"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter faq" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </LabelInputContainer>

              <LabelInputContainer className="mb-1">
                <Label htmlFor="ans" className="dark:text-farmacieGrey">
                  Enter ans
                </Label>
                <FormField
                  control={form.control}
                  name="ans"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          placeholder="Paste enter ans"
                          className="w-full p-3 rounded-md border border-estateLightGray dark:bg-background dark:text-white outline-none focus:border-primary"
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

export default AddFaqsModal;
