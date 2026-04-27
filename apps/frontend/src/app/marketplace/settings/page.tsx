"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession, updateUser, changePassword, setPassword } from "@/lib/auth-client";
import { BillingService, type BillingSummary } from "@/lib/billing.service";
import { UsersService } from "@/lib/users.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Briefcase, Code, CreditCard, Lock, User } from "lucide-react";

const defaultNotifications = {
  notificationsEmail: true,
  notificationsMarketing: false,
  notificationsJobAlerts: true,
  notificationsMessages: true,
};

export default function SettingsPage() {
  const { data: sessionData, isPending } = useSession();
  const currentUser = sessionData?.user as
    | {
        name?: string | null;
        email?: string | null;
        role?: "CLIENT" | "FREELANCER" | "ADMIN";
        notificationsEmail?: boolean;
        notificationsMarketing?: boolean;
        notificationsJobAlerts?: boolean;
        notificationsMessages?: boolean;
      }
    | undefined;
  const status = isPending
    ? "loading"
    : sessionData?.session
      ? "authenticated"
      : "unauthenticated";

  const [accountForm, setAccountForm] = useState({ name: "", email: "" });
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);

  const [notifications, setNotifications] = useState(defaultNotifications);
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [notificationSuccess, setNotificationSuccess] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    revokeOtherSessions: true,
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [roleSaving, setRoleSaving] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [roleSuccess, setRoleSuccess] = useState<string | null>(null);

  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [billingActionLoading, setBillingActionLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !currentUser) return;
    setAccountForm({
      name: currentUser.name || "",
      email: currentUser.email || "",
    });

    setNotifications({
      notificationsEmail:
        currentUser.notificationsEmail ?? defaultNotifications.notificationsEmail,
      notificationsMarketing:
        currentUser.notificationsMarketing ?? defaultNotifications.notificationsMarketing,
      notificationsJobAlerts:
        currentUser.notificationsJobAlerts ?? defaultNotifications.notificationsJobAlerts,
      notificationsMessages:
        currentUser.notificationsMessages ?? defaultNotifications.notificationsMessages,
    });
  }, [currentUser, status]);

  const refreshBilling = async () => {
    setBillingLoading(true);
    setBillingError(null);
    try {
      const data = await BillingService.getSummary();
      setBillingSummary(data);
    } catch (error) {
      console.error(error);
      setBillingError("Failed to load billing details.");
    } finally {
      setBillingLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      refreshBilling();
    }
  }, [status]);

  const handleAccountSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "authenticated") return;

    setAccountSaving(true);
    setAccountError(null);
    setAccountSuccess(null);

    try {
      const result = await updateUser({
        name: accountForm.name.trim(),
      });

      if (result?.error) {
        setAccountError(result.error.message || "Failed to update account.");
      } else {
        setAccountSuccess("Account details updated.");
      }
    } catch (error) {
      console.error(error);
      setAccountError("Failed to update account.");
    } finally {
      setAccountSaving(false);
    }
  };

  const handleNotificationsSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "authenticated") return;

    setNotificationSaving(true);
    setNotificationError(null);
    setNotificationSuccess(null);

    try {
      const result = await updateUser({
        notificationsEmail: notifications.notificationsEmail,
        notificationsMarketing: notifications.notificationsMarketing,
        notificationsJobAlerts: notifications.notificationsJobAlerts,
        notificationsMessages: notifications.notificationsMessages,
      });

      if (result?.error) {
        setNotificationError(result.error.message || "Failed to update notifications.");
      } else {
        setNotificationSuccess("Notification preferences updated.");
      }
    } catch (error) {
      console.error(error);
      setNotificationError("Failed to update notifications.");
    } finally {
      setNotificationSaving(false);
    }
  };

  const handlePasswordSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "authenticated") return;

    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordForm.newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);

    try {
      const payload = {
        newPassword: passwordForm.newPassword,
        currentPassword: passwordForm.currentPassword,
        revokeOtherSessions: passwordForm.revokeOtherSessions,
      };

      let result: any;
      if (passwordForm.currentPassword) {
        result = await changePassword(payload);
      } else {
        result = await setPassword({ newPassword: passwordForm.newPassword });
      }

      if (result?.error) {
        setPasswordError(result.error.message || "Failed to update password.");
      } else {
        setPasswordSuccess("Password updated successfully.");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          revokeOtherSessions: true,
        });
      }
    } catch (error) {
      console.error(error);
      setPasswordError("Failed to update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleRoleChange = async (newRole: "CLIENT" | "FREELANCER") => {
    if (status !== "authenticated") return;
    if (currentUser?.role === newRole) return;

    setRoleError(null);
    setRoleSuccess(null);
    setRoleSaving(true);

    try {
      await UsersService.updateProfile({ role: newRole } as any);
      setRoleSuccess(
        `You are now a ${newRole === "CLIENT" ? "Client" : "Freelancer"}. Reloading...`,
      );
      // Reload so session role is refreshed across the app.
      setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      console.error(error);
      setRoleError("Failed to switch role. Please try again.");
    } finally {
      setRoleSaving(false);
    }
  };

  const handleDeposit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setBillingError("Enter a valid deposit amount.");
      return;
    }

    setBillingActionLoading(true);
    setBillingError(null);
    try {
      const data = await BillingService.deposit(amount);
      setBillingSummary(data);
      setDepositAmount("");
    } catch (error) {
      console.error(error);
      setBillingError("Failed to create deposit.");
    } finally {
      setBillingActionLoading(false);
    }
  };

  const handleWithdraw = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setBillingError("Enter a valid withdrawal amount.");
      return;
    }

    setBillingActionLoading(true);
    setBillingError(null);
    try {
      const data = await BillingService.withdraw(amount);
      setBillingSummary(data);
      setWithdrawAmount("");
    } catch (error) {
      console.error(error);
      setBillingError("Failed to create withdrawal.");
    } finally {
      setBillingActionLoading(false);
    }
  };

  const formatCurrency = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  }, []);

  if (status === "loading") {
    return <div className="container mx-auto py-12">Loading settings...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to manage your account settings.
          </p>
          <Button asChild>
            <Link href="/auth/login">Go to login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <nav className="flex flex-col space-y-2">
            <a href="#account" className="font-semibold text-primary flex items-center">
              <User className="mr-2 h-5 w-5" /> Account
            </a>
            <a href="#role" className="hover:text-primary flex items-center">
              <Briefcase className="mr-2 h-5 w-5" /> Account Type
            </a>
            <a href="#security" className="hover:text-primary flex items-center">
              <Lock className="mr-2 h-5 w-5" /> Security
            </a>
            <a href="#notifications" className="hover:text-primary flex items-center">
              <Bell className="mr-2 h-5 w-5" /> Notifications
            </a>
            <a href="#billing" className="hover:text-primary flex items-center">
              <CreditCard className="mr-2 h-5 w-5" /> Billing
            </a>
          </nav>
        </div>

        <div className="md:col-span-3">
          <Card id="account" className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Account Information</h2>
            {accountError && (
              <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {accountError}
              </div>
            )}
            {accountSuccess && (
              <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                {accountSuccess}
              </div>
            )}
            <form onSubmit={handleAccountSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={accountForm.name}
                    onChange={(event) =>
                      setAccountForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={accountForm.email} disabled />
                </div>
              </div>
              <Button type="submit" disabled={accountSaving}>
                {accountSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Card>

          <Card id="role" className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-2">Account Type</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Switch between Client and Freelancer at any time. Your existing
              data, contracts, and wallet are preserved.
            </p>
            {roleError && (
              <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {roleError}
              </div>
            )}
            {roleSuccess && (
              <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                {roleSuccess}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["CLIENT", "FREELANCER"] as const).map((role) => {
                const isActive = currentUser?.role === role;
                const Icon = role === "CLIENT" ? Briefcase : Code;
                const title = role === "CLIENT" ? "Client" : "Freelancer";
                const description =
                  role === "CLIENT"
                    ? "Post jobs, hire talent, and manage contracts."
                    : "Find work, send proposals, and earn securely.";
                return (
                  <button
                    type="button"
                    key={role}
                    disabled={roleSaving || isActive}
                    onClick={() => handleRoleChange(role)}
                    className={`text-left p-5 rounded-xl border-2 transition-all ${
                      isActive
                        ? "border-blue-600 bg-blue-50 cursor-default"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    } ${roleSaving ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{title}</p>
                        {isActive && (
                          <span className="text-xs text-blue-600 font-medium">
                            Current role
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card id="security" className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Security</h2>
            {passwordError && (
              <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                {passwordSuccess}
              </div>
            )}
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: event.target.value,
                    }))
                  }
                  placeholder="Leave blank if you signed up with Google/GitHub"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  id="revokeOtherSessions"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={passwordForm.revokeOtherSessions}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      revokeOtherSessions: event.target.checked,
                    }))
                  }
                />
                <Label htmlFor="revokeOtherSessions" className="text-sm">
                  Sign me out of other devices
                </Label>
              </div>
              <Button type="submit" disabled={passwordSaving}>
                {passwordSaving ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Card>

          <Card id="notifications" className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            {notificationError && (
              <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {notificationError}
              </div>
            )}
            {notificationSuccess && (
              <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                {notificationSuccess}
              </div>
            )}
            <form onSubmit={handleNotificationsSave} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Product news and platform updates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={notifications.notificationsEmail}
                  onChange={(event) =>
                    setNotifications((prev) => ({
                      ...prev,
                      notificationsEmail: event.target.checked,
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Job Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    New matches and project activity.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={notifications.notificationsJobAlerts}
                  onChange={(event) =>
                    setNotifications((prev) => ({
                      ...prev,
                      notificationsJobAlerts: event.target.checked,
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Messages</p>
                  <p className="text-sm text-muted-foreground">
                    Direct messages and contract updates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={notifications.notificationsMessages}
                  onChange={(event) =>
                    setNotifications((prev) => ({
                      ...prev,
                      notificationsMessages: event.target.checked,
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-sm text-muted-foreground">
                    Tips, community highlights, and partner offers.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={notifications.notificationsMarketing}
                  onChange={(event) =>
                    setNotifications((prev) => ({
                      ...prev,
                      notificationsMarketing: event.target.checked,
                    }))
                  }
                />
              </div>
              <Button type="submit" disabled={notificationSaving}>
                {notificationSaving ? "Saving..." : "Save Notification Settings"}
              </Button>
            </form>
          </Card>

          <Card id="billing" className="p-8">
            <h2 className="text-2xl font-bold mb-6">Billing</h2>
            {billingError && (
              <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {billingError}
              </div>
            )}
            {billingLoading ? (
              <p className="text-sm text-muted-foreground">Loading billing details...</p>
            ) : billingSummary ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Wallet Balance</p>
                    <p className="text-2xl font-semibold">
                      {formatCurrency.format(billingSummary.wallet.balance)}
                    </p>
                  </div>
                  <Button variant="outline" onClick={refreshBilling}>
                    Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form onSubmit={handleDeposit} className="space-y-3">
                    <Label htmlFor="deposit">Add funds</Label>
                    <div className="flex gap-2">
                      <Input
                        id="deposit"
                        type="number"
                        min="0"
                        value={depositAmount}
                        onChange={(event) => setDepositAmount(event.target.value)}
                        placeholder="Amount"
                      />
                      <Button type="submit" disabled={billingActionLoading}>
                        Deposit
                      </Button>
                    </div>
                  </form>

                  <form onSubmit={handleWithdraw} className="space-y-3">
                    <Label htmlFor="withdraw">Withdraw funds</Label>
                    <div className="flex gap-2">
                      <Input
                        id="withdraw"
                        type="number"
                        min="0"
                        value={withdrawAmount}
                        onChange={(event) => setWithdrawAmount(event.target.value)}
                        placeholder="Amount"
                      />
                      <Button type="submit" variant="outline" disabled={billingActionLoading}>
                        Withdraw
                      </Button>
                    </div>
                  </form>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                  {billingSummary.transactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No billing activity yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {billingSummary.transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between rounded-md border p-3 text-sm"
                        >
                          <div>
                            <p className="font-medium">{transaction.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency.format(transaction.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">{transaction.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No billing information available.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
