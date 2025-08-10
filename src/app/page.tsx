"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white">
      <Card className="w-full max-w-sm rounded-[28px] shadow-sm border-0">
        <CardContent className="pt-8">
          {/* Logo + App name */}
          <div className="flex flex-col items-center">
            <Image
              src="/icons/imagen.svg"
              alt="MinibusApp"
              width={92}
              height={92}
              priority
            />
            <h2 className="mt-3 text-[#14a292] text-2xl font-semibold">
              MinibusApp
            </h2>
          </div>

          {/* Título sección */}
          <h1 className="mt-6 mb-4 text-2xl font-semibold text-black">Log In</h1>

          <form className="space-y-4">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-black/90">
                Email:
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email:"
                required
                className="
                  h-11 rounded-full
                  border-2 border-[#14a292]
                  bg-white text-black
                  placeholder:text-[#14a292]
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-[#14a292] focus-visible:ring-offset-2
                  focus-visible:border-[#14a292]
                "
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-black/90">
                Password:
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password:"
                required
                className="
                  h-11 rounded-full
                  border-2 border-[#14a292]
                  bg-white text-black
                  placeholder:text-[#14a292]
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-[#14a292] focus-visible:ring-offset-2
                  focus-visible:border-[#14a292]
                "
              />
              <div className="text-right">
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-500"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="pb-8">
          {/* Botón principal */}
          <Link href="/home" className="w-full">
            <Button
              type="button"
              className="
                w-full h-12 rounded-full
                bg-[#14a292] text-white text-base
                hover:bg-[#108578]
              "
            >
              Registrate
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
