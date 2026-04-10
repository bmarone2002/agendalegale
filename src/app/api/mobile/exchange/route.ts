import { NextResponse } from "next/server";

function applySessionCookies(response: NextResponse, token: string) {
  response.cookies.set("__session", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("__client_uat", `${Math.floor(Date.now() / 1000)}`, {
    path: "/",
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** Prefer POST from mobile WebView: long JWTs can exceed iOS URL limits when using GET. */
export async function POST(req: Request) {
  let token: string | undefined;
  try {
    const body = (await req.json()) as { token?: string };
    token = body.token?.trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!token || token.length < 20) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  applySessionCookies(response, token);
  return response;
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const token = searchParams.get("token")?.trim();

  if (!token || token.length < 20) {
    return NextResponse.redirect(new URL("/sign-in", origin));
  }

  const response = NextResponse.redirect(new URL("/", origin));
  applySessionCookies(response, token);

  return response;
}
