import { NextRequest, NextResponse } from "next/server";
import { processSecureUpload, getActiveStorageService, LocalStorageAdapter } from "@/lib/services/storageService";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided in form data" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await processSecureUpload(buffer, file.name);

    if (!result.securityCheck.isValid) {
      return NextResponse.json(
        {
          error: result.securityCheck.error,
          securityCheck: result.securityCheck
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      fileKey: result.storedFile?.fileKey,
      signedUrl: result.storedFile?.signedUrl,
      securityCheck: result.securityCheck
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process upload" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "File key required" }, { status: 400 });
    }

    const storage = getActiveStorageService();
    if (storage instanceof LocalStorageAdapter) {
      const buffer = storage.getFile(key);
      if (!buffer) {
        return NextResponse.json({ error: "File not found or expired" }, { status: 404 });
      }
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${key.split("/").pop()}"`
        }
      });
    }

    // For S3, redirect to signed URL
    const signedUrl = await storage.getSignedDownloadUrl(key);
    return NextResponse.redirect(signedUrl);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Download failed" }, { status: 500 });
  }
}
