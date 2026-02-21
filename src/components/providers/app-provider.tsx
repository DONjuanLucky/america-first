"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { signOut as authSignOut, useSession } from "next-auth/react";

type UserProfile = {
  name: string;
  email: string;
  zip: string;
  isAdmin: boolean;
};

type Preferences = {
  trackedIssues: string[];
  trackedReps: string[];
  homeModules: string[];
  justFacts: boolean;
};

type AppContextValue = {
  user: UserProfile | null;
  preferences: Preferences;
  ready: boolean;
  signOut: () => void;
  toggleIssue: (issue: string) => void;
  toggleModule: (module: string) => void;
  toggleJustFacts: () => void;
  setTrackedReps: (reps: string[]) => void;
};

const defaultPreferences: Preferences = {
  trackedIssues: ["Economy", "Healthcare", "Education"],
  trackedReps: ["NY-14 Representative", "State Senator District 23"],
  homeModules: ["brief", "queue", "signals"],
  justFacts: true,
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [ready, setReady] = useState(status !== "loading");

  useEffect(() => {
    if (status === "loading") {
      setReady(false);
      return;
    }

    if (status === "unauthenticated") {
      setUser(null);
      setPreferences(defaultPreferences);
      setReady(true);
      return;
    }

    if (status === "authenticated" && session?.user) {
      setUser({
        name: session.user.name ?? "Citizen",
        email: session.user.email ?? "",
        zip: session.user.zip ?? "",
        isAdmin: Boolean(session.user.isAdmin),
      });
      void (async () => {
        const response = await fetch("/api/preferences", { cache: "no-store" });
        if (response.ok) {
          const data = (await response.json()) as Preferences;
          setPreferences(data);
        }
        setReady(true);
      })();
      return;
    }

    setReady(true);
  }, [session, status]);

  const savePreferences = (nextPreferences: Preferences) => {
    setPreferences(nextPreferences);

    void fetch("/api/preferences", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nextPreferences),
    });
  };

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      preferences,
      ready,
      signOut: () => {
        void authSignOut({ callbackUrl: "/" });
      },
      toggleIssue: (issue) => {
        const hasIssue = preferences.trackedIssues.includes(issue);
        const nextPreferences = {
          ...preferences,
          trackedIssues: hasIssue
            ? preferences.trackedIssues.filter((item) => item !== issue)
            : [...preferences.trackedIssues, issue],
        };
        savePreferences(nextPreferences);
      },
      toggleModule: (module) => {
        const hasModule = preferences.homeModules.includes(module);
        const nextPreferences = {
          ...preferences,
          homeModules: hasModule
            ? preferences.homeModules.filter((item) => item !== module)
            : [...preferences.homeModules, module],
        };
        savePreferences(nextPreferences);
      },
      toggleJustFacts: () => {
        savePreferences({
          ...preferences,
          justFacts: !preferences.justFacts,
        });
      },
      setTrackedReps: (reps) => {
        savePreferences({
          ...preferences,
          trackedReps: reps,
        });
      }
    }),
    [preferences, ready, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return context;
}
