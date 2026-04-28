import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Проверка размера файла (макс 100MB)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл слишком большой (макс 100MB)' }, { status: 400 });
    }

    // Конвертируем файл в base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Загружаем на Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'intelworld',
      resource_type: 'auto', // автоматически определяет тип (image/video)
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      type: result.resource_type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки файла' }, { status: 500 });
  }
}
