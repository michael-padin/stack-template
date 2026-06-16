"use client";

import { useRouter } from "next/navigation";
import { KeyRoundIcon, UserIcon } from "lucide-react";
import { useState, useTransition, type FormEvent } from "react";
import { toast } from "@repo/ui/components/sonner";

import { authClient } from "@repo/auth/client";

import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

type ProfileFormProps = {
  userId: string;
  initialName: string;
  email: string;
};

export function ProfileForm({ userId: _userId, initialName, email }: ProfileFormProps) {
  return (
    <div className="grid gap-6">
      <ProfileDetailsCard initialName={initialName} email={email} />
      <ChangePasswordCard />
    </div>
  );
}

function ProfileDetailsCard({ initialName, email }: { initialName: string; email: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  const trimmed = name.trim();
  const dirty = trimmed !== initialName.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!trimmed) {
      setError("Name can't be empty.");
      return;
    }
    if (!dirty) return;
    startTransition(async () => {
      const { error: updateError } = await authClient.updateUser({
        name: trimmed,
      });
      if (updateError) {
        setError(updateError.message ?? "Couldn't update profile.");
        return;
      }
      toast.success("Profile updated.");
      router.refresh();
    });
  }

  return (
    <Card className="p-5 sm:p-6">
      <header className="mb-4 flex items-center gap-2">
        <UserIcon size={16} aria-hidden="true" className="text-muted-foreground" />
        <h2 className="text-sm font-semibold">Account details</h2>
      </header>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="profile-name">Display name</Label>
          <Input
            id="profile-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maria Cruz"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            readOnly
            disabled
            aria-describedby="profile-email-help"
          />
          <p id="profile-email-help" className="text-muted-foreground text-xs">
            Email changes aren&rsquo;t self-serve yet. Ask another admin to update it for you.
          </p>
        </div>
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button type="submit" disabled={pending || !dirty}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ChangePasswordCard() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOther, setRevokeOther] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from the current one.");
      return;
    }
    startTransition(async () => {
      const { error: changeError } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: revokeOther,
      });
      if (changeError) {
        setError(
          changeError.message ??
            "Couldn't change password. Check your current password and try again.",
        );
        return;
      }
      toast.success(
        revokeOther ? "Password changed. Other sessions signed out." : "Password changed.",
      );
      reset();
      router.refresh();
    });
  }

  return (
    <Card className="p-5 sm:p-6">
      <header className="mb-4 flex items-center gap-2">
        <KeyRoundIcon size={16} aria-hidden="true" className="text-muted-foreground" />
        <h2 className="text-sm font-semibold">Change password</h2>
      </header>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="cp-current">Current password</Label>
          <Input
            id="cp-current"
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="cp-new">New password</Label>
            <Input
              id="cp-new"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cp-confirm">Confirm new password</Label>
            <Input
              id="cp-confirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            className="size-3.5"
            checked={revokeOther}
            onChange={(e) => setRevokeOther(e.target.checked)}
          />
          Sign out other devices currently signed in as me
        </label>
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Change password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
