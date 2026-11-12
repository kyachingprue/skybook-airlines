"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, Mail, Phone, Save, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Profile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  createdAt: string;
};

async function readError(response: Response) {
  const data: unknown = await response.json();
  if (typeof data === "object" && data !== null && "error" in data) {
    return String(data.error);
  }
  return "Could not update your profile.";
}

export default function ProfilePage() {
  const { update } = useSession();
  const fileInput = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/users/me")
      .then(async (response) => {
        if (!response.ok) throw new Error(await readError(response));
        return (await response.json()) as Profile;
      })
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load your profile.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (!response.ok) throw new Error(await readError(response));
      const updated = (await response.json()) as Profile;
      setProfile(updated);
      setName(updated.name ?? "");
      setPhone(updated.phone ?? "");
      await update({ name: updated.name, image: updated.image });
      setSuccess("Your profile has been updated.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.set("image", file);
      const response = await fetch("/api/users/me/avatar", { method: "POST", body: formData });
      if (!response.ok) throw new Error(await readError(response));
      const updated = (await response.json()) as Profile;
      setProfile(updated);
      await update({ name: updated.name, image: updated.image });
      setSuccess("Your profile photo has been updated.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not upload your profile photo.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-3xl" data-reveal>
      <div className="mb-7" data-enter>
        <p className="text-sm font-medium text-sky-600 dark:text-sky-400">Account settings</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Your Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal details and the photo shown on your account.
        </p>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {success && <p role="status" className="mb-4 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{success}</p>}

      {loading ? (
        <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Loading your profile...</CardContent></Card>
      ) : profile ? (
        <div className="space-y-5">
          <Card data-reveal>
            <CardContent className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:p-8">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={`${profile.name || "Your"} profile`}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-24 w-24 rounded-full border object-cover"
                />
              ) : (
                <span className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300">
                  <UserRound className="h-10 w-10" />
                </span>
              )}
              <div className="text-center sm:text-left">
                <p className="font-semibold">{profile.name || "Traveler"}</p>
                <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handleImageChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  disabled={uploading}
                  onClick={() => fileInput.current?.click()}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  {uploading ? "Uploading..." : "Change photo"}
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">JPG, PNG, or WebP. Maximum file size: 5 MB.</p>
              </div>
            </CardContent>
          </Card>

          <Card data-reveal>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>Update the details associated with your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="profile-name" className="text-sm font-medium">Full name</label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="pl-10"
                      minLength={2}
                      maxLength={80}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="profile-email" className="text-sm font-medium">Email address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="profile-email" type="email" value={profile.email} className="pl-10" disabled />
                  </div>
                  <p className="text-xs text-muted-foreground">Email address is managed by your sign-in method.</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="profile-phone" className="text-sm font-medium">Phone number</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="pl-10"
                      maxLength={30}
                      placeholder="Add a phone number"
                    />
                  </div>
                </div>
                <Button type="submit" variant="gradient" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
