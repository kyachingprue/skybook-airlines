import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

type ImgBBResponse = {
  success: boolean;
  data?: { display_url?: string; url?: string };
  error?: { message?: string };
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "You must be signed in to update your photo." }, { status: 401 });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Profile photo uploads are not configured. Add IMGBB_API_KEY to the server environment." },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Upload must use multipart form data." }, { status: 400 });
  }
  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Choose a JPG, PNG, or WebP image." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image must be smaller than 5 MB." }, { status: 400 });
  }

  const uploadData = new FormData();
  uploadData.set("image", file);
  const uploadUrl = new URL("https://api.imgbb.com/1/upload");
  uploadUrl.searchParams.set("key", apiKey);

  const uploadResponse = await fetch(uploadUrl, { method: "POST", body: uploadData });
  let result: ImgBBResponse;
  try {
    result = (await uploadResponse.json()) as ImgBBResponse;
  } catch {
    return NextResponse.json({ error: "The image hosting service returned an invalid response." }, { status: 502 });
  }

  const imageUrl = result.data?.display_url || result.data?.url;
  if (!uploadResponse.ok || !result.success || !imageUrl) {
    console.error("ImgBB upload failed:", result.error?.message || uploadResponse.statusText);
    return NextResponse.json(
      { error: result.error?.message || "Image upload failed. Please try again." },
      { status: 502 }
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { image: imageUrl },
    select: { id: true, name: true, email: true, image: true, phone: true, createdAt: true },
  });

  return NextResponse.json(user);
}
