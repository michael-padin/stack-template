"use client";

import { Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";

import { deleteItemAction } from "../_actions";

export function ItemDeleteButton({ itemId, itemTitle }: { itemId: string; itemTitle: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setOpen(false);
    startTransition(async () => {
      try {
        await deleteItemAction(itemId);
        // deleteItemAction redirects to /items on success.
      } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
          throw error;
        }
        toast.error(error instanceof Error ? error.message : "Couldn't delete item.");
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => setOpen(true)}
      >
        <Trash2Icon size={14} aria-hidden="true" /> Delete
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{itemTitle}</strong> will be removed from active lists. This is a soft delete
              — the row is kept for audit and can be restored from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
