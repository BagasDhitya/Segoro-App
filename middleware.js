import { NextResponse } from "next/server"

export function middleware(req) {
    const cookie = req.cookies.get("token")
    if (!cookie) {
        const url = req.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.redirect(url)
    }
}

export const config = {
    matcher: ["/","/profile/:path*","/venue/:path*","/admin/:path*","/order/:path*","/schedule/:path*"],
}