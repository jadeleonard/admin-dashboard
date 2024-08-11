"use client";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { redirect } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface HomeProps {
  email: string;
  password: string;
}
export default function HomeLogin({ email, password }: HomeProps) {
  const [formData, setFormData] = useState({ email, password });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendLoginData = async () => {
    try {
      const data = await fetch("/api/sign-in", {
        method: "POST",
        headers: {
          "Application-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(formData),
      });
      if (data) {
        const user = await data.json();
        setFormData(user);
        redirect("/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }

    return (
      <Card className="w-96">
        <CardContent>
          <CardHeader>Admin Login</CardHeader>
          <form onSubmit={sendLoginData}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {error && <div style={{ color: "red" }}>{error}</div>}
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    );
  };
}
