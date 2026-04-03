"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockUsers = [
  { name: "Alex Chen", role: "SSP" },
  { name: "Priya Raman", role: "SE" },
  { name: "Jordan Lee", role: "CSA" },
];

export function MockUserSwitcher() {
  const [selected, setSelected] = useState(mockUsers[0]);
  const initials = useMemo(
    () =>
      selected.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2),
    [selected.name],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" aria-label="Switch mock user">
          <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0078D4] text-[10px] font-bold text-white">
            {initials}
          </span>
          {selected.role}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {mockUsers.map((user) => (
          <DropdownMenuItem key={user.name} onClick={() => setSelected(user)}>
            {user.name} ({user.role})
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Future: Entra/MSAL wiring</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
