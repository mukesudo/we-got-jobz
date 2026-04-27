"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "@/lib/auth-client";
import { Bell, Menu, X, ChevronDown } from "lucide-react";
import { MessagesService } from "@/lib/messages.service";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
  }>>([]);

  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const notifRef = React.useRef<HTMLDivElement>(null);

  // Close menus on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch unread messages count for notification badge
  React.useEffect(() => {
    if (!session?.user) return;

    const fetchUnread = async () => {
      try {
        const unreadMessages = await MessagesService.unread();
        setUnreadCount(unreadMessages.length);

        // Build notification items from unread messages
        const notifItems = unreadMessages.slice(0, 5).map((msg) => ({
          id: msg.id,
          title: `New message from ${msg.sender?.name || "Unknown"}`,
          description: msg.content.length > 60 ? msg.content.slice(0, 60) + "..." : msg.content,
          time: formatTime(msg.createdAt),
          read: false,
        }));
        setNotifications(notifItems);
      } catch {
        // Silently fail if messages endpoint is unavailable
      }
    };

    fetchUnread();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [session?.user]);

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    if (diffHrs < 1) return `${Math.max(1, Math.floor(diffMs / 60000))}m ago`;
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/we-got jobz small.svg"
                alt="We Got Jobz"
                width={140}
                height={45}
                className="h-9 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {session?.user ? (
              <>
                {(session.user as any).role === 'CLIENT' ? (
                  <>
                    <Link
                      href="/marketplace/jobs/my-jobs"
                      className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      My Jobs
                    </Link>
                    <Link
                      href="/marketplace/talent"
                      className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Find Talent
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/marketplace/jobs"
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Jobs
                  </Link>
                )}
                <Link
                  href="/marketplace/dashboard"
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/marketplace/contracts"
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Contracts
                </Link>
                <Link
                  href="/marketplace/messages"
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Messages
                </Link>

                {/* Notification Bell */}
                <div className="relative ml-2" ref={notifRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                      </div>

                      {notifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <Bell className="h-8 w-8 mx-auto text-slate-200 mb-2" />
                          <p className="text-sm text-slate-400">No new notifications</p>
                        </div>
                      ) : (
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.map((notif) => (
                            <Link
                              key={notif.id}
                              href="/marketplace/messages"
                              onClick={() => setShowNotifications(false)}
                              className="block px-4 py-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                  notif.read ? "bg-slate-200" : "bg-blue-500"
                                }`} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-slate-900 truncate">
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-slate-500 truncate mt-0.5">
                                    {notif.description}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      <div className="px-4 py-2 border-t border-slate-100">
                        <Link
                          href="/marketplace/messages"
                          onClick={() => setShowNotifications(false)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          View all messages →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative ml-2" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {session.user.image ? (
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-7 h-7 rounded-full object-cover border border-slate-200" 
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden lg:inline max-w-[120px] truncate">
                      {session.user.name || session.user.email}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/marketplace/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/marketplace/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Settings
                      </Link>
                      <div className="border-t border-slate-100 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {session?.user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 mb-2">
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{session.user.name || "User"}</p>
                    <p className="text-xs text-slate-400">{session.user.email}</p>
                  </div>
                </div>

                {(session.user as any).role === 'CLIENT' ? (
                  <>
                    <Link
                      href="/marketplace/jobs/my-jobs"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                    >
                      My Jobs
                    </Link>
                    <Link
                      href="/marketplace/talent"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                    >
                      Find Talent
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/marketplace/jobs"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    Jobs
                  </Link>
                )}
                <Link
                  href="/marketplace/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href="/marketplace/contracts"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Contracts
                </Link>
                <Link
                  href="/marketplace/messages"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Messages
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/marketplace/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Profile
                </Link>
                <Link
                  href="/marketplace/settings"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Settings
                </Link>

                <div className="border-t border-slate-200 mt-2 pt-2">
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
