import { makeRouteHandler } from "@keystatic/next/route-handler";
import { isAdminEnabled } from "@/lib/admin";
import config from "../../../../../keystatic.config";

const handlers = makeRouteHandler({ config });
const disabled = () => new Response("Not found", { status: 404 });

export const GET = isAdminEnabled ? handlers.GET : disabled;
export const POST = isAdminEnabled ? handlers.POST : disabled;
