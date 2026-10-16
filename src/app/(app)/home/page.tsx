import type { Metadata } from "next";
import { routeTitle } from "@/components/layout/routes";
import { HomePage } from "@/features/home/pages/home-page";

export const metadata: Metadata = {
  title: routeTitle("/home"),
};

export const instant = false;

export default HomePage;
